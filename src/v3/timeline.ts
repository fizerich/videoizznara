import {interpolate} from 'remotion';
import {cl, ez} from '../v2/kit';

export const FPS = 30;
export const TOTAL3 = 1750;

// Sempadan babak (frame) — diselaraskan dengan suara vo-akar.wav
export const T = {
  pain: 0,
  cold: 133, // "Rasa ngilu…"
  infect: 282, // "Masalah ini berlaku…"
  myth: 473, // "Ramai yang bimbang…"
  truth: 641, // "Hakikatnya…"
  title: 771, // "Rawatan akar adalah…"
  file: 920, // "Melalui prosedur ini…"
  kill: 1049, // "membasmi kuman…"
  seal: 1113, // "menutup ruang akar…"
  relief: 1196, // "Rasa sakit akan hilang…"
  enjoy: 1294, // "Anda boleh kembali menikmati…"
  warn: 1493, // "Jangan biarkan…"
  cta: 1553, // "Dapatkan rawatan akar hari ini…"
  hit: 1672, // hentakan penutup
} as const;

export const win = (f: number, a: number, b: number, fi = 8, fo = 8) =>
  interpolate(f, [a, a + fi, b - fo, b], [0, 1, 1, 0], cl);

// Kedudukan & skala gigi (x, y, scale) pada setiap babak. Peralihan ~ tepat pada sempadan.
const KEYS: [number, number, number, number][] = [
  [0, 540, 850, 1.2],
  [T.cold, 540, 860, 1.15],
  [T.infect, 540, 840, 1.45],
  [T.myth, 540, 940, 0.95],
  [T.truth, 540, 960, 0.95],
  [T.title, 540, 930, 0.85],
  [T.file, 540, 830, 1.4],
  [T.relief, 540, 890, 1.15],
  [T.enjoy, 540, 480, 0.5],
];

export const toothTf = (f: number) => {
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
  const t = toothTf(f);
  return {x: t.x + px * t.s, y: t.y + py * t.s};
};

// Degupan "lub-dub" setiap 30 frame
export const beat = (f: number) => {
  const p = ((f % 30) + 30) % 30;
  return Math.exp(-p / 3.5) + (p >= 7 ? 0.6 * Math.exp(-(p - 7) / 3.5) : 0);
};

// Kekuatan sakit 1 → 0
export const painAmp = (f: number) => {
  if (f < T.truth) return 1;
  if (f < T.file) return 0.55;
  return 0.55 * (1 - ez(f, T.file + 25, T.kill - 8));
};

export type Bact = {lane: 'L' | 'R'; start: number; dur: number; stop: number; die: number; seed: number};
export const BACTERIA: Bact[] = Array.from({length: 12}, (_, i) => ({
  lane: i % 2 === 0 ? 'L' : 'R',
  start: 338 + i * 6,
  dur: 70 + (i % 3) * 10,
  stop: 0.28 + ((i * 5) % 12) * 0.06,
  die: T.kill + 6 + i * 4,
  seed: i + 1,
}));
