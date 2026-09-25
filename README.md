# Video Iklan Braces — Klinik Pergigian Izznara

Video animasi gaya Vox (9:16, 1080×1920, 42 saat) untuk iklan braces kedua-dua cawangan Izznara: **Jejawi, Perlis** dan **Mergong, Alor Setar**.

Hasil render: [`out/izznara-braces-9x16.mp4`](out/izznara-braces-9x16.mp4)

## Scene

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
npm run render   # hasilkan out/izznara-braces-9x16.mp4
```

---

# Video Nafas Berbau — 3 Tanda & Rawatan Scaling

Video animasi kedua (9:16, 1080×1920, 48.5 saat), disegerakkan dengan voiceover TTS "Dah elak makan petai atau bawang, tapi nafas tetap berbau…".
Tema **"Nafas Segar"**: teal gelap + mint, ilustrasi flat, subtitle karaoke ikut setiap perkataan, logo Izznara sepanjang video.

Hasil render: [`out/izznara-nafas-9x16.mp4`](out/izznara-nafas-9x16.mp4)

| # | Masa | Scene | Fail |
|---|---|---|---|
| 1 | 0–4s | Hook: petai & bawang dipangkah, tapi nafas tetap berbau | `src/nafas/scenes/Hook.tsx` |
| 2 | 4–8s | Hati-hati! Puncanya mungkin bukan makanan | `src/nafas/scenes/Warn.tsx` |
| 3 | 8–17.5s | Tanda 1: gusi berdarah & karang gigi (bakteria + bau) | `src/nafas/scenes/Sign1.tsx` |
| 4 | 17.5–26s | Tanda 2: lidah berlapis putih, ramai lupa bersihkan | `src/nafas/scenes/Sign2.tsx` |
| 5 | 26–36s | Tanda 3: mulut kering, air liur pembersih semula jadi, bakteria ×16 | `src/nafas/scenes/Sign3.tsx` |
| 6 | 36–40.5s | Semak 3 tanda — gosok gigi sahaja tidak mencukupi | `src/nafas/scenes/Enough.tsx` |
| 7 | 40.5–48.5s | CTA: pemeriksaan + scaling, WhatsApp, dua cawangan | `src/nafas/scenes/Cta.tsx` |

- Masa scene: `src/nafas/theme.ts` (`CUTS`)
- Subtitle (masa setiap perkataan): `src/nafas/captions.ts`
- Jadual sound effect: `src/nafas/sfx.ts`
- Voiceover: `public/audio/nafas-vo.mp3` (dikod semula dari fail CapCut — fail asal ialah MP3 bercantum yang tempohnya dibaca salah)
- Sound effect & muzik latar disintesis sendiri (tiada aset berlesen): `npm run sfx` → `public/sfx/`

Nombor WhatsApp/telefon sama seperti video braces (sila sahkan).

```bash
npm run render:nafas   # hasilkan out/izznara-nafas-9x16.mp4
```
