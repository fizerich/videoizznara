import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import '@fontsource/caveat/700.css';
import {cl, S, TOTAL4} from './kit';
import {Captions} from './Captions';
import {BalikScene, BukaScene, CtaScene, HookScene, KetaraScene, ProsScene, RevealScene, RolesScene, SeganScene} from './scenes';

const ORDER: [number, React.FC<{f: number}>][] = [
  [S.hook, HookScene],
  [S.pros, ProsScene],
  [S.segan, SeganScene],
  [S.reveal, RevealScene],
  [S.ketara, KetaraScene],
  [S.buka, BukaScene],
  [S.balik, BalikScene],
  [S.roles, RolesScene],
  [S.cta, CtaScene],
];
const XF = 8; // frame silang (crossfade)

// SFX: [frame, fail, kekuatan]
export const SFX: [number, string, number][] = [
  [S.pros, 'sfx-whoosh.wav', 0.5],
  [S.segan, 'sfx-whoosh.wav', 0.35],
  [184, 'sfx-pop.wav', 0.5],
  [S.reveal, 'sfx-chime.wav', 0.5],
  [772, 'sfx-ting.wav', 0.6],
  [S.ketara, 'sfx-whoosh.wav', 0.35],
  [914, 'sfx-pop.wav', 0.35],
  [944, 'sfx-pop.wav', 0.35],
  [974, 'sfx-pop.wav', 0.35],
  [1056, 'sfx-ting.wav', 0.45],
  [S.roles, 'sfx-whoosh.wav', 0.4],
  [1292, 'sfx-chime.wav', 0.45],
  [S.cta, 'sfx-whoosh.wav', 0.35],
  [1466, 'sfx-pop.wav', 0.6],
];

export const AlignerAd: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {ORDER.map(([start, Scene], i) => {
        const end = i + 1 < ORDER.length ? ORDER[i + 1][0] : TOTAL4;
        if (f < start || f >= end + XF) return null;
        const o = interpolate(f, [end, end + XF], [1, 0], cl);
        return (
          <AbsoluteFill key={i} style={{opacity: o, zIndex: ORDER.length - i}}>
            <Scene f={f} />
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{zIndex: 50}}>
        <Captions f={f} />
      </AbsoluteFill>
      <Audio src={staticFile('v4/vo-aligner.wav')} />
      <Audio src={staticFile('v4/music-aligner.wav')} />
      {SFX.map(([at, file, v], i) => (
        <Sequence key={i} from={at}>
          <Audio src={staticFile(`audio/${file}`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
