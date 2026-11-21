"""
Jana src/v4/words.ts — sari kata perkataan-demi-perkataan untuk video Clear Aligner (V4).
Teks betul (disemak manual) dipadankan dengan masa perkataan Whisper (audio/whisper_v4.json).

  python3 audio/align_v4.py
"""
import json, os, re
import numpy as np

HERE = os.path.dirname(__file__)
FPS = 30
SEGMENTS = [
    "Nak pakai braces, tapi bila tengok yang besi dengan getah warna-warni tu, terus rasa, aduh, macam budak-budak sekolah pula.",
    "Lagi-lagi, kalau hari-hari kena mengajar depan kelas, jumpa pesakit atau bercakap dengan klien,",
    "memang ada yang nak betulkan gigi, tapi rasa segan kalau braces tu nampak jelas.",
    "Haa, kat klinik kami, kami ada Clear Aligner. Yang ni lut sinar dan dibuat ikut bentuk gigi,",
    "jadi bila senyum atau bercakap, dia kurang ketara. Nak makan, berus gigi atau floss pun boleh buka.",
    "Lepas tu pakai balik ikut jadual yang doktor bagi.",
    "Jadi, kalau anda cikgu, pensyarah, doktor atau kerja yang selalu jumpa orang, ini satu pilihan yang boleh dipertimbangkan.",
    "Nak tahu sesuai tak untuk gigi anda? Tekan Send Message. Kami bantu semak slot konsultasi.",
]
KEEP_TOGETHER = {('Clear', 'Aligner.'), ('Send', 'Message.'), ('lut', 'sinar')}

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

pages, cur = [], []
for i, w in enumerate(words):
    cur.append(w)
    nxt = words[i + 1] if i + 1 < len(words) else None
    end = bool(re.search(r'[.,?!]$', w['w'])) or len(cur) >= 4 or (len(cur) >= 3 and len(' '.join(x['w'] for x in cur)) > 20)
    if nxt and (w['w'], nxt['w']) in KEEP_TOGETHER:
        end = False
    if nxt and nxt['seg'] != w['seg']:
        end = True
    if nxt and nxt['s'] - w['e'] > 12:
        end = True
    if end:
        pages.append(cur)
        cur = []
if cur:
    pages.append(cur)

# gabung perkataan tunggal pendek (cth "tu,", "pula.") ke halaman sebelumnya
merged = []
for pg in pages:
    if (merged and len(pg) == 1 and pg[0]['w'] not in ('aduh,', 'Haa,', 'Jadi,', 'konsultasi.', 'pensyarah,')
            and merged[-1][-1]['seg'] == pg[0]['seg']
            and len(' '.join(x['w'] for x in merged[-1] + pg)) <= 34):
        merged[-1] = merged[-1] + pg
    else:
        merged.append(pg)
pages = merged

ts = "// Dijana oleh audio/align_v4.py — jangan edit manual\nexport type Word = {w: string; s: number; e: number; seg: number};\nexport const PAGES: Word[][] = "
ts += json.dumps(pages, ensure_ascii=False) + ";\n"
open(os.path.join(HERE, '..', 'src', 'v4', 'words.ts'), 'w').write(ts)
for p in pages:
    print(p[0]['s'], ' '.join(w['w'] for w in p))
