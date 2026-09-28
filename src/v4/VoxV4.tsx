// V4 — "4 Cara Jaga Gigi", gaya Vox minimalis (enjin: src/vox/VoxReel.tsx).
// Potongan & kapsyen dikongsi dengan V3 (src/v3/data.ts).
import React from 'react';
import {CAPTIONS, CLIPS} from '../v3/data';
import {VoxConfig, VoxReel} from '../vox/VoxReel';

export const V4: VoxConfig = {
  video: 'video/tips-jaga-gigi.mov',
  clips: CLIPS,
  captions: CAPTIONS,
  zoomAt: [24.1, 28.28, 33.6, 40.06, 48.26, 54.1, 57.82, 67.24, 69.56, 78.64, 81.72, 89.02, 92.76, 95.7, 104.38, 107.52],
  scenes: [
    {
      from: 0.45,
      to: 16.6,
      kicker: 'Assalamualaikum —',
      title: ['4 cara', 'jaga gigi'],
      hlAt: 9.06,
      phases: [{from: 0, lines: [{at: 12.68, text: 'tak berlubang'}, {at: 14.12, text: 'gusi sihat'}]}],
    },
    {
      from: 18.3,
      to: 31.4,
      n: 1,
      kicker: 'yang pertama',
      title: ['Berus gigi'],
      hlAt: 19.8,
      phases: [{from: 18.3, icon: 'brush', lines: [{at: 24.84, text: '2× sehari'}, {at: 28.28, text: 'pagi & malam'}]}],
    },
    {
      from: 31.56,
      to: 61.0,
      n: 2,
      kicker: 'yang kedua',
      title: ['Floss'],
      hlAt: 33.9,
      phases: [
        {from: 31.56, icon: 'floss', ev: [50.6, 51.6], lines: [{at: 37.38, text: 'idealnya 2 hari sekali'}, {at: 43.96, text: 'paling kurang seminggu sekali'}]},
        {from: 48.2, icon: 'floss', ev: [50.6, 51.6], lines: [{at: 51.52, text: 'buang sisa makanan'}, {at: 55.26, text: 'lepas makan daging!'}]},
      ],
    },
    {
      from: 62.9,
      to: 72.6,
      n: 3,
      kicker: 'yang ketiga',
      title: ['Ubat kumur'],
      hlAt: 66.6,
      phases: [
        {
          from: 62.9,
          icon: 'bottle',
          lines: [
            {at: 67.84, text: 'setiap hari', strike: true},
            {at: 70.88, text: '± seminggu sekali'},
          ],
        },
      ],
    },
    {
      from: 74.1,
      to: 106.7,
      n: 4,
      kicker: 'yang keempat',
      title: ['Check-up gigi'],
      hlAt: 77.3,
      phases: [
        {
          from: 74.1,
          icon: 'calendar',
          ev: [82.72],
          lines: [
            {at: 79.5, text: 'klinik kerajaan / swasta'},
            {at: 82.72, text: 'sekurang-kurangnya setahun sekali'},
          ],
        },
        {from: 85.3, icon: 'scan', ev: [95.7], lines: [{at: 89.02, text: 'doktor boleh kesan awal'}, {at: 95.7, text: 'karies, gigi berlubang'}]},
        {from: 104.2, icon: 'check', lines: [{at: 104.9, text: '→ rawatan awal'}]},
      ],
    },
  ],
  recap: {
    from: 106.72,
    kicker: 'jadi, ringkasnya',
    items: ['Berus gigi — 2× sehari', 'Floss — 2 hari sekali', 'Ubat kumur — ± seminggu sekali', 'Check-up — setahun sekali'],
  },
  end: {
    kicker: 'ingat,',
    line1: 'Jaga gigi,',
    line2: 'jaga',
    hl: 'senyuman.',
    info: 'Klinik Pergigian Izznara · Jejawi & Mergong',
    contact: 'WhatsApp 011-7027 2360',
  },
  whooshes: [18.3, 31.56, 62.9, 74.1, 106.72],
  pops: [12.68, 14.12, 24.84, 28.28, 37.38, 43.96, 51.52, 55.26, 67.84, 70.88, 79.5, 82.72, 89.02, 95.7, 104.9],
};

export const VoxV4: React.FC = () => <VoxReel cfg={V4} />;
