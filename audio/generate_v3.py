"""
Muzik latar lembut untuk V3 (edit video Self-Ligating Braces).
Disintesis sendiri — bebas hak cipta.

  python3 audio/generate_v3.py

Output: public/v3/music.wav + public/v3/sfx-*.wav
Gaya: "warm corporate / lo-fi" 90 BPM, Fmaj7 – Am7 – Dm7 – C(add9).
Sengaja ringan supaya tidak bersaing dengan suara doktor.
"""
import os
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
BPM = 90
BEAT = 60 / BPM
BAR = BEAT * 4
DURATION = 1938 / 30  # sama dengan tempoh V3 (frame / fps)
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'v3')
rng = np.random.default_rng(11)
N = int(SR * (DURATION + 0.5))


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, cut, order=2):
    b, a = butter(order, cut / (SR / 2), 'low')
    return lfilter(b, a, x)


def hp(x, cut, order=2):
    b, a = butter(order, cut / (SR / 2), 'high')
    return lfilter(b, a, x)


def place(buf, sig, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]


def keys(freq, dur=1.6, vel=1.0):
    # Electric piano ringkas: sinus + harmonik lembut, reput eksponen
    n = int(SR * dur)
    t = np.arange(n) / SR
    tone = (np.sin(2 * np.pi * freq * t)
            + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / 0.4)
            + 0.12 * np.sin(2 * np.pi * freq * 3 * t) * np.exp(-t / 0.15))
    env = np.minimum(1, t / 0.006) * np.exp(-t / (dur * 0.45))
    return tone * env * vel


def pad(freqs, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for d in (-0.004, 0.0, 0.005):
            ph = rng.random()
            x += 2 * ((t * f * (1 + d) + ph) % 1) - 1
    x = lp(x / (len(freqs) * 3), 900)
    a = min(1.2, dur / 3)
    env = np.minimum(1, t / a) * np.minimum(1, (dur - t) / a)
    return x * env


def bass(freq, dur):
    n = int(SR * dur)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.2 * np.sin(2 * np.pi * freq * 2 * t)
    return x * np.minimum(1, t / 0.02) * np.exp(-t / (dur * 0.8))


def kick():
    n = int(SR * 0.35)
    t = np.arange(n) / SR
    f = 50 + 70 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)


def shaker():
    n = int(SR * 0.08)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 6000) * np.exp(-t / 0.02)


# Fmaj7 – Am7 – Dm7 – C(add9)
CHORDS = [
    (41, [65, 69, 72, 76]),
    (45, [64, 67, 69, 72]),
    (38, [65, 69, 72, 74]),
    (36, [64, 67, 72, 74]),
]
ARP = [0, 2, 1, 3, 2, 1, 3, 2]

L = np.zeros(N)
R = np.zeros(N)
drums = np.zeros(N)
bars = int(np.ceil(DURATION / BAR))
for b in range(bars):
    root, notes = CHORDS[b % 4]
    t0 = b * BAR
    p = pad([midi(n - 12) for n in notes], BAR + 0.6)
    place(L, p * 0.22, t0)
    place(R, p * 0.22, t0 + 0.012)
    place(L, bass(midi(root), BAR) * 0.28, t0)
    place(R, bass(midi(root), BAR) * 0.28, t0)
    # arpeggio 8th note, kiri-kanan bergilir
    for i, k in enumerate(ARP):
        v = 0.16 if i % 2 == 0 else 0.11
        s = keys(midi(notes[k]), 1.4, v)
        pan = 0.35 if i % 2 else -0.35
        place(L, s * (1 - pan), t0 + i * BEAT / 2)
        place(R, s * (1 + pan), t0 + i * BEAT / 2)
    # rentak ringan bermula bar ke-2, direhatkan semasa kad "sesuai untuk"
    if b >= 1:
        for beat in range(4):
            tb = t0 + beat * BEAT
            if beat in (0, 2):
                place(drums, kick() * 0.32, tb)
            place(drums, shaker() * 0.05, tb + BEAT / 2)
            place(drums, shaker() * 0.025, tb)

L += drums
R += drums

# reverb murah: beberapa gema lembut
for d, g in ((0.043, 0.25), (0.071, 0.2), (0.113, 0.14), (0.167, 0.1)):
    k = int(d * SR)
    L[k:] += lp(R[:-k], 3000) * g
    R[k:] += lp(L[:-k], 3000) * g

t = np.arange(N) / SR
fade = np.minimum(1, t / 1.5) * np.clip((DURATION - t) / 2.5, 0, 1)
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
st = np.stack([L, R], 1) / peak * 0.8
os.makedirs(OUT, exist_ok=True)
wavfile.write(os.path.join(OUT, 'music.wav'), SR, (st * 32767).astype(np.int16))


def sfx(name, x):
    x = x / np.abs(x).max() * 0.7
    wavfile.write(os.path.join(OUT, name), SR, (np.stack([x, x], 1) * 32767).astype(np.int16))


# whoosh lembut (hingar ditapis, naik turun)
n = int(SR * 0.6)
tt = np.arange(n) / SR
w = lp(rng.standard_normal(n), 2500) * np.sin(np.pi * tt / 0.6) ** 2
sfx('sfx-swoosh.wav', w)

# chime dua nota untuk end card
c = np.zeros(int(SR * 2.2))
place(c, keys(midi(84), 2.0, 1.0), 0)
place(c, keys(midi(88), 2.0, 0.8), 0.12)
place(c, keys(midi(91), 2.0, 0.6), 0.24)
sfx('sfx-chime.wav', c)

# tick kecil untuk setiap item senarai
n = int(SR * 0.12)
tt = np.arange(n) / SR
tk = np.sin(2 * np.pi * 1800 * tt) * np.exp(-tt / 0.02) + 0.5 * np.sin(2 * np.pi * 2700 * tt) * np.exp(-tt / 0.012)
sfx('sfx-tick.wav', tk)

print('OK', DURATION, 's')
