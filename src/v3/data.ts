// V3 — "4 Cara Jaga Gigi": video talking-head asal + kapsyen & grafik animasi
// Semua masa di bawah dalam SAAT video asal (public/video/tips-jaga-gigi.mov).

export const FPS = 30;

// Bahagian video yang dikekalkan (jump-cut buang senyap panjang & "Ok" meleret)
export const CLIPS: [number, number][] = [
  [0.45, 16.75],
  [17.95, 60.98],
  [62.85, 72.6],
  [74.05, 75.45],
  [76.2, 83.6],
  [85.15, 99.3],
  [103.65, 109.1],
];

const LEN = CLIPS.map(([a, b]) => Math.round((b - a) * FPS));
export const CLIP_AT = LEN.map((_, i) => LEN.slice(0, i).reduce((x, y) => x + y, 0));
export const CLIP_LEN = LEN;
export const VIDEO_END = LEN.reduce((x, y) => x + y, 0);
export const END_CARD = 165;
export const TOTAL3 = VIDEO_END + END_CARD;

// Masa video asal (saat) -> frame dalam output
export const at = (src: number): number => {
  for (let i = 0; i < CLIPS.length; i++) {
    const [a, b] = CLIPS[i];
    if (src < a) return CLIP_AT[i];
    if (src <= b) return CLIP_AT[i] + (src - a) * FPS;
  }
  return VIDEO_END;
};

// Titik zoom bertukar (selain setiap potongan) — rentak ala reels
export const ZOOM_AT = [
  ...CLIPS.map(([a]) => a),
  24.1, 28.28, 33.6, 40.06, 48.26, 54.1, 57.82, 67.24, 69.56, 78.64, 81.72, 89.02, 92.76, 95.7, 104.38, 107.52,
].sort((x, y) => x - y);

// Kapsyen: [teks, mula, tamat]. *perkataan* = kata kunci (emas)
export const CAPTIONS: [string, number, number][] = [
  ['Assalamualaikum.', 1.24, 2.2],
  ['Hari ini aku nak explain sikit', 2.66, 4.92],
  ['berkenaan dengan macam mana', 4.92, 7.84],
  ['kita nak *jaga* *gigi* kita', 7.84, 10.44],
  ['supaya tak ada *lubang,*', 10.44, 13.06],
  ['tak ada masalah,', 13.14, 13.74],
  ['tak ada masalah *gusi*', 13.8, 14.88],
  ['dan sebagainya lah.', 14.88, 16.62],

  ['Yang *pertama,*', 18.3, 19.1],
  ['*berus* *gigi* kena buat.', 19.36, 21.16],
  ['Semua dah buat.', 22.34, 23.52],
  ['Berus *dua* *kali* *sehari.*', 24.12, 26.0],
  ['Ok, berus gigi,', 26.32, 28.18],
  ['*pagi* dan *malam.*', 28.28, 29.9],
  ['At least dua kali sehari.', 29.9, 31.28],

  ['Dan yang *kedua,*', 31.56, 33.48],
  ['*floss.*', 33.6, 34.78],
  ['Paling kurang pun buatlah', 35.34, 37.28],
  ['*dua* *hari* *sekali* ke.', 37.38, 39.36],
  ['Ok, paling tak boleh,', 40.06, 42.34],
  ['malas juga pun,', 42.52, 43.88],
  ['buatlah *seminggu* *sekali.*', 43.96, 45.32],
  ['At least ada.', 45.32, 46.92],
  ['Sebab bila kita buat floss ni,', 48.26, 50.82],
  ['kita boleh buang', 50.84, 51.52],
  ['*sisa-sisa* *makanan*', 51.52, 52.48],
  ['yang melekat', 52.48, 52.96],
  ['dekat celah-celah gigi.', 52.96, 53.98],
  ['Selalu kalau makan *daging* kan,', 54.1, 55.8],
  ['kita akan rasa macam melekat kan.', 55.8, 57.44],
  ['So, kena *floss,*', 57.82, 59.08],
  ['baru kita boleh cabut', 59.08, 60.6],
  ['macam tu.', 60.6, 60.92],

  ['Yang *ketiga,*', 62.96, 63.92],
  ['untuk *ubat* *kumur* ni,', 63.96, 67.18],
  ['saya tak galakkan', 67.24, 68.26],
  ['*kerap* *sangat* lah.', 68.26, 69.48],
  ['So, mungkin buat', 69.56, 70.88],
  ['*seminggu* *sekali*', 70.88, 71.36],
  ['ke kurang, macam tu.', 71.36, 72.44],

  ['Dan yang *keempat.*', 74.16, 75.3],
  ['Datang *check* *gigi*', 76.36, 77.72],
  ['dekat *klinik* *gigi.*', 77.72, 78.64],
  ['Tak kisahlah', 78.64, 79.5],
  ['klinik *kerajaan* ke,', 79.5, 80.34],
  ['klinik *swasta* ke.', 80.42, 81.36],
  ['Buat at least', 81.72, 82.72],
  ['*setahun* *sekali.*', 82.72, 83.44],
  ['So, bila kita check', 85.26, 87.98],
  ['setahun sekali tadi,', 87.98, 88.98],
  ['*doktor* akan boleh', 89.02, 90.96],
  ['tengok dari *awal* lah.', 90.96, 92.5],
  ['Gigi tu kalau ada tanda-tanda,', 92.76, 94.64],
  ['macam tanda-tanda', 94.66, 95.7],
  ['gigi ada *karies,*', 95.7, 97.86],
  ['*berlubang,*', 97.86, 98.54],
  ['So, kita boleh buat', 103.8, 104.88],
  ['*rawatan* *awal* lah,', 104.88, 105.7],
  ['*intervention* awal.', 105.7, 106.64],
  ['Ok. So, tu saja dari saya.', 106.72, 108.98],
];

// Tetingkap panel setiap tip (saat video asal)
export const TIP_WIN: [number, number][] = [
  [18.3, 31.4],
  [31.56, 61.0],
  [62.9, 72.6],
  [74.1, 106.7],
];
