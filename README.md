# Video Iklan Braces — Klinik Pergigian Izznara

Dua video animasi (9:16, 1080×1920) untuk iklan braces kedua-dua cawangan Izznara: **Jejawi, Perlis** dan **Mergong, Alor Setar**. Nombor hubungan: WhatsApp 011-7027 2360 sahaja.

| Versi | Konsep | Tempoh | Audio | Fail |
|---|---|---|---|---|
| V1 | Gaya Vox — kertas cream, highlighter, rajah | 42s | Tiada | [`out/izznara-braces-9x16.mp4`](out/izznara-braces-9x16.mp4) |
| V3 | **Edit pro** video talking-head Self-Ligating Braces (rakaman klinik) | 64.6s | Suara dibersihkan + muzik + SFX | [`out/izznara-self-ligating-pro-9x16.mp4`](out/izznara-self-ligating-pro-9x16.mp4) |
| V2 | **"Benang Emas"** — hitam premium, satu wayar braces emas mengalir sepanjang video, kamera satu-take, disegerakkan dengan beat | 47s | Muzik + SFX | [`out/izznara-braces-v2-9x16.mp4`](out/izznara-braces-v2-9x16.mp4) |

## V3 — Edit pro "Self-Ligating Braces"

Video asal (60.7s, talking-head doktor + caption) dikekalkan, dengan lapisan tambahan dalam `src/v3/SelfLigatingPro.tsx`:

| Masa | Perubahan |
|---|---|
| Keseluruhan | Color grade (kontras, saturasi, hangat) + vignette |
| 20.1–21.2s | Typo "Self-Lageting Braces" ditutup dengan label berjenama "Self-Ligating" |
| 40.0–47.0s | Slide kertas kelabu diganti kad maroon "Sesuai untuk siapa?", setiap item muncul ikut suara |
| 60.4s → 64.6s | End card: logo, butang WhatsApp 011-7027 2360, cawangan Jejawi & Mergong |
| Audio | Suara: high-pass, denoise, EQ, kompresor (`audio/voice_v3.sh`). Muzik latar lembut 90 BPM yang disintesis sendiri (`audio/generate_v3.py`) ~19 dB di bawah suara. Loudness akhir -14 LUFS (standard TikTok/IG/YouTube) |

Video asal tidak disimpan dalam repo (75MB). Untuk render semula, muat turun dari
[Google Drive](https://drive.google.com/file/d/1aNPlajUpNR31F2YN-a20LQXHwm8q_62h/view) ke `public/v3/source.mp4`, kemudian:

```bash
npm run audio:v3   # jana voice.wav, music.wav, sfx
npm run render:v3  # -> out/v3-raw.mp4
# normalisasi -14 LUFS + mampat:
ffmpeg -i out/v3-raw.mp4 -c:v libx264 -preset slow -crf 21 -movflags +faststart \
  -af loudnorm=I=-14:TP=-1.5:LRA=7 -c:a aac -b:a 192k out/izznara-self-ligating-pro-9x16.mp4
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
