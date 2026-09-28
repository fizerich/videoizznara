import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/700.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import {
  BEN_IN,
  BEN_OUT,
  Benefits,
  BrandBar,
  BULLET_AT,
  CUTS,
  EndCard,
  END_AT,
  Flash,
  HOOK_END,
  HookCard,
  SRC_LEN,
  WA_AT,
  WaLower,
} from './parts';

const FONTS = ['500 40px Oswald', '700 40px Oswald', '600 40px Inter', '700 40px Inter', '800 40px Inter'];

const SFX: {src: string; at: number; vol: number}[] = [
  {src: 'sfx-pop.wav', at: 0, vol: 0.35},
  {src: 'sfx-whoosh.wav', at: HOOK_END - 3, vol: 0.4},
  ...CUTS.filter((c) => c !== BEN_IN && c > HOOK_END).map((at) => ({src: 'sfx-whoosh.wav', at: at - 4, vol: 0.28})),
  {src: 'sfx-whoosh.wav', at: BEN_IN - 5, vol: 0.45},
  ...BULLET_AT.map((at) => ({src: 'sfx-pop.wav', at, vol: 0.35})),
  ...BULLET_AT.map((at) => ({src: 'sfx-ting.wav', at: at + 8, vol: 0.22})),
  {src: 'sfx-ting.wav', at: WA_AT + 2, vol: 0.3},
];

// Tempoh setiap syot asal, untuk "push-in" perlahan dan hentakan zum pada potongan
const SEGS = [0, ...CUTS, SRC_LEN];

const camera = (f: number) => {
  let i = 0;
  while (i < SEGS.length - 2 && f >= SEGS[i + 1]) i++;
  const a = SEGS[i];
  const b = SEGS[i + 1];
  const t = (f - a) / (b - a);
  const punch = a > 0 ? 0.04 * Math.exp(-(f - a) / 4) : 0;
  return 1.0 + 0.03 * t + punch;
};

export const BridgeAd: React.FC = () => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
  }, [handle]);

  const showVideo = frame < SRC_LEN;
  const hideVideo = frame > BEN_IN + 9 && frame < BEN_OUT; // babak kelebihan menutup penuh

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {showVideo ? (
        <AbsoluteFill style={{opacity: hideVideo ? 0 : 1}}>
          <AbsoluteFill style={{transform: `scale(${camera(frame)})`, transformOrigin: '50% 42%'}}>
            <OffthreadVideo
              src={staticFile('source/ads5-bridge.mp4')}
              style={{width: 1080, height: 1920, filter: 'contrast(1.07) saturate(1.1) brightness(1.02)'}}
            />
          </AbsoluteFill>
          {/* Gred warna: kehangatan lembut + vignette */}
          <AbsoluteFill style={{background: 'rgba(255,190,140,0.07)', mixBlendMode: 'soft-light'}} />
          <AbsoluteFill
            style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(20,4,8,0.5) 100%)'}}
          />
        </AbsoluteFill>
      ) : null}

      <Flash f={frame} />
      <HookCard f={frame} />
      <Benefits f={frame} />
      <WaLower f={frame} />
      {frame < END_AT + 12 ? <BrandBar f={frame} /> : null}
      <EndCard f={frame} />

      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.max(0, s.at)} durationInFrames={60}>
          <Audio src={staticFile(`audio/${s.src}`)} volume={s.vol} />
        </Sequence>
      ))}
      <Sequence from={END_AT}>
        <Audio src={staticFile('audio/bridge-sting.wav')} volume={0.55} />
      </Sequence>
    </AbsoluteFill>
  );
};
