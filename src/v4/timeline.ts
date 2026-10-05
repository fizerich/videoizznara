import {interpolate} from 'remotion';
import {cl, ez} from '../v2/kit';

export const TOTAL4 = 1290;

// Sempadan babak (frame) — diselaraskan dengan suara vo-gusi.wav (lihat src/v4/words.ts)
export const T = {
  mirror: 0, // "Kalau rasa gigi makin panjang bila tengok cermin…"
  notGrow: 139, // "…tak membesar."
  recede: 176, // "Sebaliknya, gusi anda…"
  shrink: 252, // "menyusut turun ke bawah"
  causes: 316, // "Antara puncanya ialah…"
  brush: 367, // "berus gigi terlalu kuat"
  disease: 422, // "ada penyakit gusi"
  clench: 468, // "masalah ketap gigi waktu tidur"
  sens: 536, // "Selain nampak panjang…"
  ngilu: 626, // "ngilu"
  cold: 681, // "minum air sejuk"
  fill: 706, // "Kalau hadapi situasi ni, jangan terus fikir nak tampal je"
  tampal: 805,
  cause: 830, // "rawatan sebenarnya bergantung pada punca…"
  punca: 890,
  doctor: 942, // "Jadi, jalan paling selamat…"
  check: 1040, // "doktor gigi untuk pemeriksaan lanjut"
  cta: 1115, // "Hmm, jaga kesihatan mulut anda dari sekarang tau!"
  hit: 1202, // hentakan penutup
} as const;

export const win = (f: number, a: number, b: number, fi = 8, fo = 8) =>
  interpolate(f, [a, a + fi, b - fo, b], [0, 1, 1, 0], cl);

// Kedudukan & skala barisan gigi (x, y, scale) pada setiap babak
const KEYS: [number, number, number, number][] = [
  [T.mirror, 540, 800, 0.95],
  [T.recede, 540, 760, 1.35],
  [T.causes, 540, 470, 0.62],
  [T.sens, 540, 790, 1.15],
  [T.fill, 540, 740, 0.9],
  [T.cause, 540, 470, 0.55],
  [T.doctor, 540, 700, 0.95],
  [T.cta, 540, 500, 0.42],
];

export const teethTf = (f: number) => {
  let x = KEYS[0][1];
  let y = KEYS[0][2];
  let s = KEYS[0][3];
  for (let i = 1; i < KEYS.length; i++) {
    const w = ez(f, KEYS[i][0] - 8, KEYS[i][0] + 16);
    x += (KEYS[i][1] - KEYS[i - 1][1]) * w;
    y += (KEYS[i][2] - KEYS[i - 1][2]) * w;
    s += (KEYS[i][3] - KEYS[i - 1][3]) * w;
  }
  return {x, y, s};
};

export const toScreen = (f: number, px: number, py: number) => {
  const t = teethTf(f);
  return {x: t.x + px * t.s, y: t.y + py * t.s};
};

// Tahap gusi menyusut 0 (normal) → 1 (akar terdedah)
export const recession = (f: number) =>
  interpolate(f, [0, 18, 110, T.shrink, T.shrink + 50], [0.05, 0.05, 0.5, 0.5, 1], cl);

// Keradangan gusi: naik semasa "penyakit gusi", reda selepas nasihat doktor
export const inflame = (f: number) =>
  interpolate(f, [T.recede, T.recede + 30, T.disease, T.disease + 25, T.sens, T.doctor, T.doctor + 40], [0, 0.35, 0.35, 1, 0.45, 0.45, 0], cl);
