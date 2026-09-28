"""Muzik latar V3 — lo-fi lembut 84 BPM (Am7–Fmaj7–Cmaj7–G), numpy sahaja.

Keluaran: public/audio/music-v3.wav (stereo 44.1 kHz). Dimainkan perlahan di bawah suara,
kemudian naik pada end card.
"""
import os
import wave

import numpy as np

SR = 44100
BPM = 84
BEAT = 60 / BPM
DUR = 105.0  # >= tempoh komposisi V3
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'music-v3.wav')

rng = np.random.default_rng(7)
n = int(SR * DUR)
L = np.zeros(n)
R = np.zeros(n)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(buf, start, sig):
    i = int(start * SR)
    if i >= n:
        return
    j = min(n, i + len(sig))
    buf[i:j] += sig[: j - i]


def epiano(freq, dur, vel=1.0):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 2.2) * (1 - np.exp(-t * 200))
    sig = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 5)
    sig += 0.12 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t * 8)
    trem = 1 + 0.08 * np.sin(2 * np.pi * 4.5 * t)
    return sig * env * trem * vel


def pad(freq, dur):
    t = np.arange(int(SR * dur)) / SR
    env = np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 0.8)
    sig = sum(np.sin(2 * np.pi * freq * (1 + d) * t) for d in (-0.003, 0, 0.004)) / 3
    return sig * env


def bass(freq, dur):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 1.5) * (1 - np.exp(-t * 300))
    return np.sin(2 * np.pi * freq * t) * env


def kick():
    t = np.arange(int(SR * 0.35)) / SR
    f = 50 + 70 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def hat():
    t = np.arange(int(SR * 0.06)) / SR
    x = rng.standard_normal(len(t))
    x = np.diff(x, prepend=0)  # high-pass kasar
    return x * np.exp(-t * 70) * 0.25


CHORDS = [
    [57, 60, 64, 67],  # Am7
    [53, 57, 60, 64],  # Fmaj7
    [48, 55, 59, 64],  # Cmaj7
    [55, 59, 62, 67],  # G
]
ROOTS = [45, 41, 36, 43]
BAR = BEAT * 4

bars = int(DUR / BAR) + 1
for b in range(bars):
    c = b % 4
    t0 = b * BAR
    for k, m in enumerate(CHORDS[c]):
        p = pad(midi(m + 12), BAR)
        add(L, t0, p * 0.05 * (1 if k % 2 else 0.7))
        add(R, t0, p * 0.05 * (0.7 if k % 2 else 1))
    # e-piano: kord pada beat 1, arpeggio lembut di beat 2-4
    for k, m in enumerate(CHORDS[c]):
        add(L, t0 + k * 0.012, epiano(midi(m), 2.5, 0.10))
        add(R, t0 + k * 0.015, epiano(midi(m), 2.5, 0.10))
    arp = [CHORDS[c][i] + 12 for i in (1, 2, 3, 2, 1, 2)]
    for i, m in enumerate(arp):
        tt = t0 + BEAT * (1 + i * 0.5)
        pan = 0.5 + 0.35 * np.sin(i)
        e = epiano(midi(m), 1.2, 0.06)
        add(L, tt, e * (1 - pan) * 2)
        add(R, tt, e * pan * 2)
    add(L, t0, bass(midi(ROOTS[c]), BAR * 0.9) * 0.22)
    add(R, t0, bass(midi(ROOTS[c]), BAR * 0.9) * 0.22)
    add(L, t0 + BEAT * 2.5, bass(midi(ROOTS[c] + 7), BEAT) * 0.12)
    add(R, t0 + BEAT * 2.5, bass(midi(ROOTS[c] + 7), BEAT) * 0.12)
    if b >= 1:
        for beat in (0, 2.5):
            add(L, t0 + beat * BEAT, kick() * 0.28)
            add(R, t0 + beat * BEAT, kick() * 0.28)
        for i in range(8):
            h = hat() * (1.0 if i % 2 else 0.5)
            add(L if i % 4 < 2 else R, t0 + i * BEAT / 2 + 0.01, h)

# fade masuk/keluar & normalisasi
fade = np.ones(n)
fi, fo = int(SR * 2), int(SR * 3)
fade[:fi] = np.linspace(0, 1, fi)
fade[-fo:] = np.linspace(1, 0, fo)
st = np.stack([L * fade, R * fade], axis=1)
st = np.tanh(st * 1.2)
st /= np.abs(st).max() / 0.85

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('ok ->', os.path.normpath(OUT))
