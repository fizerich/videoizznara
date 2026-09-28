# Video Iklan Braces — Klinik Pergigian Izznara

Dua video animasi (9:16, 1080×1920) untuk iklan braces kedua-dua cawangan Izznara: **Jejawi, Perlis** dan **Mergong, Alor Setar**. Nombor hubungan: WhatsApp 011-7027 2360 sahaja.

| Versi | Konsep | Tempoh | Audio | Fail |
|---|---|---|---|---|
| V1 | Gaya Vox — kertas cream, highlighter, rajah | 42s | Tiada | [`out/izznara-braces-9x16.mp4`](out/izznara-braces-9x16.mp4) |
| V2 | **"Benang Emas"** — hitam premium, satu wayar braces emas mengalir sepanjang video, kamera satu-take, disegerakkan dengan beat | 47s | Muzik + SFX | [`out/izznara-braces-v2-9x16.mp4`](out/izznara-braces-v2-9x16.mp4) |

## V3 — Re-edit "Ads 5 - Bridge" (Dental Bridge)

Video talking-head asal (33s) diedit semula supaya nampak lebih premium: [`out/izznara-dental-bridge-reedit-9x16.mp4`](out/izznara-dental-bridge-reedit-9x16.mp4) — 37s.

| Masa | Perubahan | Fail |
|---|---|---|
| 0–3s | Kotak kuning hook diganti kad maroon/emas "TAK SUKA PAKAI GIGI PALSU?" | `src/bridge/parts.tsx` (`HookCard`) |
| Sepanjang | Gred warna hangat + vignette, push-in perlahan, zum & kilatan cahaya pada setiap potongan, bar jenama + bar kemajuan | `src/bridge/BridgeAd.tsx` |
| 12.2–16.7s | Latar kertas kelabu diganti babak "Kelebihan Dental Bridge" (ilustrasi jambatan gigi + 3 kad, disegerakkan dengan suara) | `Benefits` |
| 28.3s–akhir | Butang WhatsApp lower-third | `WaLower` |
| 33.2–37s | Kad akhir baharu: logo, "Ganti gigi hilang tanpa buka & pakai", 2x ansuran, WhatsApp, cawangan | `EndCard` |

Audio asal dikekalkan; ditambah SFX (whoosh/pop/ting) dan sting penutup (`audio/generate_bridge.py`).
Video sumber tidak disimpan dalam repo — muat turun dahulu:

```bash
npm run fetch:bridge   # -> public/source/ads5-bridge.mp4
npm run render:bridge  # -> out/izznara-dental-bridge-reedit-9x16.mp4
```

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
