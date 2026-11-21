"""
Muzik latar untuk video Clear Aligner (V4). Disintesis sendiri — bebas hak cipta.

  python3 audio/generate_v4.py

0-606f: pluck ringan + pad (ragu-ragu); 606f "Haa" → bloom: loceng kaca + beat lembut
(F-C-Dm-Bb, 96 BPM). Muzik ditunduk (duck) di bawah public/v4/vo-aligner.wav.
Output: public/v4/music-aligner.wav
"""
import os
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
FPS = 30
DUR = 1620 / FPS
HERE = os.path.dirname(__file__)
ROOT = os.path.join(HERE, '..', 'public', 'v4')
rng = np.random.default_rng(4)
N = int(SR * DUR)
BLOOM = 606 / FPS
BPM = 96
BEAT = 60 / BPM
BAR = BEAT * 4


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def filt(kind, x, cut):
    b, a = butter(2, np.array(cut) / (SR / 2), kind)
    return lfilter(b, a, x)


def place(buf, sig, at):
    i = int(at * SR)
    if i >= len(buf) or i < 0:
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def saw(freq, n, detune=0.0):
    ph = np.cumsum(np.full(n, freq * (1 + detune)) / SR) + rng.random()
    return 2 * (ph % 1) - 1


def pad(freqs, dur, amp=0.05):
    n = int(dur * SR)
    x = sum(saw(f, n, d) for f in freqs for d in (-0.005, 0.006)) / (2 * len(freqs))
    x = filt('low', x, 1400)
    a = np.minimum(1, np.arange(n) / (0.8 * SR))
    r = np.minimum(1, (n - np.arange(n)) / (0.8 * SR))
    return x * a * r * amp


def pluck(freq, dur=0.5, amp=0.1):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(4 * np.pi * freq * t) * np.exp(-t / 0.05)
    return x * np.exp(-t / 0.16) * amp


def bell(freq, dur=1.8, amp=0.07):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * freq * m * t) * g * np.exp(-t / d) for m, g, d in ((1, 1, 1.1), (2.0, 0.35, 0.6), (3.01, 0.15, 0.25), (4.2, 0.08, 0.12)))
    return x * amp


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(48 + 80 * np.exp(-t / 0.03)) / SR
    return np.sin(ph) * np.exp(-t / 0.15) * 0.45


def shaker():
    n = int(0.08 * SR)
    return filt('high', rng.standard_normal(n), 6000) * np.exp(-np.arange(n) / SR / 0.02) * 0.05


CHORDS = [[53, 57, 60], [48, 52, 55], [50, 53, 57], [46, 50, 53]]  # F C Dm Bb
mus = np.zeros(N)

# Bahagian 1 — ragu-ragu, jarang
t0 = 0.0
k = 0
while t0 < BLOOM:
    ch = CHORDS[k % 4]
    place(mus, pad([midi(n) for n in ch], BAR + 0.8, 0.035), t0)
    for b, idx in enumerate([0, 2, 1, 2]):
        place(mus, pluck(midi(ch[idx] + 12), 0.5, 0.06), t0 + b * BEAT)
    t0 += BAR
    k += 1

# swell sebelum bloom
n = int(1.6 * SR)
sw = filt('band', rng.standard_normal(n), [800, 5000]) * np.linspace(0, 1, n) ** 2 * 0.05
place(mus, sw, BLOOM - 1.6)

# Bahagian 2 — bloom
t0 = BLOOM
k = 0
END = DUR - 1.0
while t0 < END:
    ch = CHORDS[k % 4]
    place(mus, pad([midi(n) for n in ch] + [midi(ch[0] - 12)], BAR + 0.8, 0.05), t0)
    for s in range(8):
        note = ch[[0, 1, 2, 1, 0, 2, 1, 2][s]] + 24
        place(mus, bell(midi(note), 1.2, 0.035), t0 + s * BEAT / 2)
    for b in range(4):
        place(mus, kick() * (1.0 if b % 2 == 0 else 0.55), t0 + b * BEAT)
        place(mus, shaker(), t0 + b * BEAT + BEAT / 2)
    t0 += BAR
    k += 1
# akhir: loceng panjang
place(mus, bell(midi(77), 3.0, 0.1), END - 0.2)
place(mus, bell(midi(72), 3.0, 0.07), END - 0.2)

# duck di bawah suara
sr_vo, vo = wavfile.read(os.path.join(ROOT, 'vo-aligner.wav'))
vo = vo.astype(np.float64)
if vo.ndim > 1:
    vo = vo.mean(axis=1)
vo /= (np.abs(vo).max() + 1e-9)
idx = (np.arange(N) / SR * sr_vo).astype(int)
env = np.zeros(N)
ok = idx < len(vo)
env[ok] = np.abs(vo[idx[ok]])
win = int(0.25 * SR)
env = np.convolve(env, np.ones(win) / win, mode='same')
env = np.clip(env / (env.max() * 0.35), 0, 1)
gain = 1 - 0.55 * env

mus *= gain
fade = np.minimum(1, (N - np.arange(N)) / (1.2 * SR)) * np.minimum(1, np.arange(N) / (0.3 * SR))
mus *= fade
mus = mus / np.abs(mus).max() * 0.32
st = np.stack([mus, np.roll(mus, 220)], axis=1)
wavfile.write(os.path.join(ROOT, 'music-aligner.wav'), SR, (st * 32767).astype(np.int16))
print('ok', DUR)
