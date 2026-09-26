"""
Jana suara latar (TTS neural Bahasa Melayu) untuk iklan SUPCASE.

  pip install edge-tts
  python3 audio/voiceover_supcase.py [ms-MY-YasminNeural | ms-MY-OsmanNeural]

Output: public/audio/vo/<babak>.mp3 + src/supcase/vo.ts (senyap di awal & tempoh ucapan
setiap klip dalam frame, untuk penyelarasan & 'ducking' muzik dalam SupcaseAd.tsx).
"""
import asyncio
import json
import os
import ssl
import subprocess
import sys
import tempfile

import numpy as np
from scipy.io import wavfile

import edge_tts
import edge_tts.communicate

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'public', 'audio', 'vo')
VOICE = sys.argv[1] if len(sys.argv) > 1 else 'ms-MY-YasminNeural'

# Satu klip bagi setiap babak. 'hook-short' untuk versi 15s.
LINES = {
    'hook': 'Dompet tebal? Kad bersepah? Phone takde stand?',
    'hook-short': 'Dompet tebal? Kad bersepah?',
    'hero': 'Satu gajet, tiga fungsi!',
    'cards': 'Simpan sampai lima kad.',
    'magnet': 'Magnet kuat, tiga ribu gram.',
    'stand': 'Lipat sekali, terus jadi stand.',
    'rfid': 'Ada RFID blocking, kad lebih selamat.',
    'colors': 'Tujuh pilihan warna.',
    'cta': 'Free shipping, boleh COD. Tekan link sekarang!',
}

# Proksi sesi ini menamatkan semula TLS — percayai CA bundle jika ada
CA = os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt'
if os.path.exists(CA):
    edge_tts.communicate._SSL_CTX = ssl.create_default_context(cafile=CA)


def speech_span(path):
    """(mula, tamat) ucapan dalam frame — abaikan senyap di awal/akhir klip."""
    with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
        subprocess.run(['npx', 'remotion', 'ffmpeg', '-v', 'error', '-y', '-i', path, '-ac', '1', '-ar', '16000', tmp.name],
                       cwd=ROOT, check=True)
        sr, x = wavfile.read(tmp.name)
    env = np.convolve(np.abs(x.astype(float) / 32768), np.ones(400) / 400, 'same')
    on = np.where(env > 0.01)[0]
    return int(on[0] / sr * 30), int(np.ceil(on[-1] / sr * 30)) + 2


async def main():
    os.makedirs(OUT, exist_ok=True)
    frames = {}
    for key, text in LINES.items():
        path = os.path.join(OUT, f'{key}.mp3')
        await edge_tts.Communicate(text, VOICE, rate='+25%', proxy=os.environ.get('HTTPS_PROXY')).save(path)
        lead, end = speech_span(path)
        frames[key] = {'lead': lead, 'len': end - lead}
        print(f'{key:11s} {end - lead:4d}f  {text}')
    with open(os.path.join(ROOT, 'src', 'supcase', 'vo.ts'), 'w') as f:
        f.write('// Dijana oleh audio/voiceover_supcase.py — jangan edit dengan tangan\n')
        f.write(f"export const VO_VOICE = '{VOICE}';\n")
        f.write(f'export const VO_FRAMES: Record<string, {{lead: number; len: number}}> = {json.dumps(frames, indent=2)};\n')


asyncio.run(main())
