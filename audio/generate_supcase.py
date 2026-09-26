"""
Jana muzik latar untuk iklan pendek SUPCASE (Shopee).
Disintesis sendiri — bebas hak cipta. SFX dikongsi dengan video Izznara (audio/generate.py).

  python3 audio/generate_supcase.py          # versi penuh 23s  -> supcase-music.wav
  python3 audio/generate_supcase.py short    # versi 15s        -> supcase-music-15s.wav

120 BPM -> 1 beat = 15 frame @30fps, 1 bar = 60 frame.
Penuh: drop 3.0s (frame 90), hentakan penutup 21.0s (frame 630).
15s:   drop 2.0s (frame 60), hentakan penutup 14.0s (frame 420).
"""
import os
import sys
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
BEAT = 0.5
BAR = BEAT * 4
SHORT = len(sys.argv) > 1 and sys.argv[1] == 'short'
DROP, END_HIT, FRAMES, NAME = (2.0, 14.0, 450, 'supcase-music-15s.wav') if SHORT else (3.0, 21.0, 690, 'supcase-music.wav')
DURATION = FRAMES / 30
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
rng = np.random.default_rng(11)
N = int(SR * DURATION)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def filt(x, cut, kind):
    b, a = butter(2, np.array(cut) / (SR / 2), kind)
    return lfilter(b, a, x)


def place(buf, sig, at):
    i = int(at * SR)
    if 0 <= i < len(buf):
        j = min(len(buf), i + len(sig))
        buf[i:j] += sig[: j - i]


def tt(dur):
    return np.arange(int(dur * SR)) / SR


def saw(freq, n, detune=0.0):
    ph = np.cumsum(np.full(n, freq * (1 + detune)) / SR) + rng.random()
    return 2 * (ph % 1) - 1


def kick():
    t = tt(0.4)
    f = 48 + 120 * np.exp(-t / 0.028)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.2)
            + filt(rng.standard_normal(len(t)), 4000, 'low') * np.exp(-t / 0.004) * 0.3)


def clap():
    t = tt(0.28)
    e = sum(np.concatenate([np.zeros(int(o * SR)), np.exp(-t[: len(t) - int(o * SR)] / d)])
            for o, d in ((0, 0.01), (0.01, 0.01), (0.021, 0.11)))
    return filt(rng.standard_normal(len(t)), [900, 5500], 'band') * e * 0.5


def hat(open_=False):
    t = tt(0.22 if open_ else 0.05)
    return filt(rng.standard_normal(len(t)), 7500, 'high') * np.exp(-t / (0.06 if open_ else 0.012)) * (0.18 if open_ else 0.12)


def pad(freq, dur):
    n = len(tt(dur))
    x = filt(sum(saw(freq, n, d) for d in (-0.006, 0, 0.007)) / 3, 1900, 'low')
    ramp = np.minimum(1, np.minimum(np.arange(n) / (0.06 * SR), (n - np.arange(n)) / (0.1 * SR)))
    return x * ramp * 0.11


def pluck(freq, dur=0.2):
    t = tt(dur)
    x = saw(freq, len(t)) * 0.6 + np.sign(np.sin(2 * np.pi * freq * t)) * 0.4
    return filt(x, 3600, 'low') * np.exp(-t / 0.06) * 0.13


def bass(freq, dur):
    t = tt(dur)
    x = filt(saw(freq, len(t)) * 0.7 + np.sin(2 * np.pi * freq * t) * 0.6, 560, 'low')
    return x * np.minimum(1, np.arange(len(t)) / (0.005 * SR)) * np.exp(-t / 0.3) * 0.36


def bell(freq, dur=1.6):
    t = tt(dur)
    return sum(np.sin(2 * np.pi * freq * m * t) * g * np.exp(-t / d)
               for m, g, d in ((1, 1, 0.9), (2.76, 0.4, 0.35), (5.4, 0.2, 0.15), (2, 0.3, 0.6))) * 0.22


# Progresi ceria: C - G - Am - F
CHORDS = [(48, (60, 64, 67)), (43, (59, 62, 67)), (45, (57, 60, 64)), (41, (57, 60, 65))]

drums, low, pads, arp, fx = (np.zeros(N) for _ in range(5))
kicks = []
K, CL, HC, HO = kick(), clap(), hat(), hat(True)
CRASH = filt(rng.standard_normal(int(2 * SR)), 3500, 'high') * np.exp(-tt(2) / 0.55) * 0.22

# Intro 0-3s: pad lembut, hi-hat & snare roll membina, riser
for f in CHORDS[3][1]:
    place(pads, filt(pad(midi(f), DROP), 900, 'low'), 0)
for s in range(12):
    place(drums, HC * (0.3 + s / 16), DROP - 2.0 + s / 6)
for s in range(8):
    place(drums, CL * (0.25 + s / 11), DROP - 1.0 + s * BEAT / 4)
rt = tt(DROP)
place(fx, filt(rng.standard_normal(len(rt)), 1500, 'high') * (rt / rt[-1]) ** 2 * 0.17, 0)

t0, k = DROP, 0
while t0 < END_HIT - 1e-6:
    root, tones = CHORDS[k % 4]
    for b in range(4):
        tb = t0 + b * BEAT
        place(drums, K, tb)
        kicks.append(tb)
        if b in (1, 3):
            place(drums, CL, tb)
        place(drums, HO, tb + BEAT / 2)
        place(drums, HC, tb + BEAT / 4)
        place(drums, HC * 0.7, tb + 3 * BEAT / 4)
        place(low, bass(midi(root), BEAT / 2 * 0.9), tb + BEAT / 2)
        if b == 0:
            place(low, bass(midi(root - 12), BEAT / 2 * 0.8) * 0.8, tb)
    for f in tones:
        place(pads, pad(midi(f), BAR), t0)
    seq = [tones[0], tones[1], tones[2], tones[0] + 12, tones[2], tones[1], tones[0] + 12, tones[2]]
    for s in range(16):
        place(arp, pluck(midi(seq[s % 8] + 12)), t0 + s * BEAT / 4)
    if k in (0, 4):
        place(drums, CRASH, t0)
    t0 += BAR
    k += 1

# Hentakan penutup
root, tones = CHORDS[0]
place(drums, K * 1.1, END_HIT)
place(drums, CRASH * 1.3, END_HIT)
kicks.append(END_HIT)
for f in tones + (tones[0] + 12,):
    place(pads, pad(midi(f), 2.0) * 1.6, END_HIT)
place(low, bass(midi(root), 1.8) * 1.2, END_HIT)
place(arp, bell(midi(tones[2] + 12)) * 0.8, END_HIT)

# Sidechain mengikut kick
duck = np.ones(N)
for tk in kicks:
    i = int(tk * SR)
    m = min(N - i, int(0.3 * SR))
    duck[i:i + m] = np.minimum(duck[i:i + m], 1 - 0.65 * np.exp(-np.arange(m) / SR / 0.09))

d = int(BEAT * 0.75 * SR)
arp[d:] += arp[:-d] * 0.35

mix = drums + (low + pads * 1.1 + arp * 0.9) * duck + fx
fade = int(1.0 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.15) * 0.89

k = int(0.012 * SR)
right = mix * 0.75 + np.concatenate([np.zeros(k), mix[:-k]]) * 0.25
os.makedirs(OUT, exist_ok=True)
wavfile.write(os.path.join(OUT, NAME), SR,
              (np.clip(np.stack([mix, right], axis=1), -1, 1) * 32767).astype(np.int16))
print('OK', round(DURATION, 2), 's')
