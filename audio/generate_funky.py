"""
Jana muzik latar funky + SFX "boing" untuk video V3 Funky. Disintesis sendiri — bebas hak cipta.

  python3 audio/generate_funky.py

Output: public/audio/bed-funky.wav, public/audio/sfx-boing.wav
Groove 105 BPM: bass slap bersinkop, clap 2 & 4, hi-hat 16-an, kord stab ala funk.
Lembut di bawah suara doktor, penuh di kad penutup.
"""
import os
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
BPM = 105
BEAT = 60 / BPM
BAR = BEAT * 4
DURATION = 1277 / 30
END_CARD = 1127 / 30
END_HIT = 1217 / 30
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
rng = np.random.default_rng(5)
N = int(SR * DURATION)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def filt(x, cut, kind='low', order=2):
    b, a = butter(order, np.array(cut) / (SR / 2), kind)
    return lfilter(b, a, x)


def place(buf, sig, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i] * gain


def slap(freq, dur=0.22):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * freq * t
    x = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sign(np.sin(ph)) * np.exp(-t / 0.02)
    # penapis "wah" menurun
    out = np.zeros(n)
    seg = n // 8
    for k in range(8):
        cut = 2400 * np.exp(-k / 2.5) + 300
        out[k * seg : (k + 1) * seg] = filt(x, cut)[k * seg : (k + 1) * seg]
    return out * np.exp(-t / 0.12) * 0.32


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 100 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16) * 0.6


def clap():
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    noise = filt(rng.standard_normal(n), [1000, 6000], 'band')
    e = np.exp(-t / 0.08) + 0.6 * np.exp(-np.maximum(t - 0.012, 0) / 0.01) * (t > 0.012)
    return noise * e * 0.25


def hat(open_=False):
    n = int((0.18 if open_ else 0.04) * SR)
    return filt(rng.standard_normal(n), 7500, 'high') * np.exp(-np.arange(n) / SR / (0.05 if open_ else 0.01)) * 0.08


def stab(notes, dur=0.16):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * midi(m) * t) + 0.3 * np.sin(4 * np.pi * midi(m) * t) for m in notes) / len(notes)
    return x * np.exp(-t / 0.07) * 0.16


def bell(freq, dur=2.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * freq * m * t) * g * np.exp(-t / d) for m, g, d in ((1, 1, 1.2), (2.76, 0.35, 0.4), (2, 0.3, 0.8))) * 0.16


# Em9 - A9 (vamp funk klasik)
PROG = [(40, (55, 59, 62, 66)), (45, (55, 59, 61, 64))]
BASS_PAT = [0, None, 12, None, None, 0, None, 10, 0, None, 7, None, 10, None, 12, None]  # 16-an

bass = np.zeros(N)
drums = np.zeros(N)
keys = np.zeros(N)
bar = 0
while bar * BAR < END_HIT:
    t0 = bar * BAR
    root, chord = PROG[bar % 2]
    full = t0 >= END_CARD - 0.01
    for s, off in enumerate(BASS_PAT):
        if off is not None:
            place(bass, slap(midi(root + off)), t0 + s * BEAT / 4, 1.0 if s % 4 == 0 else 0.8)
    for b in range(4):
        tb = t0 + b * BEAT
        if full or b in (0, 2):
            place(drums, kick(), tb, 1.0 if full else 0.6)
        if b in (1, 3):
            place(drums, clap(), tb)
        for s in range(4):
            place(drums, hat(open_=(s == 2 and full)), tb + s * BEAT / 4, 1.0 if s % 2 else 0.6)
    # kord stab pada "and" beat 2 & 4
    for at in (1.5, 2.75, 3.5):
        place(keys, stab(chord), t0 + at * BEAT)
    bar += 1

for m in (40, 52, 55, 59, 62, 66):
    place(keys, stab((m,), 1.6) * 2, END_HIT)
place(drums, kick() * 1.3, END_HIT)
place(keys, bell(midi(83)), END_HIT)

mix = bass + drums + keys
mix = mix / np.max(np.abs(mix)) * 0.85
fade = int(1.0 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)
k = int(0.01 * SR)
right = np.concatenate([np.zeros(k), mix[:-k]]) * 0.25 + mix * 0.75
os.makedirs(OUT, exist_ok=True)
wavfile.write(os.path.join(OUT, 'bed-funky.wav'), SR, (np.clip(np.stack([mix, right], 1), -1, 1) * 32767).astype(np.int16))

# SFX boing: sinus dengan pitch berayun menurun
n = int(0.5 * SR)
t = np.arange(n) / SR
f = 220 + 380 * np.exp(-t / 0.12) * (1 + 0.35 * np.sin(2 * np.pi * 18 * t))
boing = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18)
boing = boing / np.max(np.abs(boing)) * 0.8
wavfile.write(os.path.join(OUT, 'sfx-boing.wav'), SR, (np.stack([boing, boing], 1) * 32767).astype(np.int16))
print('OK', round(DURATION, 2), 's')
