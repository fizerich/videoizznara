import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {data, namaCawangan} from '../data';
import {R, INTRO, useLayout} from './theme';
import {Logo, Rule, Safe, Stars, clamp, rise} from './ui';

export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const s = L.s;
  const out = interpolate(f, [INTRO - 8, INTRO], [1, 0], clamp);
  return (
    <Safe>
      <div style={{opacity: out, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <div style={rise(f, 0, 22, 40)}>
          <Logo width={880 * s} shineAt={14} />
        </div>
        <div style={{marginTop: 44 * s}}>
          <Rule width={520 * s} start={10} />
        </div>
        <div style={{...rise(f, 10), marginTop: 34 * s, fontSize: 56 * s, fontWeight: 800, color: R.maroon, lineHeight: 1.15}}>
          {data.nama}
        </div>
        <div style={{...rise(f, 12), marginTop: 12 * s, fontSize: 40 * s, fontWeight: 600, color: R.muted}}>
          {namaCawangan}
        </div>
        <div style={{marginTop: 56 * s}}>
          <Stars count={5} size={118 * s} start={16} gap={10 * s} every={5} />
        </div>
      </div>
    </Safe>
  );
};
