"""
Muzik latar video Review Google. Disintesis sendiri — bebas hak cipta.

  python3 audio/generate_reviews.py        (perlu numpy + scipy)

Lembut & hangat: pad, piano elektrik (arpeggio C-G-Am-F, 84 BPM), bass perlahan.
Dipadankan dengan video (30fps, 765 frame = 25.5s):
  - 5 chime naik ketika 5 bintang muncul di intro
  - chime lembut setiap kali kad review baharu masuk
  - chime + swell ketika butang CTA muncul di outro
Output: public/music/latar-review.wav
"""
import os
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
FPS = 30
DUR = 765 / FPS
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, '..', 'public', 'music', 'latar-review.wav')
rng = np.random.default_rng(7)
N = int(SR * DUR)

BPM = 84
BEAT = 60 / BPM
BAR = BEAT * 4


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, c, o=2):
    b, a = butter(o, c / (SR / 2), 'low')
    return lfilter(b, a, x)


def place(buf, sig, at, pan=0.0):
    i = int(at * SR)
    if i < 0 or i >= buf.shape[1]:
        return
    j = min(buf.shape[1], i + len(sig))
    s = sig[: j - i]
    buf[0, i:j] += s * (1 - max(0, pan))
    buf[1, i:j] += s * (1 + min(0, pan))


def epiano(freq, dur=1.2, amp=0.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    mod = np.sin(2 * np.pi * freq * 2 * t) * 1.4 * np.exp(-t / 0.18)  # FM lembut
    x = np.sin(2 * np.pi * freq * t + mod) * np.exp(-t / 0.55)
    x += 0.25 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t / 0.2)
    x[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))
    return x * amp


def bell(freq, dur=2.2, amp=0.22):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * freq * m * t) * g * np.exp(-t / d)
            for m, g, d in ((1, 1, 1.4), (2.76, 0.35, 0.5), (5.4, 0.15, 0.2), (2, 0.3, 0.9)))
    return x * amp


def pad(freqs, dur, amp=0.07):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for d in (-0.004, 0.0, 0.005):
            x += np.sin(2 * np.pi * f * (1 + d) * t + rng.random() * 6.28)
            x += 0.3 * np.sin(2 * np.pi * f * 2 * (1 + d) * t)
    x = lp(x / (len(freqs) * 3), 2200)
    a = np.minimum(1, np.arange(n) / (0.9 * SR))
    r = np.minimum(1, (n - np.arange(n)) / (0.9 * SR))
    return x * a * r * amp * 3


def bass(freq, dur, amp=0.22):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.2 * np.sin(2 * np.pi * freq * 2 * t)
    env = np.minimum(1, t / 0.03) * np.exp(-t / (dur * 0.9))
    return x * env * amp


def reverb(buf, wet=0.28):
    """Gema ringkas (beberapa delay + low-pass) untuk rasa ruang."""
    out = buf.copy()
    for ch in (0, 1):
        for k, (d, g) in enumerate(((0.043, 0.5), (0.071, 0.4), (0.109, 0.3), (0.163, 0.22), (0.241, 0.15))):
            d += 0.004 * ch
            i = int(d * SR)
            out[ch, i:] += lp(buf[ch], 3500)[: buf.shape[1] - i] * g * wet
    return out


# Kord: C – G – Am – F  (nota MIDI)
CHORDS = [
    ('C', 36, [60, 64, 67, 71]),
    ('G', 43, [55, 59, 62, 67]),
    ('Am', 45, [57, 60, 64, 67]),
    ('F', 41, [57, 60, 65, 69]),
]
ARP = [0, 1, 2, 3, 2, 1, 2, 3]   # corak arpeggio ikut lapis kord (8th note)

buf = np.zeros((2, N))
nbar = int(np.ceil(DUR / BAR)) + 1
for b in range(nbar):
    name, root, notes = CHORDS[b % 4]
    t0 = b * BAR
    place(buf, pad([midi(n) for n in notes[:3]], BAR + 0.8), t0)
    place(buf, bass(midi(root), BAR * 0.5), t0)
    place(buf, bass(midi(root), BAR * 0.5, 0.15), t0 + BAR * 0.5)
    for k, idx in enumerate(ARP):
        # mula sedikit lembut (intro), makin penuh selepas bar pertama
        if b == 0 and k < 2:
            continue
        place(buf, epiano(midi(notes[idx] + 12), 1.0, 0.13 + (0.03 if k % 4 == 0 else 0)),
              t0 + k * BEAT / 2 + (0.012 if k % 2 else 0), pan=-0.25 + 0.5 * (k % 2))

# Chime selari dengan visual
star_f = [16 + 5 * i for i in range(5)]
for i, f in enumerate(star_f):
    place(buf, bell(midi([72, 76, 79, 84, 88][i]), 1.8, 0.13), f / FPS, pan=-0.3 + 0.15 * i)
for f in (60, 60 + 205, 60 + 410):   # kad review masuk
    place(buf, bell(midi(79), 1.8, 0.1), f / FPS + 0.05)
    place(buf, bell(midi(91), 1.4, 0.05), f / FPS + 0.05)
OUTRO = (60 + 615) / FPS
place(buf, pad([midi(n) for n in (60, 64, 67, 72)], 3.4, 0.1), OUTRO)
for i, n in enumerate((72, 76, 79, 84)):                 # chime butang CTA
    place(buf, bell(midi(n), 2.0, 0.12), OUTRO + 1.0 + i * 0.07, pan=-0.2 + 0.13 * i)

buf = reverb(buf)

# Fade-in / fade-out
t = np.arange(N) / SR
env = np.minimum(1, t / 0.8) * np.minimum(1, (DUR - t) / 1.5)
buf *= env
buf *= 0.85 / np.max(np.abs(buf))

os.makedirs(os.path.dirname(OUT), exist_ok=True)
wavfile.write(OUT, SR, (buf.T * 32767).astype(np.int16))
print('OK', os.path.abspath(OUT), f'{DUR:.1f}s')
