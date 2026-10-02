"""
Jana src/v3/words.ts — subtitle perkataan-demi-perkataan untuk video Rawatan Akar.
Teks betul (disemak manual) dipadankan dengan masa perkataan dari transkrip Whisper
(audio/whisper_v3.json) mengikut kedudukan aksara dalam setiap ayat.

  python3 audio/align_v3.py
"""
import json, os, re
import numpy as np

HERE = os.path.dirname(__file__)
FPS = 30
SEGMENTS = [
    "Gigi anda berdenyut-denyut tanpa henti hingga sukar untuk tidur malam?",
    "Rasa ngilu yang teramat sangat setiap kali menikmati makanan panas atau minuman sejuk?",
    "Masalah ini berlaku apabila jangkitan bakteria telah merebak jauh ke dalam pulpa dan saraf gigi anda.",
    "Ramai yang bimbang dan menyangka bahawa mencabut gigi adalah satu-satunya jalan penyelesaian.",
    "Hakikatnya, anda tidak perlu kehilangan gigi tersebut.",
    "Rawatan akar adalah penyelesaian terbaik untuk menyelamatkan gigi semula jadi anda.",
    "Melalui prosedur ini, doktor gigi akan membuang tisu saraf yang rosak,",
    "membasmi kuman pembawa jangkitan dan menutup ruang akar dengan bahan tampalan khas.",
    "Rasa sakit yang berpanjangan akan hilang sepenuhnya.",
    "Anda boleh kembali menikmati hidangan kegemaran dengan selesa serta tersenyum yakin tanpa rasa takut.",
    "Jangan biarkan kesakitan berlarutan lagi.",
    "Dapatkan rawatan akar hari ini dan pulihkan kesihatan gigi anda.",
]

wh = json.load(open(os.path.join(HERE, 'whisper_v3.json')))
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

ts = "// Dijana oleh audio/align_v3.py — jangan edit manual\nexport type Word = {w: string; s: number; e: number; seg: number};\nexport const PAGES: Word[][] = "
ts += json.dumps(pages, ensure_ascii=False) + ";\n"
ts += "export const SEG_START = " + json.dumps([round(s['start'] * FPS) for s in wh]) + ";\n"
open(os.path.join(HERE, '..', 'src', 'v3', 'words.ts'), 'w').write(ts)
for p in pages:
    print(p[0]['s'], ' '.join(w['w'] for w in p))
