import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/fredoka/500.css';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import '@fontsource/inter/600.css';
import {CUTS, N, sec, TOTAL} from './theme';
import {Captions} from './Captions';
import {SFX} from './sfx';
import {Hook} from './scenes/Hook';
import {Warn} from './scenes/Warn';
import {Sign1} from './scenes/Sign1';
import {Sign2} from './scenes/Sign2';
import {Sign3} from './scenes/Sign3';
import {Enough} from './scenes/Enough';
import {Cta} from './scenes/Cta';

const ORDER: [keyof typeof CUTS, React.FC][] = [
  ['hook', Hook],
  ['warn', Warn],
  ['sign1', Sign1],
  ['sign2', Sign2],
  ['sign3', Sign3],
  ['enough', Enough],
  ['cta', Cta],
];

const FONTS = ['500 40px Fredoka', '600 40px Fredoka', '700 40px Fredoka', '600 40px Inter'];

// Peralihan bulatan mint yang menutup & membuka skrin
const Iris: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const d = 8;
  if (frame < at - d || frame > at + d) return null;
  const e = Easing.inOut(Easing.cubic);
  const r =
    frame < at
      ? interpolate(frame, [at - d, at], [0, 1250], {easing: e})
      : interpolate(frame, [at, at + d], [1250, 0], {easing: e});
  const cy = frame < at ? 1500 : 420;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920}>
        <circle cx={540} cy={cy} r={r + 40} fill={N.cream} />
        <circle cx={540} cy={cy} r={r} fill={N.mint} />
      </svg>
    </AbsoluteFill>
  );
};

export const NafasAd: React.FC = () => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
  }, [handle]);

  const ctaStart = sec(CUTS.cta[0]);
  const logoOut = interpolate(frame, [ctaStart - 10, ctaStart - 2], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: N.bg}}>
      {ORDER.map(([key, Comp]) => {
        const from = sec(CUTS[key][0]);
        return (
          <Sequence key={key} from={from} durationInFrames={sec(CUTS[key][1]) - from} name={key}>
            <Comp />
          </Sequence>
        );
      })}

      {/* logo Izznara sepanjang video */}
      <div style={{position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: logoOut * interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'})}}>
        <Img src={staticFile('izznara-logo-white.png')} style={{height: 84}} />
      </div>

      <Captions />

      {ORDER.slice(1).map(([key]) => (
        <Iris key={key} at={sec(CUTS[key][0])} />
      ))}

      <Audio src={staticFile('audio/nafas-vo.mp3')} />
      <Audio
        src={staticFile('sfx/bed.mp3')}
        volume={(f) => interpolate(f, [0, 20, sec(45.9), sec(46.6), TOTAL - 25, TOTAL], [0, 0.1, 0.1, 0.28, 0.28, 0], {extrapolateRight: 'clamp'})}
      />
      {SFX.map((s, i) => (
        <Sequence key={i} from={sec(s.at)} durationInFrames={sec(2)} name={`sfx ${s.src}`} layout="none">
          <Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.vol ?? 0.4} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

