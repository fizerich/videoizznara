# Video Iklan Braces — Klinik Pergigian Izznara

Dua video animasi (9:16, 1080×1920) untuk iklan braces kedua-dua cawangan Izznara: **Jejawi, Perlis** dan **Mergong, Alor Setar**. Nombor hubungan: WhatsApp 011-7027 2360 sahaja.

| Versi | Konsep | Tempoh | Audio | Fail |
|---|---|---|---|---|
| V1 | Gaya Vox — kertas cream, highlighter, rajah | 42s | Tiada | [`out/izznara-braces-9x16.mp4`](out/izznara-braces-9x16.mp4) |
| V2 | **"Benang Emas"** — hitam premium, satu wayar braces emas mengalir sepanjang video, kamera satu-take, disegerakkan dengan beat | 47s | Muzik + SFX | [`out/izznara-braces-v2-9x16.mp4`](out/izznara-braces-v2-9x16.mp4) |

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

---

# Iklan Pendek Shopee — SUPCASE Magnetic Wallet + Stand

Video iklan ringkas (9:16, 1080×1920) untuk produk Shopee: https://s.shopee.com.my/4B0FoZtby6
Kod: `src/supcase/SupcaseAd.tsx` (susunan babak kedua-dua versi dalam `CUTS`) · Muzik: `audio/generate_supcase.py`

| Versi | Tempoh | Babak | Fail |
|---|---|---|---|
| Penuh | 23s | Semua 8 babak (jadual di bawah) | [`out/supcase-shopee-9x16.mp4`](out/supcase-shopee-9x16.mp4) |
| Pendek | 15s | Hook → 3 fungsi → 5 kad → magnet → stand → CTA (tanpa RFID & warna) | [`out/supcase-shopee-15s-9x16.mp4`](out/supcase-shopee-15s-9x16.mp4) |
| Penuh + suara | 23s | Sama seperti Penuh, dengan suara latar | [`out/supcase-shopee-vo-9x16.mp4`](out/supcase-shopee-vo-9x16.mp4) |
| Pendek + suara | 15s | Sama seperti Pendek, dengan suara latar | [`out/supcase-shopee-15s-vo-9x16.mp4`](out/supcase-shopee-15s-vo-9x16.mp4) |

**Suara latar** — TTS neural Bahasa Melayu (`ms-MY-YasminNeural`, Microsoft Edge TTS melalui `edge-tts`). Skrip setiap babak dalam `audio/voiceover_supcase.py` (`LINES`); muzik diperlahankan automatik semasa suara bercakap. Tukar ke suara lelaki: `python3 audio/voiceover_supcase.py ms-MY-OsmanNeural`, kemudian render semula.

Babak versi penuh:

| Frame | Babak |
|---|---|
| 0–90 | Hook: "Dompet tebal? Kad bersepah? Phone takde stand?" (dipangkah satu-satu) |
| 90–180 | DROP — "3 fungsi. 1 gajet." + produk |
| 180–255 | Simpan 5 kad |
| 255–330 | Kuasa magnet 3,000G, serasi MagSafe |
| 330–420 | Lipat jadi stand — vlog, scroll, tonton video, video call |
| 420–480 | RFID blocking + 1 kad RFID disertakan |
| 480–540 | 7 pilihan warna, iPhone 12–17 (kecuali mini) |
| 540–690 | CTA: 4.9★ 1.3k penilaian, RM151.77 selepas baucar, free shipping, COD, pulangan 15 hari, "Beli di Shopee" |

Maklumat & gambar produk diambil dari halaman Shopee (26 Sep 2026) — gambar dalam `public/supcase/`. Harga boleh berubah; semak semula sebelum iklan disiarkan.

```bash
npm run audio:supcase     # jana semula muzik kedua-dua versi
npm run render:supcase    # 23s -> out/supcase-shopee-9x16.mp4
npm run render:supcase15  # 15s -> out/supcase-shopee-15s-9x16.mp4
npm run vo:supcase           # jana semula suara latar (perlu: pip install edge-tts)
npm run render:supcase:vo    # 23s + suara
npm run render:supcase15:vo  # 15s + suara
```
