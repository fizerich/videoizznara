"""
Jana muzik latar lembut untuk video V3 "Hilang 1 Gigi" (talking-head).
Disintesis sendiri — bebas hak cipta. Sengaja lembut & tanpa dram semasa
doktor bercakap, kemudian naik penuh di kad penutup.

  python3 audio/generate_v3.py

Output: public/audio/bed-v3.wav
"""
import os
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
BPM = 100
BEAT = 60 / BPM
BAR = BEAT * 4
DURATION = 1277 / 30  # sama dengan tempoh video V3
END_CARD = 1127 / 30  # kad penutup bermula
END_HIT = 1217 / 30  # hentakan penutup
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
rng = np.random.default_rng(11)
N = int(SR * DURATION)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def filt(x, cut, kind='low', order=2):
    b, a = butter(order, np.array(cut) / (SR / 2), kind)
    return lfilter(b, a, x)


def place(buf, sig, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def saw(freq, n, detune=0.0):
    ph = np.cumsum(np.full(n, freq * (1 + detune)) / SR) + rng.random()
    return 2 * (ph % 1) - 1


def pad(freq, dur, cut=900):
    n = int(dur * SR)
    x = sum(saw(freq, n, d) for d in (-0.005, 0.0, 0.006)) / 3
    x = filt(x, cut)
    a = np.minimum(1, np.arange(n) / (0.35 * SR))
    r = np.minimum(1, (n - np.arange(n)) / (0.4 * SR))
    return x * a * r * 0.1


def pluck(freq, dur=0.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(4 * np.pi * freq * t)
    return x * np.exp(-t / 0.18) * 0.07


def bass(freq, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(4 * np.pi * freq * t)
    a = np.minimum(1, t / 0.02)
    return x * a * np.exp(-t / 1.2) * 0.22


def kick():
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    f = 48 + 90 * np.exp(-t / 0.035)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.2) * 0.7


def shaker():
    n = int(0.06 * SR)
    return filt(rng.standard_normal(n), 6500, 'high') * np.exp(-np.arange(n) / SR / 0.015) * 0.05


def bell(freq, dur=2.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * freq * m * t) * g * np.exp(-t / d) for m, g, d in ((1, 1, 1.4), (2.76, 0.35, 0.5), (2, 0.3, 0.9))) * 0.16


CHORDS = [(48, (60, 64, 67)), (43, (59, 62, 67)), (45, (60, 64, 69)), (41, (60, 65, 69))]  # C G Am F

pads = np.zeros(N)
lows = np.zeros(N)
arp = np.zeros(N)
drums = np.zeros(N)

bar = 0
while bar * BAR < END_HIT:
    t0 = bar * BAR
    root, tones = CHORDS[bar % 4]
    full = t0 >= END_CARD - BAR
    for f in tones:
        place(pads, pad(midi(f), BAR + 0.3, 1600 if full else 900), t0)
    place(lows, bass(midi(root), BAR), t0)
    seq = [tones[0], tones[1], tones[2], tones[1] + 12, tones[2], tones[1], tones[0] + 12, tones[2]]
    for s in range(8):
        place(arp, pluck(midi(seq[s] + 12)) * (0.8 if s % 2 else 1.0), t0 + s * BEAT / 2)
    bar += 1

# groove ringan hanya di kad penutup
t = END_CARD
while t < END_HIT:
    place(drums, kick(), t)
    for k in range(4):
        place(drums, shaker() * (1.4 if k == 2 else 0.8), t + k * BEAT / 4)
    t += BEAT

# hentakan penutup: kord C penuh + loceng
for f in (48, 60, 64, 67, 72):
    place(pads, pad(midi(f), 2.2, 2000) * 1.5, END_HIT)
place(drums, kick() * 1.2, END_HIT)
place(arp, bell(midi(84)), END_HIT)
place(arp, bell(midi(91)) * 0.5, END_HIT)

d = int(BEAT * 0.75 * SR)
arp_d = arp.copy()
arp_d[d:] += arp[:-d] * 0.3

mix = pads + lows + arp_d + drums
mix = mix / np.max(np.abs(mix)) * 0.85
fade = int(1.0 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)
mix[: int(0.3 * SR)] *= np.linspace(0, 1, int(0.3 * SR))

k = int(0.012 * SR)
right = np.concatenate([np.zeros(k), mix[:-k]]) * 0.3 + mix * 0.7
st = np.stack([mix, right], axis=1)
os.makedirs(OUT, exist_ok=True)
wavfile.write(os.path.join(OUT, 'bed-v3.wav'), SR, (np.clip(st, -1, 1) * 32767).astype(np.int16))
print('OK', round(DURATION, 2), 's')
