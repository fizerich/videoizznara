"""
Jana src/v4/words.ts — subtitle perkataan-demi-perkataan untuk video Gusi Menyusut (V4).
Teks betul (disemak manual) dipadankan dengan masa perkataan dari transkrip Whisper
(audio/whisper_v4.json) mengikut kedudukan aksara dalam setiap ayat.

  python3 audio/align_v4.py
"""
import json, os, re
import numpy as np

HERE = os.path.dirname(__file__)
FPS = 30
SEGMENTS = [
    "Kalau rasa gigi makin panjang bila tengok cermin, sebenarnya gigi anda tak membesar.",
    "Sebaliknya, gusi anda yang mungkin sedang menyusut turun ke bawah.",
    "Antara puncanya ialah tabiat berus gigi terlalu kuat, ada penyakit gusi, atau masalah ketap gigi waktu tidur.",
    "Selain nampak panjang, tanda lain ialah gigi jadi ngilu, terutamanya bila minum air sejuk.",
    "Kalau hadapi situasi ni, jangan terus fikir nak tampal je,",
    "rawatan sebenarnya bergantung pada punca sebenar masalah tu.",
    "Jadi, jalan paling selamat ialah dapatkan nasihat daripada doktor gigi untuk pemeriksaan lanjut.",
    "Hmm, jaga kesihatan mulut anda dari sekarang tau!",
]

wh = json.load(open(os.path.join(HERE, 'whisper_v4.json')))
assert len(wh) == len(SEGMENTS)

words = []
for si, (seg, text) in enumerate(zip(wh, SEGMENTS)):
    ww = seg['words']
    wl = [max(1, len(re.sub(r'\W', '', w['w']))) for w in ww]
    cum = np.concatenate([[0], np.cumsum(wl)])
    starts = [w['s'] for w in ww] + [seg['end']]
    mine = text.split()
    ml = [max(1, len(re.sub(r'\W', '', w))) for w in mine]
    mc = np.concatenate([[0], np.cumsum(ml)]) / sum(ml) * cum[-1]
    times = np.interp(mc, cum, starts)
    for j, w in enumerate(mine):
        words.append({'w': w, 's': round(times[j] * FPS), 'e': round(times[j + 1] * FPS), 'seg': si})

# kumpulkan jadi "halaman" 2-4 perkataan, putus pada tanda baca
pages, cur = [], []
for i, w in enumerate(words):
    cur.append(w)
    end = bool(re.search(r'[.,?!]$', w['w'])) or len(cur) >= 4 or (len(cur) >= 3 and len(' '.join(x['w'] for x in cur)) > 22)
    if i + 1 < len(words) and words[i + 1]['seg'] != w['seg']:
        end = True
    if end:
        pages.append(cur)
        cur = []
if cur:
    pages.append(cur)

ts = "// Dijana oleh audio/align_v4.py — jangan edit manual\nexport type Word = {w: string; s: number; e: number; seg: number};\nexport const PAGES: Word[][] = "
ts += json.dumps(pages, ensure_ascii=False) + ";\n"
ts += "export const SEG_START = " + json.dumps([round(s['start'] * FPS) for s in wh]) + ";\n"
open(os.path.join(HERE, '..', 'src', 'v4', 'words.ts'), 'w').write(ts)
for p in pages:
    print(p[0]['s'], ' '.join(w['w'] for w in p))
