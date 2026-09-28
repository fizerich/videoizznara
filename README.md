# Video Iklan Braces — Klinik Pergigian Izznara

Dua video animasi (9:16, 1080×1920) untuk iklan braces kedua-dua cawangan Izznara: **Jejawi, Perlis** dan **Mergong, Alor Setar**. Nombor hubungan: WhatsApp 011-7027 2360 sahaja.

| Versi | Konsep | Tempoh | Audio | Fail |
|---|---|---|---|---|
| V1 | Gaya Vox — kertas cream, highlighter, rajah | 42s | Tiada | [`out/izznara-braces-9x16.mp4`](out/izznara-braces-9x16.mp4) |
| V3 | **"4 Cara Jaga Gigi"** — video talking-head asal + kapsyen karaoke, panel tip animasi, jump-cut & zoom | ~1m 43s | Suara asal + muzik lembut + SFX | [`out/izznara-tips-jaga-gigi-9x16.mp4`](out/izznara-tips-jaga-gigi-9x16.mp4) |
| V4 | **"4 Cara Jaga Gigi" — Vox minimalis** — kertas krim, dakwat hitam, highlighter kuning, video dalam bingkai foto | ~1m 43s | Suara asal + muzik lembut + SFX | [`out/izznara-tips-jaga-gigi-vox-9x16.mp4`](out/izznara-tips-jaga-gigi-vox-9x16.mp4) |
| V2 | **"Benang Emas"** — hitam premium, satu wayar braces emas mengalir sepanjang video, kamera satu-take, disegerakkan dengan beat | 47s | Muzik + SFX | [`out/izznara-braces-v2-9x16.mp4`](out/izznara-braces-v2-9x16.mp4) |

## V3 — "4 Cara Jaga Gigi"

Video asal (`public/video/tips-jaga-gigi.mov`, dirakam dalam kereta) dijadikan reel 9:16 yang lebih hidup:

- **Jump-cut** — senyap panjang dan "Ok" meleret dibuang (111s → ~97s), zoom bertukar pada setiap potongan & ayat penting.
- **Kapsyen karaoke** — perkataan semasa disorot, kata kunci warna emas. Teks disemak dari transkrip Whisper.
- **Panel tip animasi** di ruang siling (atas kepala), muncul tepat bila disebut:
  1. Berus gigi — berus menggosok + buih, "2× sehari", pagi ☀ & malam ☾
  2. Floss — benang floss masuk celah gigi & keluarkan sisa makanan
  3. Ubat kumur — botol berbuih, "jangan terlalu kerap", 1× seminggu
  4. Check-up — kalendar "1× setahun", kanta pembesar kesan karies → rawatan awal ✓
- **Ringkasan** 4 tip semasa penutup, kemudian **end card** Izznara + WhatsApp.

Semua masa (potongan, kapsyen, tetingkap tip) ada dalam `src/v3/data.ts` — dalam saat video asal. Muzik latar dijana oleh `audio/generate_v3.py`.

## V4 — "4 Cara Jaga Gigi" (Vox minimalis)

Kandungan & masa sama seperti V3 (kongsi `src/v3/data.ts`), tetapi tanpa tema Izznara maroon/emas:

- Latar kertas krim bertekstur yang "boil" sedikit ala stop-motion; palet hanya hitam, krim, highlighter kuning & pen merah.
- Video diletak dalam **bingkai foto bertampal pita** di bawah — siling kereta dipotong, ruang atas jadi halaman untuk tipografi.
- Tajuk tebal hitam dengan sapuan highlighter, anotasi tulisan tangan (Caveat), garis bawah & coretan pen merah.
- Ikon garisan yang dilukis secara langsung: berus gigi, floss, botol ubat kumur, kalendar, kanta pembesar, tanda ✓.
- Kapsyen minimal — putih, perkataan semasa disapu highlighter kuning.

Fail: `src/v4/VoxV4.tsx` (konfigurasi) di atas enjin `src/vox/VoxReel.tsx`.

## V5 — "Mimpi Paling Menakutkan" (Vox minimalis)

Video kedua (`public/video/mimpi-menakutkan.mov`): seorang budak bercerita tentang mimpinya — ke airport, naik flight kecil dengan kawan-kawan, pilih seat, semua menjerit, tak sempat ke pantai. Guna enjin Vox yang sama, 4 babak dengan ikon kapal terbang, kerusi, muka menjerit & pantai, kapsyen berlatar gelap (baju putih).

Audio asal sangat bising — kapsyen disusun daripada transkrip Whisper dan bahagian yang tak jelas dibiarkan tanpa kapsyen. Betulkan teks dalam `src/v5/MimpiV5.tsx` jika perlu, kemudian `npm run render:v5` → `out/mimpi-menakutkan-vox-9x16.mp4`.

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
npm run render:v3  # V3 -> out/izznara-tips-jaga-gigi-9x16.mp4
npm run audio      # jana semula muzik & SFX (perlu numpy + scipy)
```
