// V5 — "Mimpi Paling Menakutkan": cerita budak dalam kereta, gaya Vox minimalis.
// Video asal: public/video/mimpi-menakutkan.mov. Masa dalam SAAT video asal.
// Audio asal sangat bising — kapsyen disusun dari transkrip Whisper + semakan; bahagian yang
// tak jelas sengaja dibiarkan tanpa kapsyen. Betulkan teks di CAPTIONS jika perlu.
import React from 'react';
import {timeline, VoxConfig, VoxReel} from '../vox/VoxReel';

const CAPTIONS: VoxConfig['captions'] = [
  ['Saya mimpi', 6.0, 8.2],
  ['yang benar-benar *menakutkan* lah.', 8.3, 9.8],
  ['Sampai *terkejut*', 9.8, 10.8],
  ['pasal mimpi tau.', 10.8, 12.9],
  ['Ok.', 14.0, 14.6],
  ['Pada suatu hari,', 14.7, 16.5],
  ['dalam mimpi saya,', 16.6, 17.9],
  ['nak pergi ke *airport.*', 18.0, 22.6],
  ['Lepas tu,', 22.6, 24.1],
  ['saya pun naik *flight.*', 25.2, 26.9],
  ['Flight *kecil* je.', 26.9, 28.5],
  ['Naik dengan kawan-kawan saya', 28.5, 30.0],
  ['*Aisyah,* *Zahara* dengan *Alira,*', 30.0, 33.6],
  ['dengan saya.', 33.6, 34.6],
  ['Lepas tu,', 48.6, 50.3],
  ['*seat* yang kita pilih tu,', 50.4, 53.6],
  ['contohnya dalam flight ni,', 56.0, 57.2],
  ['saya duduk *belakang*', 57.3, 59.8],
  ['*Takut* *betul!*', 66.0, 68.0],
  ['Kawan-kawan dekat tengah tu,', 68.1, 72.0],
  ['dia *menjerit!*', 72.0, 74.1],
  ['Haa… lepas tu…', 74.5, 75.6],
  ['*wuuu!*', 75.6, 76.4],
  ['Baru *sampai*', 84.0, 84.6],
  ['dan tak sempat', 84.6, 86.9],
  ['nak pergi *pantai*', 87.0, 88.0],
  ['Okey, itu je hari ni.', 91.7, 93.2],
  ['*Bye!*', 93.4, 94.4],
];

export const V5: VoxConfig = {
  video: 'video/mimpi-menakutkan.mov',
  clips: [[4.5, 95.4]],
  captions: CAPTIONS,
  crop: 0.2,
  focusY: 45,
  captionBg: true,
  zoomAt: [14.0, 22.6, 25.2, 48.6, 56.0, 66.0, 68.1, 72.0, 84.0, 91.7],
  scenes: [
    {
      from: 4.5,
      to: 13.6,
      kicker: 'cerita hari ni —',
      title: ['Mimpi paling', 'menakutkan'],
      hlAt: 8.8,
      phases: [{from: 0, lines: [{at: 9.9, text: 'sampai terkejut!', plain: true}]}],
    },
    {
      from: 14.0,
      to: 47.6,
      n: 1,
      kicker: 'pada suatu hari…',
      title: ['Ke airport'],
      hlAt: 21.2,
      phases: [
        {
          from: 14.0,
          icon: 'plane',
          lines: [
            {at: 26.3, text: 'naik flight kecil'},
            {at: 30.0, text: 'dengan Aisyah, Zahara & Alira'},
          ],
        },
      ],
    },
    {
      from: 48.3,
      to: 65.6,
      n: 2,
      kicker: 'lepas tu…',
      title: ['Pilih seat'],
      hlAt: 50.8,
      phases: [{from: 48.3, icon: 'seat', lines: [{at: 50.4, text: 'seat yang kita pilih'}, {at: 57.3, text: 'saya duduk belakang'}]}],
    },
    {
      from: 66.0,
      to: 83.6,
      n: 3,
      kicker: 'tiba-tiba…',
      title: ['Takut betul!'],
      hlAt: 66.6,
      phases: [{from: 66.0, icon: 'scream', lines: [{at: 68.1, text: 'kawan-kawan di tengah'}, {at: 73.4, text: 'semua menjerit!'}]}],
    },
    {
      from: 84.0,
      to: 91.5,
      n: 4,
      kicker: 'akhirnya…',
      title: ['Baru sampai'],
      hlAt: 84.2,
      phases: [{from: 84.0, icon: 'beach', lines: [{at: 84.6, text: 'tak sempat pergi pantai'}]}],
    },
  ],
  recap: {
    from: 91.7,
    kicker: 'ok, itu je hari ni —',
    items: ['Airport — naik flight kecil', 'Seat — duduk belakang', 'Takut — semua menjerit', 'Pantai — tak sempat pergi'],
  },
  end: {kicker: 'itu je hari ni,', line1: 'Sampai jumpa', line2: 'lagi.', hl: 'Bye!'},
  whooshes: [14.0, 48.3, 66.0, 84.0, 91.7],
  pops: [9.9, 26.3, 30.0, 50.4, 57.3, 68.1, 73.4, 84.6],
};

export const TOTAL5 = timeline(V5.clips).total;

export const MimpiV5: React.FC = () => <VoxReel cfg={V5} />;
