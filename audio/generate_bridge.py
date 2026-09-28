"""
Jana "sting" penutup untuk kad akhir video Dental Bridge (V3).
Pad hangat + loceng + hentakan rendah, disintesis sendiri — bebas hak cipta.

  python3 audio/generate_bridge.py

Output: public/audio/bridge-sting.wav (4 saat)
"""
import os
import numpy as np
from scipy.signal import butter, lfilter
from scipy.io import wavfile

SR = 44100
DUR = 4.0
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'bridge-sting.wav')

t = np.arange(int(SR * DUR)) / SR


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lp(x, cut):
    b, a = butter(2, cut / (SR / 2), 'low')
    return lfilter(b, a, x)


# Pad: A major add9, gelombang gergaji lembut yang ditapis, sedikit detune
pad = np.zeros_like(t)
for n in (45, 57, 61, 64, 71, 76):
    for det in (-0.12, 0.12):
        f = midi(n + det)
        pad += 2 * ((t * f) % 1) - 1
pad = lp(pad, 1800) / 12
pad *= np.minimum(t / 0.35, 1) * np.exp(-t / 1.9)

# Loceng: sinus + harmonik tak harmonik, decay cepat
bell = np.zeros_like(t)
for n, d in ((81, 0.0), (88, 0.12), (93, 0.24)):
    tt = np.clip(t - d, 0, None)
    env = (t >= d) * np.exp(-tt / 0.9)
    f = midi(n)
    bell += env * (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * f * 2.76 * tt))
bell *= 0.22

# Hentakan rendah: sinus menurun dengan klik lembut
boom_f = 38 + 70 * np.exp(-t / 0.05)
boom = np.sin(2 * np.pi * np.cumsum(boom_f) / SR) * np.exp(-t / 0.45) * 0.8

mix = pad + bell + boom
mix *= np.minimum((DUR - t) / 0.6, 1)  # fade keluar
mix = np.tanh(mix * 1.2)
mix = mix / np.abs(mix).max() * 0.85

# Stereo lebar: pad sedikit berbeza kiri/kanan
right = np.roll(mix, 220) * 0.5 + mix * 0.5
stereo = np.stack([mix, right], axis=1)
wavfile.write(OUT, SR, (stereo * 32767).astype(np.int16))
print('OK', OUT)
