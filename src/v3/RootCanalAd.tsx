import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import {cl, D, ez, Grain} from '../v2/kit';
import {Logo} from '../components/ui';
import {Tooth} from './Tooth';
import {CAPTION_TOP, Captions} from './Captions';
import {BACTERIA, beat, painAmp, T, toothTf} from './timeline';
import {
  cleanState,
  CtaScene,
  EnjoyScene,
  fillState,
  InfectScene,
  MythScene,
  PainScene,
  ProcedureFx,
  ReliefScene,
  SensScene,
  Stepper,
  ToothInside,
  ToothTools,
  TruthScene,
  TitleScene,
} from './scenes';

const FONTS = ['500 40px Oswald', '700 40px Oswald', '400 40px Inter', '600 40px Inter', '700 40px Inter'];

// Latar: merah tegang → emas penuh harapan
const Backdrop: React.FC<{f: number}> = ({f}) => {
  const hope = ez(f, T.title - 10, T.title + 40);
  const v = beat(f) * painAmp(f) * (1 - hope);
  const dust = Array.from({length: 40}, (_, i) => {
    const x = random(`x${i}`) * 1080;
    const depth = 0.2 + random(`z${i}`) * 0.6;
    const y = (((random(`y${i}`) * 1920 - f * (0.5 + depth * 1.4)) % 1920) + 1920) % 1920;
    const tw = 0.3 + 0.7 * Math.abs(Math.sin(f / 20 + i));
    return {x, y, r: 1.5 + depth * 4, o: tw * (0.15 + depth * 0.5)};
  });
  const g1 = 50 + Math.sin(f / 70) * 14;
  return (
    <AbsoluteFill style={{background: D.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${g1}% 42%, rgba(192,26,66,${(0.3 + v * 0.14) * (1 - hope * 0.75)}), transparent 52%),
            radial-gradient(circle at 50% 46%, rgba(232,199,133,${hope * 0.3}), transparent 55%),
            radial-gradient(circle at 50% 95%, rgba(102,9,32,0.5), transparent 55%),
            radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(0,0,0,0.7) 100%)`,
        }}
      />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {dust.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={D.gold} opacity={d.o * (0.5 + hope * 0.7)} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const SFX: {src: string; at: number; vol: number}[] = [
  {src: 'sfx-pop.wav', at: 12, vol: 0.4},
  {src: 'sfx-zap.wav', at: 140, vol: 0.5},
  {src: 'sfx-zap.wav', at: 170, vol: 0.35},
  {src: 'sfx-whoosh.wav', at: 224, vol: 0.45},
  {src: 'sfx-zap.wav', at: 232, vol: 0.6},
  {src: 'sfx-whoosh.wav', at: 254, vol: 0.45},
  {src: 'sfx-zap.wav', at: 262, vol: 0.6},
  {src: 'sfx-whoosh.wav', at: T.infect - 6, vol: 0.5},
  {src: 'sfx-pop.wav', at: 344, vol: 0.5},
  {src: 'sfx-pop.wav', at: 405, vol: 0.5},
  {src: 'sfx-pop.wav', at: 428, vol: 0.5},
  {src: 'sfx-whoosh.wav', at: T.myth - 6, vol: 0.5},
  {src: 'sfx-pop.wav', at: T.myth + 12, vol: 0.6},
  {src: 'sfx-impact.wav', at: T.truth + 6, vol: 0.5},
  {src: 'sfx-impact.wav', at: T.truth + 24, vol: 0.45},
  {src: 'sfx-ting.wav', at: T.truth + 60, vol: 0.4},
  {src: 'sfx-impact.wav', at: T.title + 8, vol: 0.6},
  {src: 'sfx-impact.wav', at: T.title + 22, vol: 0.5},
  {src: 'sfx-whoosh.wav', at: T.file - 6, vol: 0.5},
  {src: 'sfx-whoosh.wav', at: 944, vol: 0.4},
  {src: 'sfx-whoosh.wav', at: 1004, vol: 0.4},
  {src: 'sfx-whoosh.wav', at: T.kill - 4, vol: 0.45},
  ...BACTERIA.filter((_, i) => i % 3 === 0).map((b) => ({src: 'sfx-pop.wav', at: b.die + 4, vol: 0.35})),
  {src: 'sfx-whoosh.wav', at: T.seal - 3, vol: 0.45},
  {src: 'sfx-ting.wav', at: T.seal + 70, vol: 0.55},
  {src: 'sfx-chime.wav', at: T.relief + 4, vol: 0.5},
  {src: 'sfx-chime.wav', at: 1246, vol: 0.45},
  {src: 'sfx-whoosh.wav', at: T.enjoy - 6, vol: 0.5},
  {src: 'sfx-pop.wav', at: 1345, vol: 0.55},
  {src: 'sfx-pop.wav', at: 1358, vol: 0.55},
  {src: 'sfx-pop.wav', at: 1371, vol: 0.55},
  {src: 'sfx-ting.wav', at: 1428, vol: 0.5},
  {src: 'sfx-impact.wav', at: T.warn + 4, vol: 0.55},
  {src: 'sfx-impact.wav', at: T.warn + 18, vol: 0.5},
  {src: 'sfx-whoosh.wav', at: T.cta - 4, vol: 0.5},
  {src: 'sfx-ting.wav', at: T.cta + 30, vol: 0.5},
  {src: 'sfx-impact.wav', at: T.hit, vol: 0.5},
];

export const RootCanalAd: React.FC = () => {
  const f = useCurrentFrame();
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS.map((x) => document.fonts.load(x))).then(() => continueRender(handle));
  }, [handle]);

  const tf = toothTf(f);
  const v = beat(f);
  const pain = painAmp(f);
  const inflame = Math.min(1, 0.5 + 0.5 * ez(f, 336, 445) + 0.18 * v * pain);
  const glow = interpolate(f, [T.truth, T.truth + 60, T.title + 20, T.file, T.relief, T.relief + 60], [0, 0.45, 0.85, 0.35, 0.5, 1], cl);
  const shake = f >= 140 && f < T.infect - 4 ? 2.6 : 0;
  const wobble = f >= T.myth && f < T.truth ? Math.sin(f / 7) * 2.2 : 0;
  const pulse = f < T.kill ? 1 + 0.035 * v * pain : 1;
  const inCta = f >= T.cta;
  const fine = interpolate(f, [0, 60], [1.0, 1.015], cl);

  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Backdrop f={f} />
      <AbsoluteFill style={{transform: `scale(${fine})`}}>
        <Tooth
          x={tf.x}
          y={tf.y}
          scale={tf.s * pulse}
          rot={wobble}
          inflame={inflame}
          decay={ez(f, 286, 330)}
          clean={cleanState(f)}
          fill={fillState(f)}
          glow={glow}
          gum={1 - ez(f, T.enjoy - 6, T.enjoy + 18)}
          shake={shake}
          overlay={<ToothTools f={f} />}
        >
          <ToothInside f={f} />
        </Tooth>
        <PainScene f={f} />
        <SensScene f={f} />
        <InfectScene f={f} />
        <MythScene f={f} />
        <TruthScene f={f} />
        <TitleScene f={f} />
        <Stepper f={f} />
        <ProcedureFx f={f} />
        <ReliefScene f={f} />
        <EnjoyScene f={f} />
        <CtaScene f={f} />
      </AbsoluteFill>

      {/* logo kecil */}
      <div style={{position: 'absolute', top: 128, left: 0, right: 0, textAlign: 'center', opacity: ez(f, 10, 28) * (1 - ez(f, T.warn - 6, T.warn + 2)) * 0.9}}>
        <Logo white height={54} />
      </div>

      <Captions f={f} top={inCta ? 1212 : CAPTION_TOP} />
      <Grain f={f} />

      <Audio src={staticFile('audio/vo-akar.wav')} volume={1} />
      <Audio src={staticFile('audio/v3-music.wav')} volume={0.9} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={90} layout="none">
          <Audio src={staticFile(`audio/${s.src}`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
