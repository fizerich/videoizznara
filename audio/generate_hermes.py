"""
Suara (TTS Bahasa Melayu), garis masa dan muzik latar untuk video penerang Hermes Agent.

  pip install edge-tts numpy scipy
  python3 audio/generate_hermes.py

Langkah:
  1. Baca audio/hermes_script.json (ayat-ayat naratif setiap babak).
  2. Jana satu fail suara bagi setiap ayat (Microsoft Edge TTS, suara ms-MY) -> audio/.cache/hermes/
  3. Sambung semua ayat dengan jeda -> public/hermes/vo.mp3
  4. Tulis src/hermes/timeline.json (frame mula setiap babak & ayat) — Remotion membaca fail ini
  5. Sintesis muzik ambient (bebas hak cipta) -> public/hermes/music.mp3
"""
import asyncio
import hashlib
import json
import os
import subprocess

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
CACHE = os.path.join(HERE, '.cache', 'hermes')
PUB = os.path.join(ROOT, 'public', 'hermes')
SR = 44100
FPS = 30
LEAD, GAP, TAIL = 0.4, 0.3, 0.55   # saat: sebelum ayat pertama, antara ayat, selepas ayat terakhir
os.makedirs(CACHE, exist_ok=True)
os.makedirs(PUB, exist_ok=True)

script = json.load(open(os.path.join(HERE, 'hermes_script.json'), encoding='utf-8'))


def trust_proxy_ca():
    """Dalam persekitaran dengan proksi TLS, edge-tts perlu mempercayai CA proksi."""
    bundle = os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt'
    if os.path.exists(bundle):
        import certifi
        certifi.where = lambda: bundle


async def synth(text, path):
    import edge_tts
    for attempt in range(4):
        try:
            await edge_tts.Communicate(text, script['voice'], rate=script['rate']).save(path)
            if os.path.getsize(path) > 1000:
                return
        except Exception as e:  # rangkaian sementara
            print('  retry', attempt, e)
        await asyncio.sleep(2 ** attempt)
    raise RuntimeError(f'TTS gagal: {text}')


def decode(path):
    raw = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'],
        check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768


def trim(x, thr=0.008):
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return x
    return x[max(0, idx[0] - int(0.03 * SR)): idx[-1] + int(0.08 * SR)]


async def build():
    trust_proxy_ca()
    clips = {}
    for si, sc in enumerate(script['scenes']):
        for li, ln in enumerate(sc['lines']):
            h = hashlib.md5((script['voice'] + script['rate'] + ln['say']).encode()).hexdigest()[:12]
            p = os.path.join(CACHE, f'{h}.mp3')
            if not os.path.exists(p):
                print('TTS', sc['id'], li)
                await synth(ln['say'], p)
            clips[(si, li)] = trim(decode(p))

    track, scenes, cursor = [], [], 0.0
    for si, sc in enumerate(script['scenes']):
        scene_start = cursor
        t = LEAD
        lines = []
        for li, ln in enumerate(sc['lines']):
            c = clips[(si, li)]
            dur = len(c) / SR
            lines.append({'start': round(t * FPS), 'dur': round(dur * FPS), 'cap': ln['cap']})
            track.append((scene_start + t, c))
            t += dur + GAP
        scene_dur = t - GAP + TAIL
        scenes.append({
            'id': sc['id'],
            'start': round(scene_start * FPS),
            'dur': round(scene_dur * FPS),
            'lines': lines,
        })
        cursor += scene_dur

    # pastikan sempadan babak berturutan tanpa jurang akibat pembundaran
    for i in range(1, len(scenes)):
        scenes[i]['start'] = scenes[i - 1]['start'] + scenes[i - 1]['dur']
    total = scenes[-1]['start'] + scenes[-1]['dur']

    n = int(total / FPS * SR) + SR
    vo = np.zeros(n, dtype=np.float32)
    for at, c in track:
        i = int(at * SR)
        vo[i:i + len(c)] += c
    return vo, scenes, total


def write_mp3(x, path, stereo=False, q=4):
    x = np.clip(x, -1, 1)
    pcm = (x * 32767).astype(np.int16)
    tmp = path + '.wav'
    wavfile.write(tmp, SR, pcm)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-codec:a', 'libmp3lame', '-qscale:a', str(q), path], check=True)
    os.remove(tmp)


# ---------------------------------------------------------------- muzik ambient
rng = np.random.default_rng(7)
midi = lambda n: 440.0 * 2 ** ((n - 69) / 12)


def lp(x, c, o=2):
    b, a = butter(o, c / (SR / 2), 'low')
    return lfilter(b, a, x)


def saw(freq, n, det=0.0):
    ph = np.cumsum(np.full(n, freq * (1 + det)) / SR) + rng.random()
    return 2 * (ph % 1) - 1


def music(dur):
    n = int(dur * SR)
    out = np.zeros(n, dtype=np.float32)
    bpm = 76
    beat = 60 / bpm
    bar = beat * 4
    # Am - F - C - G  (akor: nota midi)
    chords = [(57, 60, 64), (53, 57, 60), (48, 55, 64), (55, 59, 62)]
    arps = [[69, 72, 76, 72], [65, 69, 72, 69], [64, 67, 72, 67], [62, 67, 71, 67]]
    t, bi = 0.0, 0
    while t < dur:
        ch = chords[bi % 4]
        L = int(bar * SR)
        seg = np.zeros(L, dtype=np.float32)
        for note in ch:
            seg += sum(saw(midi(note), L, d) for d in (-0.005, 0.0, 0.006)) / 3 * 0.05
        seg = lp(seg, 900)
        env = np.minimum(1, np.arange(L) / (0.6 * SR)) * np.minimum(1, (L - np.arange(L)) / (0.6 * SR))
        seg *= env
        i = int(t * SR)
        out[i:i + L] += seg[: max(0, min(L, n - i))] if i + L > n else seg
        # bass
        bl = int(bar * SR)
        tt = np.arange(bl) / SR
        bass = np.sin(2 * np.pi * midi(ch[0] - 12) * tt) * np.exp(-tt * 0.6) * 0.09
        j = min(bl, n - i)
        out[i:i + j] += bass[:j]
        # arpeggio pluck (8 nota per bar)
        for k in range(8):
            note = arps[bi % 4][k % 4] + (12 if k % 8 == 7 else 0)
            at = t + k * beat / 2
            m = int(0.9 * SR)
            tt = np.arange(m) / SR
            p = (np.sin(2 * np.pi * midi(note) * tt) + 0.3 * np.sin(4 * np.pi * midi(note) * tt)) * np.exp(-tt * 5.5) * 0.045
            a = int(at * SR)
            if a < n:
                jj = min(m, n - a)
                out[a:a + jj] += p[:jj]
        t += bar
        bi += 1
    # gema mudah (delay suap-balik)
    d = int(0.36 * SR)
    for k in range(1, 5):
        out[d * k:] += out[:-d * k] * (0.32 ** k)
    out = lp(out, 7000)
    fade = int(2.5 * SR)
    out[:fade] *= np.linspace(0, 1, fade)
    out[-fade:] *= np.linspace(1, 0, fade)
    return out / (np.max(np.abs(out)) + 1e-9) * 0.9


if __name__ == '__main__':
    vo, scenes, total = asyncio.run(build())
    json.dump({'fps': FPS, 'total': total, 'scenes': scenes},
              open(os.path.join(ROOT, 'src', 'hermes', 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    vo = vo / max(1.0, float(np.max(np.abs(vo))) / 0.92)
    write_mp3(vo, os.path.join(PUB, 'vo.mp3'), q=3)
    write_mp3(music(total / FPS + 1), os.path.join(PUB, 'music.mp3'), q=5)
    print(f'siap: {total} frame = {total / FPS:.1f}s, {len(scenes)} babak')
