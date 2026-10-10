"""
Jana src/checkup/words.ts — masa perkataan untuk video "Nombor Doktor Gigi".
Masa perkataan dari Whisper (audio/whisper_checkup.json); ejaan dibetulkan mengikut skrip VO asal.

  python3 audio/align_checkup.py
"""
import json, os, re

HERE = os.path.dirname(__file__)
FPS = 30
wh = json.load(open(os.path.join(HERE, 'whisper_checkup.json')))

# Whisper tersalah dengar — ganti dengan ejaan skrip (satu token boleh jadi beberapa perkataan)
FIX = {'terkenombor': ['teka', 'nombor'], 'gusih': ['gusi'], 'rahasia': ['rahsia'], 'ia': ['ya']}

words = []
for si, seg in enumerate(wh):
    merged = []
    for t in seg['words']:
        w = t['w'].strip()
        if w.startswith('-') and merged:
            merged[-1]['w'] += w
            merged[-1]['e'] = t['e']
        else:
            merged.append({'w': w, 's': t['s'], 'e': t['e']})
    for t in merged:
        core = re.sub(r'[^\w-]', '', t['w']).lower()
        pun = re.search(r'[.,?!]+$', t['w'])
        pun = pun.group(0) if pun else ''
        if core in FIX:
            parts = FIX[core]
            d = (t['e'] - t['s']) / len(parts)
            for k, p in enumerate(parts):
                txt = p + (pun if k == len(parts) - 1 else '')
                words.append({'w': txt, 's': round((t['s'] + d * k) * FPS), 'e': round((t['s'] + d * (k + 1)) * FPS), 'seg': si})
        else:
            words.append({'w': t['w'], 's': round(t['s'] * FPS), 'e': round(t['e'] * FPS), 'seg': si})

# Halaman kapsyen: 2-4 perkataan, putus pada tanda baca / panjang baris
pages, cur = [], []
for i, w in enumerate(words):
    cur.append(w)
    nxt = words[i + 1] if i + 1 < len(words) else None
    txt = ' '.join(x['w'] for x in cur)
    end = bool(re.search(r'[.,?!]$', w['w'])) or len(cur) >= 4 or (len(cur) >= 3 and len(txt) > 20)
    if nxt is None or nxt['seg'] != w['seg']:
        end = True
    # elak perkataan pendek yatim ("ya") di halaman sendiri
    if end and nxt is not None and nxt['seg'] == w['seg'] and len(nxt['w']) <= 3 and (i + 2 >= len(words) or words[i + 2]['seg'] != w['seg']) and len(cur) < 5 and not re.search(r'[.,?!]$', w['w']):
        end = False
    if end:
        pages.append(cur)
        cur = []
ts = "// Dijana oleh audio/align_checkup.py — jangan edit manual\nexport type Word = {w: string; s: number; e: number; seg: number};\nexport const PAGES: Word[][] = "
ts += json.dumps(pages, ensure_ascii=False) + ";\n"
open(os.path.join(HERE, '..', 'src', 'checkup', 'words.ts'), 'w').write(ts)
for p in pages:
    print(f"{p[0]['s']/FPS:6.2f}", ' '.join(w['w'] for w in p))
