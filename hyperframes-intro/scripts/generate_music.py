"""
Muzik latar video perkenalan Izznara (20s). Disintesis sendiri — bebas hak cipta.

  python3 scripts/generate_music.py        (perlu numpy + scipy + ffmpeg)

Lembut tapi ceria: pad, piano elektrik (arpeggio C-G-Am-F), bass, kick & shaker perlahan, 120 BPM
(1 bar = 2s, jadi sempadan babak 3s / 7s / 14s jatuh tepat pada beat).
  - chime pada 0.45s (tajuk muncul), 3s, 7s, 14s, dan 17.5s (logo penutup)
Output: assets/music.mp3
"""
import os
import subprocess
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
DUR = 20.0
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
HERE = os.path.dirname(__file__)
OUT_WAV = os.path.join(HERE, '..', 'assets', 'music.wav')
OUT_MP3 = os.path.join(HERE, '..', 'assets', 'music.mp3')
rng = np.random.default_rng(11)
N = int(SR * DUR)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, c, o=2):
    b, a = butter(o, c / (SR / 2), 'low')
    return lfilter(b, a, x)


def hp(x, c, o=2):
    b, a = butter(o, c / (SR / 2), 'high')
    return lfilter(b, a, x)


def place(buf, sig, at, pan=0.0):
    i = int(at * SR)
    if i < 0 or i >= buf.shape[1]:
        return
    j = min(buf.shape[1], i + len(sig))
    s = sig[: j - i]
    buf[0, i:j] += s * (1 - max(0, pan))
    buf[1, i:j] += s * (1 + min(0, pan))


def epiano(freq, dur=1.0, amp=0.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    mod = np.sin(2 * np.pi * freq * 2 * t) * 1.3 * np.exp(-t / 0.16)
    x = np.sin(2 * np.pi * freq * t + mod) * np.exp(-t / 0.45)
    x += 0.2 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / 0.18)
    x[: int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))
    return x * amp


def bell(freq, dur=2.0, amp=0.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * freq * m * t) * g * np.exp(-t / d)
            for m, g, d in ((1, 1, 1.3), (2.76, 0.35, 0.5), (5.4, 0.15, 0.2), (2, 0.3, 0.9)))
    return x * amp


def pad(freqs, dur, amp=0.07):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for d in (-0.004, 0.0, 0.005):
            x += np.sin(2 * np.pi * f * (1 + d) * t + rng.random() * 6.28)
            x += 0.3 * np.sin(2 * np.pi * f * 2 * (1 + d) * t)
    x = lp(x / (len(freqs) * 3), 2400)
    a = np.minimum(1, np.arange(n) / (0.5 * SR))
    r = np.minimum(1, (n - np.arange(n)) / (0.5 * SR))
    return x * a * r * amp * 3


def bass(freq, dur, amp=0.22):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.2 * np.sin(2 * np.pi * freq * 2 * t)
    env = np.minimum(1, t / 0.02) * np.exp(-t / (dur * 0.8))
    return x * env * amp


def kick(amp=0.28):
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    f = 52 + 90 * np.exp(-t / 0.03)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.11) * amp


def shaker(amp=0.05):
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    x = hp(rng.standard_normal(n), 6500)
    return x * np.exp(-t / 0.025) * amp


def clap(amp=0.07):
    n = int(0.2 * SR)
    t = np.arange(n) / SR
    x = lp(hp(rng.standard_normal(n), 1200), 5000)
    return x * (np.exp(-t / 0.05) + 0.4 * np.exp(-((t - 0.012) ** 2) / 0.00004)) * amp


def reverb(buf, wet=0.25):
    out = buf.copy()
    for ch in (0, 1):
        for d, g in ((0.043, 0.5), (0.071, 0.4), (0.109, 0.3), (0.163, 0.22), (0.241, 0.15)):
            d += 0.004 * ch
            i = int(d * SR)
            out[ch, i:] += lp(buf[ch], 3500)[: buf.shape[1] - i] * g * wet
    return out


CHORDS = [
    (36, [60, 64, 67, 71]),   # C
    (43, [55, 59, 62, 67]),   # G
    (45, [57, 60, 64, 67]),   # Am
    (41, [57, 60, 65, 69]),   # F
]
ARP = [0, 1, 2, 3, 2, 1, 2, 3]

buf = np.zeros((2, N))
for b in range(int(DUR / BAR)):
    root, notes = CHORDS[b % 4]
    t0 = b * BAR
    place(buf, pad([midi(n) for n in notes[:3]], BAR + 0.5), t0)
    place(buf, bass(midi(root), BEAT * 1.5), t0)
    place(buf, bass(midi(root), BEAT * 0.9, 0.16), t0 + BEAT * 2.5)
    # lebih ringan pada bar pertama (hook), penuh selepas babak 2 bermula
    full = t0 >= 3.0
    for k, idx in enumerate(ARP):
        if b == 0 and k < 2:
            continue
        place(buf, epiano(midi(notes[idx] + 12), 0.9, 0.12 + (0.03 if k % 4 == 0 else 0)),
              t0 + k * BEAT / 2 + (0.01 if k % 2 else 0), pan=-0.25 + 0.5 * (k % 2))
    if full:
        place(buf, kick(), t0)
        place(buf, kick(0.2), t0 + BEAT * 2)
        place(buf, clap(), t0 + BEAT)
        place(buf, clap(), t0 + BEAT * 3)
        for k in range(8):
            place(buf, shaker(0.05 if k % 2 == 0 else 0.03), t0 + k * BEAT / 2 + BEAT / 4 * (k % 2 == 1) * 0, pan=0.2)

# Chime selari dengan visual
for at, n in ((0.45, 79), (3.0, 84), (7.0, 79), (14.0, 84), (17.5, 88)):
    place(buf, bell(midi(n), 2.0, 0.12), at)
    place(buf, bell(midi(n + 12), 1.4, 0.05), at + 0.04)
for i, n in enumerate((72, 76, 79, 84)):                  # sapuan chime di logo penutup
    place(buf, bell(midi(n), 2.2, 0.1), 17.5 + 0.1 + i * 0.07, pan=-0.2 + 0.13 * i)

buf = reverb(buf)

t = np.arange(N) / SR
env = np.minimum(1, t / 0.4) * np.minimum(1, (DUR - t) / 1.6)
buf *= env
buf *= 0.85 / np.max(np.abs(buf))

os.makedirs(os.path.dirname(OUT_WAV), exist_ok=True)
wavfile.write(OUT_WAV, SR, (buf.T * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', OUT_WAV, '-b:a', '192k', OUT_MP3], check=True)
os.remove(OUT_WAV)
print('OK', os.path.abspath(OUT_MP3), f'{DUR:.1f}s')
