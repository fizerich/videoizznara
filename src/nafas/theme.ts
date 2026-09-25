// Tema "Nafas Segar": teal gelap + mint, gaya ilustrasi flat bulat
export const N = {
  bg: '#0f3d45',
  bgDeep: '#082429',
  bgLite: '#15525c',
  mint: '#6ee7c5',
  mintSoft: '#c9f5e8',
  cream: '#fff7ea',
  ink: '#0b1e22',
  stink: '#b9cc3d',
  stinkDark: '#7c8a1c',
  coral: '#ff7a6b',
  red: '#e0344a',
  gum: '#f39aa8',
  gumDark: '#c9606f',
  tongue: '#f07f92',
  tongueDark: '#c95468',
  tartar: '#dcb24a',
  tartarDark: '#9c7a22',
  tooth: '#fffdf8',
  toothShade: '#e6ecea',
  water: '#5ec8f2',
  waterDark: '#2a8fbf',
  sun: '#ffc857',
  maroon: '#660920',
  gold: '#e8c785',
};

export const NF = {
  head: 'Fredoka, sans-serif',
  body: 'Inter, sans-serif',
};

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

// Sempadan scene ikut voiceover (saat)
export const CUTS = {
  hook: [0, 4.05],
  warn: [4.05, 8.1],
  sign1: [8.1, 17.55],
  sign2: [17.55, 25.85],
  sign3: [25.85, 36.1],
  enough: [36.1, 40.55],
  cta: [40.55, 48.5],
} as const;

export const TOTAL = sec(CUTS.cta[1]);

// Tukar masa voiceover (saat, mutlak) kepada frame tempatan scene
export const at = (scene: keyof typeof CUTS, s: number) => sec(s) - sec(CUTS[scene][0]);
