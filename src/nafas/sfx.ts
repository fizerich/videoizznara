// Jadual sound effect (saat mutlak dalam video). Fail dijana oleh scripts/make_sfx.py
export type Sfx = {at: number; src: string; vol?: number};

const CUT_WHOOSH = [3.8, 7.85, 17.3, 25.6, 35.85, 40.3].map((s) => ({at: s, src: 'whoosh', vol: 0.35}));

export const SFX: Sfx[] = [
  ...CUT_WHOOSH,
  // hook
  {at: 0.9, src: 'pop', vol: 0.5},
  {at: 1.1, src: 'swish', vol: 0.4},
  {at: 1.6, src: 'pop', vol: 0.5},
  {at: 1.78, src: 'swish', vol: 0.4},
  {at: 2.25, src: 'boing', vol: 0.4},
  {at: 2.55, src: 'stink', vol: 0.5},
  // amaran
  {at: 4.16, src: 'alert', vol: 0.4},
  {at: 5.9, src: 'pop', vol: 0.4},
  {at: 6.1, src: 'wrong', vol: 0.3},
  {at: 6.9, src: 'swish', vol: 0.35},
  // tanda 1
  {at: 8.28, src: 'ding', vol: 0.35},
  {at: 9.6, src: 'drip', vol: 0.5},
  {at: 9.85, src: 'drip', vol: 0.45},
  {at: 10.7, src: 'pop', vol: 0.4},
  {at: 12.3, src: 'bubbles', vol: 0.45},
  {at: 14.64, src: 'stink', vol: 0.45},
  {at: 14.86, src: 'pop', vol: 0.5},
  // tanda 2
  {at: 17.66, src: 'ding', vol: 0.35},
  {at: 19.66, src: 'swish', vol: 0.35},
  {at: 21.45, src: 'tick', vol: 0.45},
  {at: 22.1, src: 'wrong', vol: 0.28},
  {at: 24.1, src: 'bubbles', vol: 0.45},
  {at: 24.9, src: 'stink', vol: 0.4},
  // tanda 3
  {at: 26.0, src: 'ding', vol: 0.35},
  {at: 26.35, src: 'sizzle', vol: 0.18},
  {at: 27.5, src: 'pop', vol: 0.35},
  {at: 28.36, src: 'drip', vol: 0.5},
  {at: 29.4, src: 'pop', vol: 0.4},
  {at: 30.4, src: 'whoosh-down', vol: 0.4},
  {at: 30.5, src: 'bubbles', vol: 0.35},
  {at: 32.5, src: 'sizzle', vol: 0.25},
  ...[33.82, 34.3, 34.56, 34.96, 35.26].map((s, i) => ({at: s, src: 'pop', vol: 0.35 + i * 0.05})),
  // tidak mencukupi
  {at: 36.5, src: 'tick', vol: 0.45},
  {at: 36.9, src: 'tick', vol: 0.45},
  {at: 37.3, src: 'tick', vol: 0.45},
  {at: 38.42, src: 'swish', vol: 0.35},
  {at: 39.36, src: 'wrong', vol: 0.3},
  // CTA
  {at: 40.7, src: 'sparkle', vol: 0.35},
  {at: 41.2, src: 'pop', vol: 0.35},
  {at: 42.44, src: 'sizzle', vol: 0.15},
  {at: 43.75, src: 'sparkle', vol: 0.45},
  {at: 44.3, src: 'whoosh-down', vol: 0.3},
  {at: 46.0, src: 'ding', vol: 0.4},
  {at: 46.4, src: 'pop', vol: 0.35},
];
