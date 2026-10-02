"""
Muzik latar & SFX untuk video Rawatan Akar (V3). Disintesis sendiri — bebas hak cipta.

  python3 audio/generate_v3.py

Struktur (30fps): 0-770f (0-25.7s) tegang: drone + degupan jantung;
771f (25.7s) "drop" harapan: beat lembut + arpeggio (C-G-Am-F, 100 BPM);
akhir ~1672f hentakan penutup. Muzik "ditunduk" (duck) bawah suara vo-akar.wav.
Output: public/audio/v3-music.wav + public/audio/sfx-zap.wav + sfx-chime.wav
"""
import os
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
FPS = 30
DUR = 1750 / FPS
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, '..', 'public', 'audio')
rng = np.random.default_rng(11)
N = int(SR * DUR)

DROP = 771 / FPS          # saat
END_HIT = 1672 / FPS
BPM = 100
BEAT = 60 / BPM
BAR = BEAT * 4


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def _f(kind, x, cut, order=2):
    b, a = butter(order, np.array(cut) / (SR / 2), kind)
    return lfilter(b, a, x)


lp = lambda x, c, o=2: _f('low', x, c, o)
hp = lambda x, c, o=2: _f('high', x, c, o)
bp = lambda x, lo, hi, o=2: _f('band', x, [lo, hi], o)


def place(buf, sig, at):
    i = int(at * SR)
    if i >= len(buf) or i < 0:
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def saw(freq, n, detune=0.0):
    ph = np.cumsum(np.full(n, freq * (1 + detune)) / SR) + rng.random()
    return 2 * (ph % 1) - 1


def pad_note(freq, dur, bright=1800, amp=0.12):
    n = int(dur * SR)
    x = sum(saw(freq, n, d) for d in (-0.006, 0.0, 0.007)) / 3
    x = lp(x, bright)
    a = np.minimum(1, np.arange(n) / (0.6 * SR))
    r = np.minimum(1, (n - np.arange(n)) / (0.5 * SR))
    return x * a * r * amp


def pluck(freq, dur=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = lp(saw(freq, n) * 0.6 + np.sign(np.sin(2 * np.pi * freq * t)) * 0.4, 3000)
    return x * np.exp(-t / 0.09) * 0.12


def bell(freq, dur=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * freq * m * t) * g * np.exp(-t / d)
            for m, g, d in ((1, 1, 1.0), (2.76, 0.4, 0.4), (5.4, 0.2, 0.15), (2, 0.3, 0.7)))
    return x * 0.2


def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(45 + 100 * np.exp(-t / 0.03)) / SR
    return (np.sin(ph) * np.exp(-t / 0.2) + lp(rng.standard_normal(n), 3000) * np.exp(-t / 0.004) * 0.25) * 0.8


def thump(gain=1.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(38 + 55 * np.exp(-t / 0.05)) / SR
    return np.sin(ph) * np.exp(-t / 0.12) * gain


def hat():
    n = int(0.05 * SR)
    return hp(rng.standard_normal(n), 7000) * np.exp(-np.arange(n) / SR / 0.012) * 0.1


def bass_note(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = lp(saw(freq, n) * 0.6 + np.sin(2 * np.pi * freq * t) * 0.7, 480)
    return x * np.minimum(1, np.arange(n) / (0.01 * SR)) * np.exp(-t / 0.5) * 0.3


drone = np.zeros(N)
beat_l = np.zeros(N)
pads = np.zeros(N)
arp = np.zeros(N)
bass = np.zeros(N)
heart = np.zeros(N)
fx = np.zeros(N)

# ---- Bahagian 1: tegang (0 - DROP) ----
t = np.arange(int(DROP * SR)) / SR
dr = np.sin(2 * np.pi * midi(33) * t) * 0.25 + np.sin(2 * np.pi * midi(40) * t) * 0.12
dr += lp(saw(midi(45), len(t), 0.003), 400) * 0.08
dr *= np.minimum(1, t / 2.0) * (0.8 + 0.2 * np.sin(2 * np.pi * t / 6))
drone[: len(t)] += dr
for tt in np.arange(0, DROP, 1.0):  # degupan: setiap 1s (30 frame) — "lub-dub"
    if tt + 0.2 < DROP - 2.5:
        place(heart, thump(1.0), tt)
        place(heart, thump(0.6), tt + 0.2)
# pad minor naik
for i, ch in enumerate(((57, 60, 64), (57, 60, 64), (55, 59, 62), (53, 57, 60))):
    for n_ in ch:
        place(pads, pad_note(midi(n_), 7.0, 900 + i * 300, 0.07), i * 6.2)
# riser ke drop
rn = int(3.2 * SR)
rt = np.arange(rn) / SR
riser = hp(rng.standard_normal(rn), 1200) * (rt / rt[-1]) ** 2 * 0.2
sweep = np.sin(2 * np.pi * np.cumsum(180 + 1500 * (rt / rt[-1]) ** 2) / SR) * (rt / rt[-1]) ** 3 * 0.06
place(fx, riser + sweep, DROP - 3.2)
place(fx, hp(rng.standard_normal(int(2.0 * SR)), 3500) * np.exp(-np.arange(int(2.0 * SR)) / SR / 0.7) * 0.2, DROP)
place(heart, thump(1.4), DROP)

# ---- Bahagian 2: harapan (DROP - akhir) ----
CH = [  # C G Am F
    (36, (55, 60, 64)),
    (43, (55, 59, 62)),
    (45, (57, 60, 64)),
    (41, (53, 57, 60)),
]
K, HC = kick(), hat()
bar = 0
kick_times = []
while DROP + bar * BAR < END_HIT - 0.05:
    t0 = DROP + bar * BAR
    root, tones = CH[bar % 4]
    for n_ in tones:
        place(pads, pad_note(midi(n_), BAR + 0.3, 2000, 0.1), t0)
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= END_HIT - 0.05:
            break
        if bar >= 1:
            place(beat_l, K * 0.8, tb)
            kick_times.append(tb)
        place(beat_l, HC, tb + BEAT / 2)
        place(bass, bass_note(midi(root), BEAT * 0.9), tb)
    seq = [tones[0], tones[1], tones[2], tones[1] + 12, tones[2], tones[1], tones[0] + 12, tones[1]]
    for s in range(8):
        ts = t0 + s * BEAT / 2
        if ts < END_HIT - 0.05:
            place(arp, pluck(midi(seq[s] + 12)), ts)
    bar += 1

# hentakan penutup (C major)
for n_ in (48, 55, 60, 64, 72):
    place(pads, pad_note(midi(n_), 3.5, 2600, 0.16), END_HIT)
place(arp, bell(midi(84), 2.5) * 1.2, END_HIT)
place(arp, bell(midi(79), 2.5), END_HIT + 0.06)
place(beat_l, K * 1.1, END_HIT)

# delay arp
d = int(BEAT * 0.75 * SR)
arp_d = arp.copy()
arp_d[d:] += arp[:-d] * 0.35
arp_d[2 * d:] += arp[: -2 * d] * 0.15

# sidechain kick
duck = np.ones(N)
for tk in kick_times:
    i = int(tk * SR)
    m = min(N - i, int(0.3 * SR))
    duck[i:i + m] = np.minimum(duck[i:i + m], 1 - 0.5 * np.exp(-np.arange(m) / SR / 0.09))

mix = drone + heart * 0.55 + beat_l + (bass + pads + arp_d * 0.9) * duck + fx

# tunduk di bawah suara (vo-akar.wav bermula pada 0s)
sr_v, vo = wavfile.read(os.path.join(OUT, 'vo-akar.wav'))
vo = vo.astype(np.float64)
if vo.ndim > 1:
    vo = vo.mean(axis=1)
vo = np.abs(vo) / 32768.0
win = int(sr_v * 0.12)
env = np.convolve(vo, np.ones(win) / win, mode='same')
env = np.clip(env / (np.percentile(env, 90) + 1e-9), 0, 1)
env = np.convolve(env, np.ones(int(sr_v * 0.25)) / int(sr_v * 0.25), mode='same')
env = np.interp(np.arange(N) / SR, np.arange(len(env)) / sr_v, env, right=0)
vg = 1 - 0.62 * np.clip(env * 1.4, 0, 1)
vg[int(END_HIT * SR):] = 1  # biar hentakan penutup bernafas
mix = mix * vg

fade = int(1.4 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)
mix = mix / np.max(np.abs(mix)) * 1.1
mix = np.tanh(mix) * 0.8


def stereo(x, width=0.2):
    k = int(0.012 * SR)
    r = np.concatenate([np.zeros(k), x[:-k]])
    return np.stack([x, x * (1 - width) + r * width], axis=1)


def save(name, x, width=0.0):
    wavfile.write(os.path.join(OUT, name), SR, (np.clip(stereo(x, width), -1, 1) * 32767).astype(np.int16))


save('v3-music.wav', mix, 0.25)


# ---- SFX ----
def zap(dur=0.35):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    x = bp(x, 1800, 9000) * (np.sin(2 * np.pi * 70 * t) > -0.3)
    crack = np.sin(2 * np.pi * np.cumsum(1400 * np.exp(-t / 0.08) + 300) / SR)
    return (x * 0.35 + crack * 0.25) * np.exp(-t / 0.13)


def chime():
    n = int(1.4 * SR)
    out = np.zeros(n)
    for i, m in enumerate((79, 83, 88)):
        place(out, bell(midi(m), 1.2) * 0.8, i * 0.09)
    return out


save('sfx-zap.wav', zap())
save('sfx-chime.wav', chime())
print('siap', DUR)
