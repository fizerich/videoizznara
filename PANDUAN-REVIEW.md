# Video Promosi Review Google — Panduan Langkah demi Langkah

Video 25.5 saat dengan muzik latar: **Intro** (logo + 5 bintang) → **3 kad review** → **Outro** (kedua-dua cawangan Jejawi & Mergong, waktu operasi, butang CTA, WhatsApp).
Dua format daripada data yang sama: **9:16** (Reels/TikTok/Story) dan **1:1** (feed).

Semua kandungan ada dalam **satu fail: `src/data.ts`**.

---

## A. Setup kali pertama (sekali sahaja)

### 1. Pasang Node.js
1. Pergi ke https://nodejs.org dan muat turun versi **LTS** (pilih yang tertulis "LTS").
2. Pasang seperti biasa (Next → Next → Finish).
3. Buka **Terminal** (Mac: cari "Terminal"; Windows: cari "PowerShell" atau "Command Prompt").
4. Semak pemasangan:
   ```bash
   node -v
   npm -v
   ```
   Kedua-duanya mesti keluarkan nombor versi (cth `v22.x.x`). Node 18 ke atas boleh.

### 2. Muat turun projek
```bash
git clone https://github.com/fizerich/videoizznara.git
cd videoizznara
git checkout claude/izznara-braces-animation-ihw64t
```
(Tiada `git`? Pasang dari https://git-scm.com, atau muat turun ZIP dari GitHub dan extract.)

### 3. Pasang dependency
```bash
npm install
```
Tunggu sehingga siap (1–3 minit). Remotion akan muat turun Chromium sendiri semasa render pertama — perlu internet.

---

## B. Preview dalam browser
```bash
npm run studio
```
Browser akan terbuka (jika tidak, buka http://localhost:3000). Di sebelah kiri pilih:

- **ReviewStory** → 9:16 (1080×1920)
- **ReviewSquare** → 1:1 (1080×1080)

Tekan spacebar untuk main. Setiap kali anda simpan `src/data.ts`, preview terus berubah.
Tekan `Ctrl+C` dalam Terminal untuk berhenti.

---

## C. Render ke MP4
```bash
npm run render:story    # → out/review-story-9x16.mp4
npm run render:square   # → out/review-square-1x1.mp4
```
Ambil 1–3 minit setiap satu. Fail siap dalam folder `out/`.

(Arahan penuh di sebalik skrip: `npx remotion render ReviewStory out/review-story-9x16.mp4`.)

---

## D. Buat video seterusnya (tukar review)

Buka **`src/data.ts`** dan ubah ikut keperluan:

| Medan | Maksud |
|---|---|
| `nama` | Nama klinik (intro) |
| `cawangan` | Senarai cawangan `{nama, alamat}` — semua dipaparkan di outro (tambah/buang ikut keperluan) |
| `waktuOperasi` | Waktu operasi (satu untuk semua cawangan) |
| `whatsapp` | Nombor WhatsApp di outro |
| `cta` | Teks butang |
| `disclaimer` | Baris kecil di hujung |
| `muzik` | Nama fail muzik (lihat bahagian E), `''` = tiada muzik |
| `reviews` | Senarai review: `{nama, bintang, teks}` |

### Cara tambah review baharu daripada screenshot
1. Salin **nama** reviewer, **bilangan bintang** dan **teks** daripada screenshot Google.
2. Gantikan satu blok dalam `reviews`:
   ```ts
   {
     nama: 'Nama Reviewer',
     bintang: 5,
     teks: 'Teks review seperti asal.',
   },
   ```
3. **Kekalkan ejaan asal** (singkatan, titik-titik `..`, huruf kecil) — jangan betulkan atau ubah makna.
4. Gunakan petikan tunggal `'...'`. Jika teks ada tanda `'`, tulis `\'` atau guna petikan berganda `"..."`.
5. Avatar bulat (huruf pertama nama) dan warnanya dijana automatik.
6. Simpan → preview → render semula.

> Reka bentuk dibuat untuk **3 review**. Jika anda tambah/kurang, video akan memanjang/memendek (6.8s setiap review),
> tetapi 3 ialah yang paling sesuai untuk Reels/TikTok.

### Tukar logo
Gantikan `public/logo.png` dengan logo baharu. Logo mesti **satu warna gelap di atas latar putih** — latar putih dibuang automatik (tiada kotak), logo diwarnakan maroon, dipotong kemas dan diberi kilauan ringkas. Logo berbilang warna tidak sesuai kerana akan jadi satu warna; tukar `R.maroon` dalam `src/reviews/theme.ts` jika perlu warna lain.

---

## E. Muzik latar
Muzik lalai: `public/music/latar-review.wav` — muzik lembut dan hangat (piano elektrik + pad), **disintesis sendiri, bebas hak cipta**.
Chime dipadankan dengan visual: 5 bintang di intro, setiap kad review masuk, dan butang CTA di outro.

- Jana semula muzik (perlu `pip install numpy scipy`): `npm run audio:reviews`
- Guna muzik sendiri: letak fail dalam `public/music/`, kemudian tukar `muzik: 'namafail.mp3'` dalam `src/data.ts`.
- Tiada muzik: `muzik: ''`.
- Fade-in 1s, fade-out di hujung, kelantangan 60% (ubah dalam `src/reviews/ReviewsVideo.tsx`).

⚠️ Jika guna muzik sendiri, pastikan bebas royalti / ada lesen — muzik berhak cipta boleh menyebabkan video disekat atau senyap di Instagram/TikTok.

## F. Kawalan reka bentuk & pematuhan
- Margin selamat 9:16: **260px atas, 400px bawah**, 72px kiri/kanan — jauh dari UI Reels/TikTok.
- Teks review hanya dipaparkan seperti asal; tiada tuntutan rawatan, before/after atau janji hasil ditambah.
- Baris "Review daripada pelanggan di Google" ada di outro.
- Tiada statistik/skor agregat dipaparkan (cth "4.9★") kerana tidak diminta dan perlu disahkan.

### ⚠️ Semak sebelum siar
Review **Nor Zatul Effah Hasan** menyebut hasil rawatan ("tampalan... cantik mcm gigi yg asal"). Teks dikekalkan seperti asal
mengikut arahan, tetapi ia boleh dianggap testimoni hasil rawatan. Sila semak garis panduan pengiklanan MMC / kelulusan klinik sebelum
menyiarkan sebagai iklan berbayar. Jika perlu ganti dengan review lain yang hanya bercakap tentang servis, edit `src/data.ts`.

## Struktur kod
```
src/data.ts                 ← SATU-SATUNYA fail untuk diedit
src/reviews/ReviewsVideo.tsx  susunan babak + muzik
src/reviews/Intro.tsx       intro (logo, nama, 5 bintang)
src/reviews/ReviewCard.tsx  kad review ala Google
src/reviews/Outro.tsx       outro (lokasi, waktu, CTA, WhatsApp)
src/reviews/theme.ts        warna, masa (INTRO/CARD/OUTRO), margin selamat
public/logo.png             logo
public/music/               muzik latar (latar-review.wav)
audio/generate_reviews.py   penjana muzik
```
