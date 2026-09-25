"""
Jana muzik latar & kesan bunyi (SFX) untuk video Izznara v2.
Semua bunyi disintesis sendiri — bebas hak cipta.

  python3 audio/generate.py

Output: public/audio/music.wav + public/audio/sfx-*.wav
Tempo 120 BPM -> 1 beat = 0.5s = 15 frame @30fps, 1 bar = 60 frame.
"""
import os
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
DURATION = 1410 / 30  # sama dengan tempoh video (frame / fps)
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
rng = np.random.default_rng(7)

N = int(SR * DURATION)
t_all = np.arange(N) / SR


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, cut, order=2):
    b, a = butter(order, cut / (SR / 2), 'low')
    return lfilter(b, a, x)


def hp(x, cut, order=2):
    b, a = butter(order, cut / (SR / 2), 'high')
    return lfilter(b, a, x)


def bp(x, lo, hi, order=2):
    b, a = butter(order, [lo / (SR / 2), hi / (SR / 2)], 'band')
    return lfilter(b, a, x)


def place(buf, sig, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def env_exp(n, decay):
    return np.exp(-np.arange(n) / SR / decay)


def saw(freq, n, detune=0.0):
    ph = np.cumsum(np.full(n, freq * (1 + detune)) / SR)
    ph += rng.random()
    return 2 * (ph % 1) - 1


# ---------- instrumen ----------
def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t / 0.03)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.22)
    click = lp(rng.standard_normal(n), 4000) * np.exp(-t / 0.004) * 0.3
    return (body + click) * 0.95


def clap():
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    noise = bp(rng.standard_normal(n), 900, 5000)
    e = np.zeros(n)
    for off in (0, 0.011, 0.022):
        k = int(off * SR)
        e[k:] += np.exp(-(t[: n - k]) / (0.012 if off < 0.02 else 0.12))
    return noise * e * 0.45


def hat(open_=False):
    n = int((0.25 if open_ else 0.05) * SR)
    noise = hp(rng.standard_normal(n), 7000)
    return noise * env_exp(n, 0.07 if open_ else 0.012) * (0.2 if open_ else 0.13)


def crash():
    n = int(2.2 * SR)
    noise = hp(rng.standard_normal(n), 3500)
    return noise * env_exp(n, 0.6) * 0.22


def pad_note(freq, dur):
    n = int(dur * SR)
    x = sum(saw(freq, n, d) for d in (-0.006, 0.0, 0.007))
    x = lp(x / 3, 1800)
    a = np.minimum(1, np.arange(n) / (0.08 * SR))
    r = np.minimum(1, (n - np.arange(n)) / (0.1 * SR))
    return x * a * r * 0.12


def pluck(freq, dur=0.22):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = saw(freq, n) * 0.6 + np.sign(np.sin(2 * np.pi * freq * t)) * 0.4
    x = lp(x, 3200)
    return x * np.exp(-t / 0.07) * 0.13


def bass_note(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = saw(freq, n) * 0.7 + np.sin(2 * np.pi * freq * t) * 0.6
    x = lp(x, 520)
    a = np.minimum(1, np.arange(n) / (0.005 * SR))
    return x * a * np.exp(-t / 0.35) * 0.35


def bell(freq, dur=1.4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sum(
        np.sin(2 * np.pi * freq * m * t) * g * np.exp(-t / d)
        for m, g, d in ((1, 1, 0.9), (2.76, 0.4, 0.35), (5.4, 0.2, 0.15), (2, 0.3, 0.6))
    )
    return x * 0.22


# ---------- susunan lagu ----------
CHORDS = {
    'Am': (45, (57, 60, 64)),
    'F': (41, (53, 57, 60)),
    'C': (48, (55, 60, 64)),
    'G': (43, (55, 59, 62)),
}
LOOP = ['Am', 'F', 'C', 'G']
DROP_BAR = 2
END_BAR = 22
SECTION_BARS = (5, 8, 11, 15, 19)  # sempadan scene (frame 300, 480, 660, 900, 1140)

drums = np.zeros(N)
bass = np.zeros(N)
pads = np.zeros(N)
arp = np.zeros(N)
fx = np.zeros(N)
kick_times = []

K, CL, HC, HO, CR = kick(), clap(), hat(), hat(True), crash()

for bar in range(0, END_BAR + 1):
    t0 = bar * BAR
    name = 'C' if bar == END_BAR else ('Am' if bar == 0 else 'F' if bar == 1 else LOOP[(bar - DROP_BAR) % 4])
    root, tones = CHORDS[name]

    if bar < DROP_BAR:
        # intro: pad lembut + hi-hat membina
        for f in tones:
            place(pads, lp(pad_note(midi(f), BAR), 700 + bar * 700), t0)
        if bar == 1:
            for s in range(16):
                place(drums, HC * (0.4 + s / 20), t0 + s * BEAT / 4)
            for s in range(8, 16):  # snare roll
                place(drums, CL * (0.3 + (s - 8) / 10), t0 + s * BEAT / 4)
        continue

    if bar == END_BAR:
        # hentakan penutup
        place(drums, K * 1.1, t0)
        place(drums, CR * 1.3, t0)
        for f in tones + (tones[0] + 12,):
            place(pads, pad_note(midi(f), 3.2) * 1.6, t0)
        place(bass, bass_note(midi(root), 2.5) * 1.2, t0)
        place(arp, bell(midi(tones[2] + 12)) * 0.8, t0)
        kick_times.append(t0)
        continue

    # groove penuh
    for b in range(4):
        tb = t0 + b * BEAT
        place(drums, K, tb)
        kick_times.append(tb)
        if b in (1, 3):
            place(drums, CL, tb)
        place(drums, HO, tb + BEAT / 2)
        place(drums, HC, tb + BEAT / 4)
        place(drums, HC * 0.7, tb + 3 * BEAT / 4)
        # bass off-beat berdenyut
        place(bass, bass_note(midi(root), BEAT / 2 * 0.9), tb + BEAT / 2)
        if b == 0:
            place(bass, bass_note(midi(root - 12), BEAT / 2 * 0.8) * 0.8, tb)

    for f in tones:
        place(pads, pad_note(midi(f), BAR), t0)

    seq = [tones[0], tones[1], tones[2], tones[0] + 12, tones[2], tones[1], tones[0] + 12, tones[2]]
    for s in range(16):
        place(arp, pluck(midi(seq[s % 8] + 12)), t0 + s * BEAT / 4)

    if bar in SECTION_BARS or bar == DROP_BAR:
        place(drums, CR, t0)

# riser sebelum drop
rn = int(BAR * 2 * SR)
rt = np.arange(rn) / SR
riser = hp(rng.standard_normal(rn), 1500) * (rt / rt[-1]) ** 2 * 0.18
sweep = np.sin(2 * np.pi * np.cumsum(200 + 1400 * (rt / rt[-1]) ** 2) / SR) * (rt / rt[-1]) ** 3 * 0.05
place(fx, riser + sweep, 0)

# sidechain: pad, bass & arp "mengepam" mengikut kick
duck = np.ones(N)
for tk in kick_times:
    i = int(tk * SR)
    m = min(N - i, int(0.3 * SR))
    duck[i : i + m] = np.minimum(duck[i : i + m], 1 - 0.65 * np.exp(-np.arange(m) / SR / 0.09))

# delay ringkas untuk arp
d = int(BEAT * 0.75 * SR)
arp_d = arp.copy()
arp_d[d:] += arp[:-d] * 0.35
arp_d[2 * d :] += arp[: -2 * d] * 0.15

mix = drums + (bass * 1.0 + pads * 1.1 + arp_d * 0.9) * duck + fx

# fade out di hujung
fade = int(1.2 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)

# master: normalise + soft clip
mix = mix / np.max(np.abs(mix)) * 1.15
mix = np.tanh(mix) * 0.89


def stereo(x, width=0.0):
    # pelebaran ringkas: haas pada saluran kanan
    k = int(0.012 * SR)
    r = np.concatenate([np.zeros(k), x[:-k]]) if width else x
    return np.stack([x, x * (1 - width) + r * width], axis=1)


def save(name, x, width=0.0):
    os.makedirs(OUT, exist_ok=True)
    s = stereo(x, width)
    wavfile.write(os.path.join(OUT, name), SR, (np.clip(s, -1, 1) * 32767).astype(np.int16))


save('music.wav', mix, width=0.25)

# ---------- SFX ----------
def whoosh(dur=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    seg = n // 20
    for k in range(20):  # sapuan band-pass naik
        c = 400 + 5000 * (k / 19) ** 1.5
        chunk = bp(noise[k * seg : (k + 1) * seg + 400], c * 0.6, min(c * 1.6, SR / 2 - 100))[:seg]
        out[k * seg : k * seg + len(chunk)] = chunk
    e = np.sin(np.pi * t / dur) ** 2
    return out * e * 0.6


def pop():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = 900 * np.exp(-t / 0.03) + 300
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035) * 0.5


def ting():
    return bell(midi(88), 1.2) * 1.6 + bell(midi(95), 1.2) * 0.8


def impact():
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    f = 30 + 80 * np.exp(-t / 0.08)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.4)
    noise = lp(rng.standard_normal(n), 1200) * np.exp(-t / 0.15) * 0.4
    return (body + noise) * 0.8


for name, sig in (('sfx-whoosh.wav', whoosh()), ('sfx-pop.wav', pop()), ('sfx-ting.wav', ting()), ('sfx-impact.wav', impact())):
    sig = sig / np.max(np.abs(sig)) * 0.8
    save(name, sig)

print('OK', round(DURATION, 2), 's')
