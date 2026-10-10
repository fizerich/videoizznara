// Tipografi utama (di atas skrin) — masa dalam saat, diambil dari audio/whisper_checkup.json.
// Setiap baris "pop" masuk tepat apabila perkataan itu disebut dalam VO.
export type Tone = 'ink' | 'maroon' | 'indigo';
export type Callout = {
  kicker?: {t: string; at: number; big?: boolean; tone?: Tone};
  chips?: {t: string; at: number; tone: Tone}[];
  lines?: {t: string; at: number; tone?: Tone; strike?: number}[];
  end?: number; // saat — lalai: sebelum callout seterusnya
};

export const CALLOUTS: Callout[] = [
  // 1 · Hook
  {kicker: {t: 'DI KLINIK GIGI', at: 0.15}, lines: [{t: 'PERNAH TAK?', at: 0.9, tone: 'maroon'}], end: 2.75},
  {lines: [{t: 'DOKTOR SEBUT', at: 3.74}, {t: 'NOMBOR PELIK?', at: 4.42, tone: 'maroon'}]},
  {chips: [{t: '1-6', at: 5.68, tone: 'indigo'}, {t: '2-1', at: 7.24, tone: 'maroon'}, {t: '3-2-1', at: 8.52, tone: 'indigo'}]},
  {kicker: {t: 'MESTI RASA', at: 10.0}, lines: [{t: 'TERTANYA-TANYA?', at: 10.62, tone: 'maroon'}]},
  // 2 · Bukan teka nombor
  {kicker: {t: 'SEBENARNYA', at: 12.2}, lines: [{t: 'BUKAN', at: 13.4}, {t: 'TEKA NOMBOR', at: 14.06, tone: 'maroon', strike: 14.5}]},
  {kicker: {t: 'NOMBOR-NOMBOR TU', at: 14.95}, lines: [{t: 'ADA DUA', at: 16.04}, {t: 'SEBAB UTAMA', at: 16.66, tone: 'maroon'}]},
  // 3 · Sebab 1
  {kicker: {t: 'SEBAB 1', at: 17.78, big: true, tone: 'maroon'}, lines: [{t: 'KENAL PASTI', at: 18.96}, {t: 'KEDUDUKAN GIGI', at: 19.64, tone: 'indigo'}]},
  {kicker: {t: 'DI DALAM MULUT', at: 21.2}, lines: [{t: 'BANYAK GIGI', at: 22.34, tone: 'indigo'}]},
  {kicker: {t: 'DOKTOR GUNA', at: 23.9}, lines: [{t: 'KOD NOMBOR KHAS', at: 24.56, tone: 'maroon'}, {t: 'SETIAP GIGI', at: 25.68}]},
  {kicker: {t: 'MEMUDAHKAN', at: 27.12}, lines: [{t: 'BERITAHU', at: 28.3}, {t: 'PEMBANTU KLINIK', at: 28.64, tone: 'indigo'}]},
  {kicker: {t: 'GIGI MANA?', at: 29.78}, lines: [{t: 'BERLUBANG', at: 30.64}, {t: 'PERLU RAWATAN', at: 31.38, tone: 'maroon'}]},
  // 4 · Sebab 2
  {kicker: {t: 'SEBAB 2', at: 32.85, big: true, tone: 'indigo'}, lines: [{t: 'UKUR TAHAP', at: 35.36}, {t: 'KESIHATAN GUSI', at: 36.2, tone: 'indigo'}]},
  {chips: [{t: '1-2', at: 39.12, tone: 'indigo'}], lines: [{t: 'GUSI SIHAT', at: 41.02, tone: 'indigo'}, {t: '& KUAT', at: 42.0}]},
  {chips: [{t: '3+', at: 44.1, tone: 'maroon'}], lines: [{t: 'POKET GUSI', at: 45.94, tone: 'maroon'}, {t: 'BENGKAK', at: 46.84, tone: 'maroon'}], end: 47.85},
  {kicker: {t: 'PERLUKAN', at: 47.9}, lines: [{t: 'PEMBERSIHAN', at: 48.02}, {t: 'RAPI', at: 48.6, tone: 'maroon'}]},
  // 5 · Penutup
  {kicker: {t: 'LEPAS NI', at: 49.76}, lines: [{t: 'JANGAN PANIK!', at: 50.34, tone: 'maroon'}]},
  {kicker: {t: 'BAHASA RAHSIA DOKTOR', at: 52.7}, lines: [{t: 'SENYUMAN', at: 54.84, tone: 'indigo'}, {t: 'MANIS ANDA', at: 55.26, tone: 'maroon'}], end: 59.6},
];
