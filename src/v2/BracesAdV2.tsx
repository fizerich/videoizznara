import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import {Backdrop, ez, Grain, PAN, ST, TOTAL2} from './kit';
import {HookV2} from './stations/HookV2';
import {BRACKET_AT, BracesV2} from './stations/BracesV2';
import {CARD_AT, OptionsV2} from './stations/OptionsV2';
import {StepsV2} from './stations/StepsV2';
import {MapV2, PIN_AT} from './stations/MapV2';
import {REVIEW_AT, ReviewsV2, STAR_AT} from './stations/ReviewsV2';
import {CtaV2, END_HIT, SEND_AT} from './stations/CtaV2';

const STATIONS = [HookV2, BracesV2, OptionsV2, StepsV2, MapV2, ReviewsV2, CtaV2];
const FONTS = ['500 40px Oswald', '700 40px Oswald', '400 40px Inter', '600 40px Inter', '700 40px Inter', '800 40px Inter'];
const DROP = ST[1];

// Semua kesan bunyi, dalam frame global
const SFX: {src: string; at: number; vol: number}[] = [
  ...[15, 30, 45, 75, 88, 100].map((at) => ({src: 'sfx-pop.wav', at, vol: 0.55})),
  {src: 'sfx-impact.wav', at: DROP, vol: 0.55},
  ...BRACKET_AT.map((at) => ({src: 'sfx-pop.wav', at: ST[1] + at, vol: 0.4})),
  ...CARD_AT.map((at) => ({src: 'sfx-ting.wav', at: ST[2] + at + 20, vol: 0.4})),
  ...PIN_AT.map((at) => ({src: 'sfx-ting.wav', at: ST[4] + at + 4, vol: 0.45})),
  ...ST.slice(2).map((b) => ({src: 'sfx-whoosh.wav', at: b - PAN - 2, vol: 0.6})),
  {src: 'sfx-whoosh.wav', at: DROP - PAN - 2, vol: 0.5},
  ...STAR_AT.map((at) => ({src: 'sfx-pop.wav', at: ST[5] + at, vol: 0.35})),
  ...REVIEW_AT.map((at) => ({src: 'sfx-ting.wav', at: ST[5] + at + 6, vol: 0.35})),
  {src: 'sfx-whoosh.wav', at: ST[6] + SEND_AT - 6, vol: 0.5},
  {src: 'sfx-ting.wav', at: ST[6] + SEND_AT + 4, vol: 0.4},
  {src: 'sfx-impact.wav', at: ST[6] + END_HIT, vol: 0.5},
];

export const BracesAdV2: React.FC = () => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
  }, [handle]);

  // Kamera satu-take: turun 1920px pada setiap sempadan babak
  const pans = ST.slice(1).map((b) => ez(frame, b - PAN, b));
  const camY = pans.reduce((a, p) => a + p, 0) * 1920;
  const moving = pans.reduce((a, p) => a + Math.sin(Math.PI * p), 0);

  // "Punch" kecil pada setiap beat selepas drop
  const beatOn = frame >= DROP && frame < ST[6] + END_HIT;
  const punch = beatOn ? 1 + 0.012 * Math.exp(-((frame - DROP) % 15) / 3.5) : 1;

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Backdrop f={frame} camY={camY} />
      <AbsoluteFill style={{transform: `scale(${punch})`, filter: moving > 0.05 ? `blur(${moving * 5}px)` : undefined}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, transform: `translateY(${-camY}px)`}}>
          {STATIONS.map((S, i) => {
            const start = ST[i];
            const end = i + 1 < ST.length ? ST[i + 1] : TOTAL2;
            if (frame < start - PAN - 2 || frame > end) return null;
            return (
              <div key={i} style={{position: 'absolute', left: 0, top: i * 1920, width: 1080, height: 1920}}>
                <S f={frame - start} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Grain f={frame} />

      <Audio src={staticFile('audio/music.wav')} volume={0.85} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={60} layout="none">
          <Audio src={staticFile(`audio/${s.src}`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
