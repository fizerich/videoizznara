# Video Iklan Braces — Klinik Pergigian Izznara

> **Video review Google (9:16 & 1:1):** lihat [`PANDUAN-REVIEW.md`](PANDUAN-REVIEW.md) — `npm run render:story` / `npm run render:square`; edit kandungan di `src/data.ts`.

Dua video animasi (9:16, 1080×1920) untuk iklan braces kedua-dua cawangan Izznara: **Jejawi, Perlis** dan **Mergong, Alor Setar**. Nombor hubungan: WhatsApp 011-7027 2360 sahaja.

| Versi | Konsep | Tempoh | Audio | Fail |
|---|---|---|---|---|
| V1 | Gaya Vox — kertas cream, highlighter, rajah | 42s | Tiada | [`out/izznara-braces-9x16.mp4`](out/izznara-braces-9x16.mp4) |
| V3 | **"Rawatan Akar"** — animasi keratan rentas gigi, disegerakkan dengan voiceover (BM), sari kata gaya TikTok | 58s | Voiceover + muzik + SFX | [`out/izznara-rawatan-akar-9x16.mp4`](out/izznara-rawatan-akar-9x16.mp4) |
| V2 | **"Benang Emas"** — hitam premium, satu wayar braces emas mengalir sepanjang video, kamera satu-take, disegerakkan dengan beat | 47s | Muzik + SFX | [`out/izznara-braces-v2-9x16.mp4`](out/izznara-braces-v2-9x16.mp4) |

## V4 — "Nombor Doktor Gigi" (6 klip + VO + tipografi)

6 klip motion graphic (10s setiap satu, `public/izzcheckup/clip1..6.mp4`) + voiceover `public/izzcheckup/vo.wav` (56s). Tipografi mengikut VO: **kapsyen perkataan-demi-perkataan** (bawah, perkataan aktif menyala maroon) dan **callout kata kunci** (atas — chip nombor 1-6 / 2-1 / 3-2-1, "SEBAB 1/2", "BUKAN ~~TEKA NOMBOR~~", "3+ POKET GUSI BENGKAK", dll.). Kedua-duanya dalam zon selamat TikTok/Reels.

```bash
npm run render:checkup   # -> out/izznara-nombor-doktor-9x16.mp4
npm run align:checkup    # jana semula src/checkup/words.ts daripada audio/whisper_checkup.json
```

Penutup: kad logo + CTA (`EndCard.tsx`, data daripada `src/data.ts`) bermula 59.4s; jumlah 64s.

Kod: `src/checkup/` — `callouts.ts` (teks + masa dalam saat, edit di sini), `Callouts.tsx`, `Captions.tsx`, `words.ts` (dijana), `CheckupVideo.tsx`. Tukar klip dengan menggantikan fail `clipN.mp4` (kekalkan 10s, 9:16).

## V3 — "Rawatan Akar" (TikTok / Facebook Reels)

Berdasarkan voiceover `public/audio/vo-akar.wav`: sakit & ngilu → jangkitan bakteria ke pulpa → "cabut?" → rawatan akar 3 langkah (buang saraf, basmi kuman, tutup & tampal) → sakit hilang → CTA WhatsApp. Sari kata perkataan-demi-perkataan dijana oleh `audio/align_v3.py` (masa dari Whisper), kandungan penting diletakkan dalam zon selamat UI TikTok/Reels. Tiada before/after atau testimoni; ada penafian di akhir.

```bash
npm run audio:v3   # muzik (ditunduk di bawah suara) + SFX
npm run render:v3  # -> out/izznara-rawatan-akar-9x16.mp4
```

Kod: `src/v3/` (`timeline.ts` = sempadan babak ikut suara, `Tooth.tsx` = gigi keratan rentas, `scenes.tsx` = babak).

## V2 — "Benang Emas"

Wayar emas bercahaya menjadi benang merah cerita: garis bawah hook → wire braces → rel harga → garis masa 5 langkah → laluan Jejawi–Mergong → rel ulasan Google → lengkung senyuman di CTA. Setiap sempadan babak jatuh tepat pada bar muzik (120 BPM, 1 beat = 15 frame).

| Frame | Babak | Fail |
|---|---|---|
| 0–120 | Hook kinetik + riser | `src/v2/stations/HookV2.tsx` |
| 120–300 | DROP — bracket pop ikut beat, gigi tersusun | `src/v2/stations/BracesV2.tsx` |
| 300–480 | 3 pilihan, harga bergolek ala mesin slot | `src/v2/stations/OptionsV2.tsx` |
| 480–660 | 5 langkah | `src/v2/stations/StepsV2.tsx` |
| 660–900 | Peta, pin jatuh + radar | `src/v2/stations/MapV2.tsx` |
| 900–1140 | Ulasan Google — 4.9★, 905 ulasan, 3 petikan (servis sahaja) | `src/v2/stations/ReviewsV2.tsx` |
| 1140–1410 | CTA senyuman, seruan "Send Message" + hentakan penutup | `src/v2/stations/CtaV2.tsx` |

**Audio** disintesis sendiri oleh `audio/generate.py` (bebas hak cipta): lagu pop-elektronik 120 BPM (Am–F–C–G) dengan intro riser, drop, sidechain, dan SFX (pop, ting, whoosh, impact). Kedudukan SFX ada dalam `src/v2/BracesAdV2.tsx`.

## V1 — Scene

| # | Masa | Scene | Fail |
|---|---|---|---|
| 1 | 0–3.5s | Hook: "Gigi berlapis? Jarang? Jongang?" | `src/scenes/Hook.tsx` |
| 2 | 3.5–9.5s | 5 masalah gigi yang sering dibantu braces | `src/scenes/Problems.tsx` |
| 3 | 9.5–16s | Cara braces berfungsi (bracket + wire, gigi bergerak) | `src/scenes/How.tsx` |
| 4 | 16–24s | 3 pilihan rawatan + harga | `src/scenes/Options.tsx` |
| 5 | 24–30s | 5 langkah untuk mula | `src/scenes/Steps.tsx` |
| 6 | 30–36.5s | Peta dua cawangan | `src/scenes/Branches.tsx` |
| 7 | 36.5–42s | CTA WhatsApp | `src/scenes/Cta.tsx` |

Tempoh setiap scene dan warna brand ada dalam `src/theme.ts`.

## Sumber maklumat

Harga, proses dan alamat Mergong diambil dari https://www.klinikpergigianizznara.com/alorsetar/braces.
Andaian untuk Jejawi (sila sahkan): harga dan nombor WhatsApp sama seperti Mergong.

Gambar before/after dan testimoni sengaja tidak dimasukkan (garis panduan pengiklanan MMC).

## Edit & render

```bash
npm install
npm run studio   # preview & edit dalam browser
npm run render     # V1 -> out/izznara-braces-9x16.mp4
npm run render:v2  # V2 -> out/izznara-braces-v2-9x16.mp4
npm run audio      # jana semula muzik & SFX (perlu numpy + scipy)
```
