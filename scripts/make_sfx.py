"""Jana semua sound effect + muzik latar untuk video Nafas Berbau.

Semua bunyi disintesis dari kosong (tiada aset berlesen).
Jalankan: python3 scripts/make_sfx.py  (perlu numpy)
"""
import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'sfx')
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def env(n, a=0.005, r=None, curve=4.0):
    """Attack linear, decay eksponen."""
    x = np.arange(n) / SR
    e = np.minimum(1, x / max(a, 1e-4))
    d = x[-1] if r is None else r
    return e * np.exp(-curve * x / d)


def lowpass(x, cutoff):
    """Low-pass 1-pole; cutoff boleh jadi array (sweep)."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def save(name, x, peak=0.9):
    x = np.asarray(x, dtype=np.float64)
    fade = min(len(x), int(0.01 * SR))
    ramp = np.linspace(1, 0, fade)
    x[-fade:] *= ramp[:, None] if x.ndim == 2 else ramp
    m = np.max(np.abs(x)) or 1
    x = x / m * peak
    stereo = x.ndim == 2
    data = (x * 32767).astype('<i2')
    with wave.open(os.path.join(OUT, name + '.wav'), 'wb') as w:
        w.setnchannels(2 if stereo else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print('ok', name, f'{len(x) / SR:.2f}s')


def mix(*parts):
    """Campur isyarat berlainan panjang."""
    n = max(len(p) for p in parts)
    y = np.zeros(n)
    for p in parts:
        y[: len(p)] += p
    return y


def whoosh(d=0.55, up=True):
    n = int(SR * d)
    x = t(d) / d
    shape = np.sin(np.pi * x) ** 2
    sweep = (300 + 5200 * x) if up else (5500 - 5000 * x)
    noise = rng.standard_normal(n)
    y = lowpass(noise, sweep) - lowpass(noise, sweep * 0.25)
    return y * shape


def pop(f0=900, f1=220, d=0.14):
    x = t(d)
    f = f1 + (f0 - f1) * np.exp(-x * 40)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(len(x), 0.002, d, 5)


def ding(f=1318.5, d=1.3):
    x = t(d)
    y = sum(a * np.sin(2 * np.pi * f * k * x) * np.exp(-x * (3 + k * 2)) for k, a in [(1, 1), (2.76, 0.4), (5.4, 0.2), (8.9, 0.08)])
    return y * np.minimum(1, x / 0.003)


def tick():
    return mix(pop(2400, 1200, 0.06), 0.4 * ding(2637, 0.25))


def wrong(d=0.5):
    x = t(d)
    f = np.where(x < d / 2, 190, 150)
    ph = 2 * np.pi * np.cumsum(f) / SR
    sq = np.sign(np.sin(ph)) * 0.6 + np.sin(ph * 2) * 0.3
    return lowpass(sq, 1800) * env(len(x), 0.005, d, 1.5)


def stink(d=0.9):
    """Bunyi 'bwomp' goyang untuk bau busuk."""
    x = t(d)
    f = 110 + 25 * np.sin(2 * np.pi * 7 * x) - 40 * x
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.3 * np.sign(np.sin(3 * ph))
    return lowpass(y, 900) * env(len(x), 0.03, d, 2.2)


def drip():
    x = t(0.22)
    f = 500 + 1400 * (x / 0.22) ** 0.6
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(len(x), 0.002, 0.22, 6)


def bubbles(d=0.8, k=7):
    y = np.zeros(int(SR * d))
    for i in range(k):
        p = pop(rng.uniform(600, 1400), rng.uniform(250, 500), 0.08) * rng.uniform(0.4, 1)
        s = int(rng.uniform(0, d - 0.09) * SR)
        y[s : s + len(p)] += p
    return y


def sparkle(d=1.2):
    y = np.zeros(int(SR * d))
    notes = [2093, 2637, 3136, 3951, 4186, 3520, 2794]
    for i, f in enumerate(notes):
        s = int(i * 0.07 * SR)
        b = ding(f, 0.6) * (1 - i * 0.08)
        y[s : s + len(b)] += b[: len(y) - s]
    return y


def alert():
    x = t(0.18)
    a = np.sin(2 * np.pi * 880 * x) * env(len(x), 0.004, 0.18, 3)
    b = np.sin(2 * np.pi * 660 * x) * env(len(x), 0.004, 0.18, 3)
    return np.concatenate([a, b, np.zeros(int(0.05 * SR))])


def swish():
    w = whoosh(0.3, True) * 0.8
    p = pop(1400, 700, 0.05) * 0.3
    s = int(0.22 * SR)
    w[s : s + len(p)] += p[: len(w) - s]
    return w


def sizzle(d=1.0):
    """Bunyi 'kering' — desis serak."""
    n = int(SR * d)
    y = rng.standard_normal(n)
    y = y - lowpass(y, 3000)
    crackle = (rng.random(n) > 0.997) * rng.standard_normal(n) * 4
    x = t(d) / d
    return (y * 0.5 + crackle) * np.sin(np.pi * x)


def boing():
    x = t(0.45)
    f = 180 + 240 * np.exp(-x * 6) * (1 + 0.3 * np.sin(2 * np.pi * 14 * x))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(len(x), 0.004, 0.45, 3)


def bed(total=49.0, bpm=96):
    """Muzik latar lembut: pad + pluck arpeggio, progression I-vi-IV-V (C major)."""
    n = int(SR * total)
    y = np.zeros((n, 2))
    beat = 60 / bpm
    bar = beat * 4
    chords = [
        [261.63, 329.63, 392.0],
        [220.0, 261.63, 329.63],
        [174.61, 220.0, 261.63],
        [196.0, 246.94, 293.66],
    ]
    bars = int(total / bar) + 1
    for b in range(bars):
        ch = chords[b % 4]
        s = int(b * bar * SR)
        seg = t(bar + 0.6)
        pad = sum(np.sin(2 * np.pi * f * seg + 0.3 * np.sin(2 * np.pi * 0.4 * seg)) for f in ch)
        pad += sum(0.3 * np.sin(2 * np.pi * f * 2.003 * seg) for f in ch)
        pe = np.minimum(1, seg / 0.4) * np.minimum(1, (bar + 0.6 - seg) / 0.6)
        pad = pad * pe * 0.12
        e = min(n, s + len(pad))
        y[s:e, 0] += pad[: e - s]
        y[s:e, 1] += pad[: e - s]
        # pluck 8th notes
        pattern = [0, 1, 2, 1, 2, 1, 0, 2]
        for i, k in enumerate(pattern):
            ps = s + int(i * beat / 2 * SR)
            f = ch[k] * 2
            pl = t(0.5)
            p = (np.sin(2 * np.pi * f * pl) + 0.3 * np.sin(4 * np.pi * f * pl)) * np.exp(-pl * 9) * np.minimum(1, pl / 0.003)
            p *= 0.16
            pan = 0.35 if i % 2 else 0.65
            pe2 = min(n, ps + len(p))
            if ps >= n:
                continue
            y[ps:pe2, 0] += p[: pe2 - ps] * (1 - pan)
            y[ps:pe2, 1] += p[: pe2 - ps] * pan
        # bass
        bs = t(bar)
        bass = np.sin(2 * np.pi * ch[0] / 2 * bs) * np.exp(-bs * 1.2) * 0.25
        e = min(n, s + len(bass))
        y[s:e] += bass[: e - s, None]
        # soft kick on beats 1 & 3, shaker on 8ths
        for bt in range(4):
            ks = s + int(bt * beat * SR)
            if ks >= n:
                continue
            if bt % 2 == 0:
                kt = t(0.25)
                kk = np.sin(2 * np.pi * np.cumsum(50 + 90 * np.exp(-kt * 30)) / SR) * np.exp(-kt * 14) * 0.35
                ke = min(n, ks + len(kk))
                y[ks:ke] += kk[: ke - ks, None]
            for h in range(2):
                hs = ks + int(h * beat / 2 * SR)
                ht = t(0.06)
                hh = rng.standard_normal(len(ht)) * np.exp(-ht * 70) * (0.05 if h else 0.03)
                he = min(n, hs + len(hh))
                if hs < n:
                    y[hs:he, 0] += hh[: he - hs] * 0.7
                    y[hs:he, 1] += hh[: he - hs]
    # fade in/out
    fi = int(1.0 * SR)
    fo = int(2.5 * SR)
    y[:fi] *= np.linspace(0, 1, fi)[:, None]
    y[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return y


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    save('whoosh', whoosh())
    save('whoosh-down', whoosh(0.5, False))
    save('swish', swish())
    save('pop', pop())
    save('ding', ding())
    save('tick', tick())
    save('wrong', wrong())
    save('stink', stink())
    save('drip', drip())
    save('bubbles', bubbles())
    save('sparkle', sparkle())
    save('alert', alert())
    save('sizzle', sizzle())
    save('boing', boing())
    save('bed', bed(), peak=0.8)
