import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, interpolate, Sequence, useCurrentFrame, Easing} from 'remotion';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import '@fontsource/caveat/700.css';
import {C, SCENES} from './theme';
import {Hook} from './scenes/Hook';
import {Problems} from './scenes/Problems';
import {How} from './scenes/How';
import {Options} from './scenes/Options';
import {Steps} from './scenes/Steps';
import {Branches} from './scenes/Branches';
import {Cta} from './scenes/Cta';

const ORDER: [keyof typeof SCENES, React.FC][] = [
  ['hook', Hook],
  ['problems', Problems],
  ['how', How],
  ['options', Options],
  ['steps', Steps],
  ['branches', Branches],
  ['cta', Cta],
];

const FONTS = ['500 40px Oswald', '700 40px Oswald', '400 40px Inter', '600 40px Inter', '800 40px Inter', '700 40px Caveat'];

// Peralihan "kertas" maroon yang menyapu skrin antara scene
const Wipe: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const d = 9;
  if (frame < at - d || frame > at + d) return null;
  const e = Easing.inOut(Easing.cubic);
  const y =
    frame < at
      ? interpolate(frame, [at - d, at], [100, 0], {easing: e})
      : interpolate(frame, [at, at + d], [0, -100], {easing: e});
  return (
    <AbsoluteFill style={{transform: `translateY(${y}%)`}}>
      <AbsoluteFill style={{background: C.maroon, borderTop: `26px solid ${C.gold}`, borderBottom: `26px solid ${C.gold}`}} />
    </AbsoluteFill>
  );
};

export const BracesAd: React.FC = () => {
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
  }, [handle]);

  let from = 0;
  const seqs = ORDER.map(([key, Comp]) => {
    const start = from;
    from += SCENES[key];
    return (
      <Sequence key={key} from={start} durationInFrames={SCENES[key]} name={key}>
        <Comp />
      </Sequence>
    );
  });

  const cuts: number[] = [];
  ORDER.slice(0, -1).reduce((acc, [key]) => {
    cuts.push(acc + SCENES[key]);
    return acc + SCENES[key];
  }, 0);

  return (
    <AbsoluteFill style={{background: C.paper}}>
      {seqs}
      {cuts.map((c) => (
        <Wipe key={c} at={c} />
      ))}
    </AbsoluteFill>
  );
};
