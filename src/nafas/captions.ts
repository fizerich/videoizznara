// Masa setiap perkataan (saat) dari voiceover, dibetulkan ejaan.
// Setiap baris = satu kapsyen yang dipaparkan bersama.
type W = [string, number, number?];

export const LINES: W[][] = [
  [['Dah', 0.0], ['elak', 0.26], ['makan', 0.66]],
  [['petai', 0.94], ['atau', 1.38], ['bawang,', 1.64]],
  [['tapi', 2.26], ['nafas', 2.48], ['tetap', 2.9], ['berbau.', 3.24, 3.9]],
  [['Hati-hati,', 4.16]],
  [['mungkin', 4.96], ['puncanya', 5.3]],
  [['bukan', 6.0], ['daripada', 6.28], ['makanan.', 6.72, 7.6]],
  [['Pertama,', 8.28]],
  [['gusi', 9.04], ['mudah', 9.3], ['berdarah', 9.58]],
  [['dan', 10.16], ['ada', 10.42], ['karang', 10.66], ['gigi', 10.98], ['tebal.', 11.22, 11.9]],
  [['Bakteria', 12.16], ['yang', 12.62], ['terperangkap', 12.8]],
  [['dalam', 13.34], ['karang', 13.62], ['gigi,', 13.94]],
  [['inilah', 14.64], ['punca', 14.86], ['utama', 15.24]],
  [['bau', 15.66], ['kurang', 15.96], ['menyenangkan.', 16.3, 17.45]],
  [['Kedua,', 17.66]],
  [['permukaan', 18.46], ['lidah', 18.96]],
  [['ada', 19.34], ['lapisan', 19.66], ['putih.', 20.12, 20.9]],
  [['Ramai', 21.02], ['lupa', 21.22], ['bersihkan', 21.52], ['lidah', 22.04]],
  [['sedangkan', 22.54], ['di', 23.08], ['situlah', 23.28]],
  [['tempat', 23.7], ['bakteria', 24.12]],
  [['mudah', 24.86], ['membiak.', 25.22, 25.9]],
  [['Ketiga,', 26.0]],
  [['mulut', 26.82], ['kerap', 27.14], ['terasa', 27.48], ['kering.', 27.9]],
  [['Air', 28.36], ['liur', 28.96], ['berfungsi', 29.38]],
  [['sebagai', 30.08], ['pembersih', 30.48]],
  [['semula', 31.04], ['jadi.', 31.7, 32.4]],
  [['Bila', 32.5], ['mulut', 32.7], ['kering,', 33.02]],
  [['bakteria', 33.82], ['akan', 34.3], ['membiak', 34.56]],
  [['dengan', 34.96], ['lebih', 35.26], ['cepat.', 35.56, 36.1]],
  [['Jika', 36.2], ['anda', 36.46], ['alami', 36.74]],
  [['tanda-tanda', 37.1], ['ini,', 37.72]],
  [['gosok', 38.42], ['gigi', 38.62], ['sahaja', 38.98]],
  [['tidak', 39.36], ['mencukupi.', 39.6, 40.6]],
  [['Dapatkan', 40.7], ['pemeriksaan', 41.2]],
  [['dan', 41.84], ['rawatan', 42.04], ['scaling', 42.44]],
  [['di', 42.88], ['klinik', 43.28], ['gigi', 43.6]],
  [['untuk', 44.04], ['nafas', 44.32], ['yang', 44.78]],
  [['benar-benar', 45.02], ['segar.', 45.66, 46.6]],
];

// Perkataan yang ditonjolkan dengan warna berbeza
export const KEYWORDS = new Set([
  'petai', 'bawang,', 'berbau.', 'makanan.', 'berdarah', 'karang', 'Bakteria', 'bakteria',
  'punca', 'utama', 'lidah', 'putih.', 'membiak.', 'kering.', 'kering,', 'Air', 'liur',
  'tidak', 'mencukupi.', 'scaling', 'segar.', 'pembersih', 'cepat.',
]);
