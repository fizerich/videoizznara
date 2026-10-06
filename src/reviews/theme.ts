import {useVideoConfig} from 'remotion';

// Warna ikut logo Izznara (maroon) di atas latar putih / biru muda
export const R = {
  maroon: '#660920',
  maroonDark: '#3f0513',
  maroonSoft: '#f3e3e7',
  ink: '#1d2430',
  muted: '#5f6b7a',
  star: '#fbbc04',
  starOff: '#d9dfe6',
  bgTop: '#f7fbff',
  bgBottom: '#dcecf8',
  white: '#ffffff',
  line: '#e3e9f0',
};

export const FONT = 'Inter, sans-serif';

export const FPS = 30;

// Garis masa (frame @30fps). Jumlah ≈ 25.5 saat untuk 3 review.
export const INTRO = 60; // 2s
export const CARD = 205; // ~6.8s setiap review
export const OUTRO = 90; // 3s
export const totalFrames = (reviewCount: number) => INTRO + CARD * reviewCount + OUTRO;

// Margin selamat. 9:16 jauh dari atas/bawah supaya tak terlindung UI Reels/TikTok.
export const useLayout = () => {
  const {width, height} = useVideoConfig();
  const story = height > width;
  return story
    ? {story, width, height, top: 260, bottom: 400, side: 72, s: 1}
    : {story, width, height, top: 70, bottom: 70, side: 80, s: 0.76};
};
