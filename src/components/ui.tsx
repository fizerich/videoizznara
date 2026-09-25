import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {C, F} from '../theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const useSpring = (delay: number, config: {damping?: number; mass?: number} = {damping: 14, mass: 0.7}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config});
};

export const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1)});

// Latar kertas bertekstur ala Vox
export const Paper: React.FC<{color?: string; children?: React.ReactNode}> = ({
  color = C.paper,
  children,
}) => (
  <AbsoluteFill style={{backgroundColor: color}}>
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.09 0"
        />
      </filter>
      <filter id="fibers">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.08" numOctaves="2" seed="4" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.06 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#fibers)" />
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(60,20,10,0.16) 100%)',
      }}
    />
    {children}
  </AbsoluteFill>
);

// Label bab kecil (kicker) seperti "01 · MASALAH"
export const Kicker: React.FC<{num: string; label: string; delay?: number; dark?: boolean}> = ({
  num,
  label,
  delay = 0,
  dark,
}) => {
  const s = useSpring(delay);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'stretch',
        fontFamily: F.head,
        fontWeight: 500,
        fontSize: 38,
        letterSpacing: 5,
        textTransform: 'uppercase',
        transform: `translateX(${(1 - s) * -60}px)`,
        opacity: s,
      }}
    >
      <span style={{background: dark ? C.gold : C.maroon, color: dark ? C.ink : C.paper, padding: '6px 18px'}}>
        {num}
      </span>
      <span
        style={{
          border: `3px solid ${dark ? C.gold : C.maroon}`,
          color: dark ? C.gold : C.maroon,
          padding: '3px 18px',
        }}
      >
        {label}
      </span>
    </div>
  );
};

// Teks dengan sapuan highlighter
export const Hl: React.FC<{
  p: number;
  color?: string;
  children: React.ReactNode;
  thick?: number;
}> = ({p, color = C.hilite, children, thick = 0.5}) => (
  <span style={{position: 'relative', display: 'inline-block', padding: '0 0.08em'}}>
    <span
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: '0.06em',
        height: `${thick * 100}%`,
        background: color,
        transform: `scaleX(${p}) skewX(-8deg) rotate(-1deg)`,
        transformOrigin: 'left center',
        borderRadius: 6,
        opacity: 0.9,
      }}
    />
    <span style={{position: 'relative'}}>{children}</span>
  </span>
);

// Anak panah lukisan tangan (dilukis mengikut progress)
export const DrawPath: React.FC<{
  d: string;
  p: number;
  color?: string;
  width?: number;
  head?: boolean;
  dash?: boolean;
}> = ({d, p, color = C.maroon, width = 7, head = true, dash}) => {
  const len = 2000;
  return (
    <g>
      <defs>
        <marker
          id={`ah-${color.slice(1)}`}
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill={color} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={len}
        strokeDasharray={dash ? '28 22' : `${len} ${len}`}
        strokeDashoffset={dash ? 0 : len * (1 - p)}
        opacity={dash ? p : 1}
        markerEnd={head && p > 0.97 ? `url(#ah-${color.slice(1)})` : undefined}
      />
    </g>
  );
};

export const Title: React.FC<{children: React.ReactNode; delay?: number; size?: number; color?: string}> = ({
  children,
  delay = 0,
  size = 104,
  color = C.ink,
}) => {
  const s = useSpring(delay, {damping: 16, mass: 0.8});
  return (
    <div
      style={{
        fontFamily: F.head,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.04,
        textTransform: 'uppercase',
        color,
        letterSpacing: 1,
        opacity: s,
        transform: `translateY(${(1 - s) * 50}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Logo: React.FC<{white?: boolean; height?: number; style?: React.CSSProperties}> = ({
  white,
  height = 70,
  style,
}) => (
  <Img
    src={staticFile(white ? 'izznara-logo-white.png' : 'izznara-logo.png')}
    style={{height, ...style}}
  />
);

// Logo kecil di penjuru + nota kaki
export const Chrome: React.FC<{note?: string}> = ({note}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], clamp);
  return (
    <>
      <div style={{position: 'absolute', top: 150, right: 70, opacity: o * 0.95}}>
        <Logo height={62} />
      </div>
      {note ? (
        <div
          style={{
            position: 'absolute',
            left: 80,
            right: 80,
            bottom: 330,
            fontFamily: F.body,
            fontSize: 29,
            lineHeight: 1.35,
            color: C.muted,
            opacity: o,
          }}
        >
          {note}
        </div>
      ) : null}
    </>
  );
};
