// Garis masa V3 — semua dalam frame @30fps, diukur dari video asal
// (public/ref/hilang-gigi-asal.mp4, 1127 frame).

export const SRC_END = 1127; // video asal tamat
export const END_LEN = 150; // kad penutup
export const TOTAL3 = SRC_END + END_LEN;

// Kotak merah "Hilang 1 gigi?" asal kelihatan pada frame 0–130
export const HOOK_END = 131;

// Slaid kelabu asal yang diganti dengan grafik beranimasi
export const KESAN = {from: 511, to: 613, items: [7, 15, 67]}; // Senget, Gigi sebelah bergerak, Susah nak kunyah
export const RAWATAN = {from: 893, to: 995, title: 2, items: [22, 45, 75]}; // Bridge, Implant, Denture

// Potongan kamera asal — zoom "punch-in" diset semula pada setiap satu
export const CUTS = [0, HOOK_END, 207, 304, 363, KESAN.from, KESAN.to, 735, RAWATAN.from, RAWATAN.to, SRC_END];

// Bahagian CTA doktor ("yang penting datang check dulu")
export const CTA_FROM = RAWATAN.to;
