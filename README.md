# Video Iklan — Klinik Pergigian Izznara

Video animasi (9:16, 1080×1920) untuk iklan braces kedua-dua cawangan Izznara: **Jejawi, Perlis** dan **Mergong, Alor Setar**. Nombor hubungan: WhatsApp 011-7027 2360 sahaja.

| Versi | Konsep | Tempoh | Audio | Fail |
|---|---|---|---|---|
| V1 | Gaya Vox — kertas cream, highlighter, rajah | 42s | Tiada | [`out/izznara-braces-9x16.mp4`](out/izznara-braces-9x16.mp4) |
| V3 | **"Hilang 1 Gigi" (remix)** — video talking-head doktor diedit semula: hook beranimasi, zoom punch-in, grafik kesan & rawatan, lower-third WhatsApp, kad penutup | 42.6s | Suara asal + muzik latar + SFX | [`out/izznara-hilang-gigi-v3-9x16.mp4`](out/izznara-hilang-gigi-v3-9x16.mp4) |
| V2 | **"Benang Emas"** — hitam premium, satu wayar braces emas mengalir sepanjang video, kamera satu-take, disegerakkan dengan beat | 47s | Muzik + SFX | [`out/izznara-braces-v2-9x16.mp4`](out/izznara-braces-v2-9x16.mp4) |

## V3 — "Hilang 1 Gigi" (remix video doktor)

Sumber: video asal 37.5s (`public/ref/hilang-gigi-asal.mp4`). Suara dan kapsyen asal dikekalkan; lapisan baharu ditambah di atasnya. Masa diukur terus dari video asal (`src/v3/timeline.ts`).

| Frame | Apa yang berubah | Fail |
|---|---|---|
| 0–140 | Kotak merah "Hilang 1 gigi?" diganti dengan kad hook beranimasi (gigi + ruang kosong berkelip, "Jangan ambil mudah!" bergegar) | `src/v3/scenes.tsx` → `HookCard` |
| sepanjang | Zoom perlahan + punch-in pada setiap potongan, grade warna ringan, bar kemajuan, logo kecil | `src/v3/HilangGigiV3.tsx` |
| 511–613 | Slaid kelabu → "Kalau dibiarkan": rahang beranimasi (gigi jiran condong, gigi bawah naik) + 3 kesan | `KesanPanel` |
| 893–995 | Slaid kelabu → "Cara isi ruang gigi": Bridge, Dental implant, Denture dengan ikon | `RawatanPanel` |
| 995–1127 | Lower-third WhatsApp semasa doktor ajak datang check | `CtaLowerThird` |
| 1127–1277 | Kad penutup: logo, WhatsApp, dua cawangan, seruan "Send Message" | `EndCard` |

Muzik latar lembut disintesis oleh `audio/generate_v3.py` (perlahan semasa doktor bercakap, naik penuh di kad penutup).

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
npm run render:v3  # V3 -> out/izznara-hilang-gigi-v3-9x16.mp4
npm run audio:v3   # jana semula muzik latar V3
npm run audio      # jana semula muzik & SFX (perlu numpy + scipy)
```
