import React, {useEffect, useId, useState} from 'react';
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
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

// ---------------------------------------------------------------------------
// Logo "premium" tanpa kotak: latar putih logo.png dibuang secara automatik
// (luminans -> alpha) dan logo diwarnakan semula dengan maroon. Jadi anda cuma
// perlu letak logo gelap atas latar putih sebagai public/logo.png.
// ---------------------------------------------------------------------------
type LogoInfo = {w: number; h: number; box: {x: number; y: number; w: number; h: number}};
let logoPromise: Promise<LogoInfo> | null = null;

const loadLogo = (): Promise<LogoInfo> => {
  logoPromise ??= new Promise<LogoInfo>((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, w, h).data;
      let x0 = w, y0 = h, x1 = 0, y1 = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const lum = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
          if (1.25 * (1 - lum) - 0.12 > 0.2) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
        }
      }
      if (x1 <= x0 || y1 <= y0) {
        x0 = 0; y0 = 0; x1 = w; y1 = h;
      }
      const pad = w * 0.02;
      const bx = Math.max(0, x0 - pad);
      const by = Math.max(0, y0 - pad);
      resolve({w, h, box: {x: bx, y: by, w: Math.min(w, x1 + pad) - bx, h: Math.min(h, y1 + pad) - by}});
    };
    img.onerror = () => reject(new Error('Gagal memuatkan public/logo.png'));
    img.src = staticFile('logo.png');
  });
  return logoPromise;
};

const useLogoInfo = () => {
  const [info, setInfo] = useState<LogoInfo | null>(null);
  const [handle] = useState(() => delayRender('Memuatkan logo'));
  useEffect(() => {
    loadLogo().then(
      (i) => {
        setInfo(i);
        continueRender(handle);
      },
      (e) => cancelRender(e),
    );
  }, [handle]);
  return info;
};

// luminans -> alpha (gelap = pekat, putih = lutsinar), sedikit ambang supaya hingar latar hilang
const ALPHA_ROW = '-0.2655 -0.894 -0.09 0 1.13';

export const Logo: React.FC<{width: number; shineAt?: number}> = ({width, shineAt = 14}) => {
  const f = useCurrentFrame();
  const info = useLogoInfo();
  const uid = useId().replace(/:/g, '');
  if (!info) return null;
  const {w, h, box} = info;
  const href = staticFile('logo.png');
  const ink = hexToUnit(R.maroon);
  const sweep = interpolate(f, [shineAt, shineAt + 34], [box.x - box.w * 0.3, box.x + box.w * 1.15], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const bw = box.w * 0.16;
  return (
    <svg
      width={width}
      height={(width * box.h) / box.w}
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      style={{display: 'block', overflow: 'visible'}}
    >
      <defs>
        <filter id={`ink${uid}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values={`0 0 0 0 ${ink[0]}  0 0 0 0 ${ink[1]}  0 0 0 0 ${ink[2]}  ${ALPHA_ROW}`}
            result="ink"
          />
          <feGaussianBlur in="ink" stdDeviation={w * 0.012} result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.16 0" result="glow" />
          <feOffset in="glow" dy={w * 0.008} result="glow2" />
          <feMerge>
            <feMergeNode in="glow2" />
            <feMergeNode in="ink" />
          </feMerge>
        </filter>
        <filter id={`white${uid}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${ALPHA_ROW}`} />
        </filter>
        <mask id={`mask${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
          <image href={href} width={w} height={h} filter={`url(#white${uid})`} />
        </mask>
        <linearGradient id={`shine${uid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <image href={href} width={w} height={h} filter={`url(#ink${uid})`} />
      <g mask={`url(#mask${uid})`}>
        <rect
          x={sweep}
          y={box.y - box.h * 0.2}
          width={bw}
          height={box.h * 1.4}
          fill={`url(#shine${uid})`}
          transform={`skewX(-18) translate(${box.y * Math.tan((18 * Math.PI) / 180)} 0)`}
        />
      </g>
    </svg>
  );
};

const hexToUnit = (hex: string) => [1, 3, 5].map((i) => (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(4));

// Garis halus yang "melukis" keluar dari tengah
export const Rule: React.FC<{width: number; start: number; color?: string}> = ({width, start, color = R.maroon}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + 22], [0, 1], {...clamp, easing: easeOut});
  return (
    <div
      style={{
        width: width * p,
        height: 3,
        borderRadius: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.55,
      }}
    />
  );
};

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
