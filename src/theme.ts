// Warna rasmi Izznara (diambil dari logo & laman web klinik)
export const C = {
  maroon: '#660920',
  maroonDark: '#3f0513',
  maroonSoft: '#e9cfd3',
  gold: '#e8c785',
  hilite: '#f2cf6b',
  goldSoft: '#f1dfb6',
  ink: '#210d13',
  muted: '#6f5c61',
  paper: '#f4ecdf',
  paper2: '#e8dccb',
  white: '#fffaf2',
};

export const F = {
  head: 'Oswald, sans-serif',
  body: 'Inter, sans-serif',
  hand: 'Caveat, cursive',
};

export const FPS = 30;

// Tempoh setiap scene (frame @30fps)
export const SCENES = {
  hook: 105,
  problems: 180,
  how: 190,
  options: 240,
  steps: 180,
  branches: 200,
  cta: 165,
} as const;

export const TOTAL = Object.values(SCENES).reduce((a, b) => a + b, 0);
