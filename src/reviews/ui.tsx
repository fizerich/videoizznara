import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, FPS, R, useLayout} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

export const rise = (f: number, start: number, dur = 18, dist = 40) => {
  const p = interpolate(f, [start, start + dur], [0, 1], {...clamp, easing: easeOut});
  return {opacity: p, transform: `translateY(${(1 - p) * dist}px)`};
};

export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const {width, height} = useLayout();
  const drift = (a: number, sp: number) => Math.sin((f / FPS) * sp + a);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${R.bgTop} 0%, ${R.bgBottom} 100%)`}}>
      <div
        style={{
          position: 'absolute',
          width: width * 0.9,
          height: width * 0.9,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102,9,32,0.07), rgba(102,9,32,0) 70%)',
          left: -width * 0.3 + drift(0, 0.5) * 30,
          top: height * 0.08 + drift(1, 0.4) * 30,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: width * 1.1,
          height: width * 1.1,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(120,180,230,0.28), rgba(120,180,230,0) 70%)',
          right: -width * 0.4 + drift(2, 0.45) * 30,
          bottom: height * 0.02 + drift(3, 0.35) * 30,
        }}
      />
    </AbsoluteFill>
  );
};

export const StarIcon: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block'}}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={color} />
  </svg>
);

// Bintang muncul satu per satu (pop). `count` = bilangan bintang yang diisi.
export const Stars: React.FC<{count: number; size: number; start: number; gap?: number; every?: number}> = ({
  count,
  size,
  start,
  gap = 6,
  every = 5,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', gap}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const p = spring({frame: f - start - i * every, fps, config: {damping: 9, mass: 0.6, stiffness: 180}});
        return (
          <div key={i} style={{transform: `scale(${p}) rotate(${(1 - p) * -40}deg)`, opacity: Math.min(1, p * 2)}}>
            <StarIcon size={size} color={i < count ? R.star : R.starOff} />
          </div>
        );
      })}
    </div>
  );
};

export const Logo: React.FC<{width: number}> = ({width}) => (
  // Logo diletakkan dalam kad putih supaya latar logo (putih) nampak kemas di atas latar biru muda
  <div
    style={{
      width,
      background: '#fff',
      borderRadius: width * 0.06,
      overflow: 'hidden',
      boxShadow: '0 20px 50px rgba(31,55,90,0.12)',
    }}
  >
    <Img src={staticFile('logo.png')} style={{width: '100%', display: 'block'}} />
  </div>
);

export const Safe: React.FC<{children: React.ReactNode; align?: 'center' | 'flex-start'}> = ({children, align = 'center'}) => {
  const L = useLayout();
  return (
    <AbsoluteFill
      style={{
        padding: `${L.top}px ${L.side}px ${L.bottom}px`,
        fontFamily: FONT,
        justifyContent: align,
        alignItems: 'center',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
