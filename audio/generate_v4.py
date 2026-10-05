"""
Muzik latar untuk video Gusi Menyusut (V4). Disintesis sendiri — bebas hak cipta.

  python3 audio/generate_v4.py

Struktur (30fps, 96 BPM, F–C–Dm–Bb): 0-176f intro lembut (pad + pluck);
176f masuk bass & hi-hat; 316f masuk kick; 706-830f "amaran" — tinggal pad sahaja;
830f beat kembali; 1202f hentakan penutup. Muzik ditunduk bawah suara vo-gusi.wav.
Output: public/audio/v4-music.wav (SFX dikongsi dengan V2/V3)
"""
import os
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
FPS = 30
DUR = 1290 / FPS
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, '..', 'public', 'audio')
rng = np.random.default_rng(21)
N = int(SR * DUR)

BPM = 96
BEAT = 60 / BPM
BAR = BEAT * 4
END_HIT = 1202 / FPS
BASS_IN = 176 / FPS
KICK_IN = 316 / FPS
WARN = (706 / FPS, 830 / FPS)


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


pads = np.zeros(N)
arp = np.zeros(N)
bass = np.zeros(N)
beat_l = np.zeros(N)
fx = np.zeros(N)

CH = [  # F C Dm Bb
    (41, (57, 60, 65)),
    (36, (55, 60, 64)),
    (38, (57, 62, 65)),
    (34, (53, 58, 62)),
]
K, HC = kick(), hat()
in_warn = lambda t: WARN[0] <= t < WARN[1]
kick_times = []
bar = 0
while bar * BAR < END_HIT - 0.05:
    t0 = bar * BAR
    root, tones = CH[bar % 4]
    for n_ in tones:
        place(pads, pad_note(midi(n_), BAR + 0.3, 1400 if in_warn(t0) else 2200, 0.09), t0)
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= END_HIT - 0.05 or in_warn(tb):
            continue
        if tb >= KICK_IN - 0.01:
            place(beat_l, K * 0.7, tb)
            kick_times.append(tb)
        if tb >= BASS_IN - 0.01:
            place(beat_l, HC, tb + BEAT / 2)
            place(bass, bass_note(midi(root), BEAT * 0.9), tb)
    seq = [tones[0], tones[2], tones[1] + 12, tones[2], tones[0] + 12, tones[2], tones[1], tones[2]]
    for s in range(8):
        ts = t0 + s * BEAT / 2
        if ts < END_HIT - 0.05 and not in_warn(ts):
            place(arp, pluck(midi(seq[s] + 12)) * 0.8, ts)
    bar += 1

# bunyi "berhenti" pada amaran + riser kecil kembali ke beat
place(beat_l, K * 0.9, WARN[0])
rn = int(1.6 * SR)
rt = np.arange(rn) / SR
place(fx, hp(rng.standard_normal(rn), 1500) * (rt / rt[-1]) ** 2 * 0.12, WARN[1] - 1.6)

# hentakan penutup (F major)
for n_ in (41, 53, 60, 65, 69, 77):
    place(pads, pad_note(midi(n_), 3.0, 2600, 0.14), END_HIT)
place(arp, bell(midi(84), 2.5) * 1.1, END_HIT)
place(arp, bell(midi(77), 2.5), END_HIT + 0.06)
place(beat_l, K * 1.1, END_HIT)

d = int(BEAT * 0.75 * SR)
arp_d = arp.copy()
arp_d[d:] += arp[:-d] * 0.35
arp_d[2 * d:] += arp[: -2 * d] * 0.15

duck = np.ones(N)
for tk in kick_times:
    i = int(tk * SR)
    m = min(N - i, int(0.3 * SR))
    duck[i:i + m] = np.minimum(duck[i:i + m], 1 - 0.45 * np.exp(-np.arange(m) / SR / 0.09))

mix = beat_l + (bass + pads + arp_d * 0.9) * duck + fx

# tunduk di bawah suara (vo-gusi.wav bermula pada 0s)
sr_v, vo = wavfile.read(os.path.join(OUT, 'vo-gusi.wav'))
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
vg[int(END_HIT * SR):] = 1
mix = mix * vg

fade = int(1.4 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)
mix = mix / np.max(np.abs(mix)) * 1.1
mix = np.tanh(mix) * 0.8


def stereo(x, width=0.2):
    k = int(0.012 * SR)
    r = np.concatenate([np.zeros(k), x[:-k]])
    return np.stack([x, x * (1 - width) + r * width], axis=1)


wavfile.write(os.path.join(OUT, 'v4-music.wav'), SR, (np.clip(stereo(mix, 0.25), -1, 1) * 32767).astype(np.int16))
print('siap', DUR)
