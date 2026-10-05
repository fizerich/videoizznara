import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {data} from '../data';
import {R, INTRO, useLayout} from './theme';
import {Logo, Safe, Stars, clamp, rise} from './ui';

export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const s = L.s;
  const out = interpolate(f, [INTRO - 8, INTRO], [1, 0], clamp);
  return (
    <Safe>
      <div style={{opacity: out, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <div style={rise(f, 0, 20, 50)}>
          <Logo width={880 * s} />
        </div>
        <div style={{...rise(f, 8), marginTop: 20 * s, fontSize: 56 * s, fontWeight: 800, color: R.maroon, lineHeight: 1.15}}>
          {data.nama}
        </div>
        <div style={{...rise(f, 12), marginTop: 10 * s, fontSize: 40 * s, fontWeight: 600, color: R.muted}}>
          {data.cawangan}
        </div>
        <div style={{marginTop: 56 * s}}>
          <Stars count={5} size={118 * s} start={16} gap={10 * s} every={5} />
        </div>
      </div>
    </Safe>
  );
};
