import React from 'react';

// Rahang gigi 3D (CSS 3D, tanpa WebGL): setiap gigi = timbunan "kepingan" bujur
// yang menghasilkan isipadu pejal. Boleh dipakaikan braces besi atau clear aligner.

const U = 30; // unit saiz (px)
// [lebar, tebal, tinggi] relatif — dari gigi depan (kacip) ke geraham
const TYPES: [number, number, number][] = [
  [1.55, 1.0, 1.95], // kacip tengah
  [1.25, 0.95, 1.75], // kacip sisi
  [1.35, 1.2, 2.05], // taring
  [1.3, 1.45, 1.55], // geraham kecil 1
  [1.3, 1.5, 1.5], // geraham kecil 2
  [1.85, 1.8, 1.4], // geraham 1
  [1.75, 1.75, 1.35], // geraham 2
];

type ToothPos = {x: number; z: number; rot: number; nx: number; nz: number; w: number; d: number; h: number; side: number; i: number};

const ARCH: ToothPos[] = (() => {
  const a = 6.4 * U; // separuh lebar lengkung
  const b = 7.6 * U; // kedalaman lengkung
  // sampel lengkung parabola-elips & ukur panjang lengkok
  const N = 600;
  const pts: {x: number; z: number; s: number}[] = [];
  let s = 0;
  for (let k = 0; k <= N; k++) {
    const t = (k / N) * 1.0; // 0 = depan, 1 = belakang
    const ang = t * 1.62;
    const x = a * Math.sin(ang) * (1 + 0.12 * t);
    const z = b * Math.cos(ang * 0.92) - b * 0.45;
    if (k > 0) s += Math.hypot(x - pts[k - 1].x, z - pts[k - 1].z);
    pts.push({x, z, s});
  }
  const at = (dist: number) => {
    let k = pts.findIndex((p) => p.s >= dist);
    if (k < 1) k = Math.max(1, k < 0 ? pts.length - 1 : 1);
    const p0 = pts[k - 1];
    const p1 = pts[k];
    const tx = p1.x - p0.x;
    const tz = p1.z - p0.z;
    const l = Math.hypot(tx, tz);
    return {x: p1.x, z: p1.z, tx: tx / l, tz: tz / l};
  };
  const out: ToothPos[] = [];
  for (const side of [1, -1]) {
    let d = 0;
    TYPES.forEach(([w, dep, h], i) => {
      const width = w * U;
      const c = d + width / 2 + 2;
      d += width + 4;
      const p = at(c);
      // normal ke luar
      const nx = -p.tz;
      const nz = p.tx;
      const nl = Math.hypot(nx, nz);
      const NX = (nx / nl) * side;
      const NZ = nz / nl;
      out.push({
        x: p.x * side,
        z: p.z,
        nx: NX,
        nz: NZ,
        rot: (Math.atan2(NX, NZ) * 180) / Math.PI,
        w: width,
        d: dep * U,
        h: h * U,
        side,
        i,
      });
    });
  }
  return out;
})();

const GUM_H = 26;
const SLICE = 3;

const Slice: React.FC<{w: number; d: number; y: number; bg: string; br?: string; border?: string; shadow?: string}> = ({
  w,
  d,
  y,
  bg,
  br = '46%',
  border,
  shadow,
}) => (
  <div
    style={{
      position: 'absolute',
      left: -w / 2,
      top: -d / 2,
      width: w,
      height: d,
      borderRadius: br,
      background: bg,
      border,
      boxShadow: shadow,
      boxSizing: 'border-box',
      transform: `translateY(${-y}px) rotateX(90deg)`,
      backfaceVisibility: 'visible',
    }}
  />
);

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c: number[]) => `rgb(${c[0]},${c[1]},${c[2]})`;

const Tooth: React.FC<{t: ToothPos; light: number}> = ({t, light}) => {
  const slices: React.ReactNode[] = [];
  // gusi
  for (let y = 0; y <= GUM_H; y += SLICE) {
    const k = y / GUM_H;
    const c = mix([176, 58, 84], [236, 128, 146], k);
    slices.push(
      <Slice
        key={`g${y}`}
        w={t.w + 14 - k * 6}
        d={t.d + 22 - k * 8}
        y={y}
        br="40%"
        bg={`radial-gradient(ellipse at 50% 80%, ${rgb(mix(c, [255, 190, 200], 0.25))}, ${rgb(c)})`}
      />,
    );
  }
  // gigi
  const top = GUM_H + t.h;
  for (let y = GUM_H; y <= top; y += SLICE) {
    const k = (y - GUM_H) / t.h;
    const bulge = Math.sin(Math.min(1, k * 1.15) * Math.PI * 0.62); // mahkota mengembang ke atas
    const ww = t.w * (0.72 + 0.28 * bulge);
    const dd = t.d * (0.72 + 0.28 * bulge);
    const shade = mix([232, 226, 214], [255, 254, 250], Math.min(1, k * 1.1) * light);
    slices.push(
      <Slice
        key={`t${y}`}
        w={ww}
        d={dd}
        y={y}
        br={t.i < 3 ? '42% 42% 46% 46%' : '38%'}
        bg={`linear-gradient(180deg, ${rgb(mix(shade, [214, 206, 192], 0.3))}, ${rgb(shade)} 60%, #fffef9)`}
      />,
    );
  }
  // permukaan atas (cusp)
  slices.push(
    <Slice
      key="cap"
      w={t.w * 0.96}
      d={t.d * 0.96}
      y={top + 1}
      br={t.i < 3 ? '40%' : '34%'}
      bg={
        t.i < 3
          ? 'linear-gradient(180deg,#fffdf6,#f1e9db)'
          : 'radial-gradient(circle at 30% 32%, #fffef8 0 18%, transparent 30%), radial-gradient(circle at 70% 32%, #fffef8 0 18%, transparent 30%), radial-gradient(circle at 30% 70%, #fffef8 0 18%, transparent 30%), radial-gradient(circle at 70% 70%, #fffef8 0 18%, transparent 30%), #e6dccb'
      }
    />,
  );
  return (
    <div
      style={{
        position: 'absolute',
        transformStyle: 'preserve-3d',
        transform: `translate3d(${t.x}px, 0px, ${t.z}px) rotateY(${t.rot}deg)`,
      }}
    >
      {slices}
    </div>
  );
};

const ELASTIC = ['#ff4f8b', '#3fa9ff', '#ffd23f', '#7ee081', '#b07cff', '#ff8a3d', '#ff4f8b'];

// Braces besi: bracket + getah warna-warni + wayar
const Braces: React.FC<{p: number; f: number}> = ({p, f}) => {
  if (p <= 0) return null;
  const yMid = GUM_H + 0.48 * 1.6 * U;
  const brk = ARCH.map((t) => ({
    x: t.x + t.nx * (t.d / 2 + 3),
    z: t.z + t.nz * (t.d / 2 + 3),
    t,
  }));
  const order = [...ARCH.keys()].sort((a, b) => ARCH[a].side * ARCH[a].i - ARCH[b].side * ARCH[b].i);
  const seq = order.map((k) => brk[k]);
  return (
    <>
      {brk.map((b, k) => {
        const delay = b.t.i * 0.08;
        const pp = Math.max(0, Math.min(1, (p - delay) / 0.4));
        if (pp <= 0) return null;
        const s = 0.4 + 0.6 * pp + Math.sin(pp * Math.PI) * 0.25;
        const bw = Math.min(24, b.t.w * 0.55);
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              transformStyle: 'preserve-3d',
              transform: `translate3d(${b.x}px, ${-yMid}px, ${b.z}px) rotateY(${b.t.rot}deg) scale(${s})`,
              opacity: Math.min(1, pp * 2),
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: -bw / 2 - 5,
                top: -bw / 2 - 5,
                width: bw + 10,
                height: bw + 10,
                borderRadius: '50%',
                border: `6px solid ${ELASTIC[(b.t.i + (b.t.side > 0 ? 0 : 3)) % ELASTIC.length]}`,
                boxSizing: 'border-box',
                transform: 'translateZ(2px)',
                boxShadow: 'inset 0 0 4px rgba(0,0,0,0.25)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -bw / 2,
                top: -bw / 2,
                width: bw,
                height: bw,
                borderRadius: 4,
                background: 'linear-gradient(135deg,#ffffff,#9aa3ad 45%,#e9edf1 60%,#6c757f)',
                boxShadow: '0 0 0 1px #5d656e',
                transform: 'translateZ(4px)',
              }}
            />
          </div>
        );
      })}
      {seq.slice(0, -1).map((a, k) => {
        const b = seq[k + 1];
        if (a.t.side !== b.t.side && !(a.t.i === 0 && b.t.i === 0)) return null;
        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const L = Math.hypot(dx, dz);
        const th = (Math.atan2(-dz, dx) * 180) / Math.PI;
        const wp = Math.max(0, Math.min(1, (p - 0.55) / 0.35));
        return (
          <div
            key={`w${k}`}
            style={{
              position: 'absolute',
              left: -L / 2,
              top: -2,
              width: L,
              height: 4,
              background: 'linear-gradient(180deg,#f4f6f8,#7d858e)',
              transform: `translate3d(${(a.x + b.x) / 2}px, ${-yMid}px, ${(a.z + b.z) / 2 + 6}px) rotateY(${th}deg) scaleX(${wp})`,
              opacity: wp > 0 ? 1 : 0,
            }}
          />
        );
      })}
    </>
  );
};

// Clear aligner — cangkerang lut sinar yang mengikut bentuk setiap gigi
const Aligner: React.FC<{p: number; lift: number; f: number}> = ({p, lift, f}) => {
  if (p <= 0) return null;
  const drop = (1 - p) * 240 + lift * 200;
  const glint = (f * 3) % 360;
  return (
    <>
      {ARCH.map((t, k) => {
        const rings: React.ReactNode[] = [];
        const top = GUM_H + t.h + 5;
        for (let y = GUM_H + 4; y <= top; y += 6) {
          const kk = (y - GUM_H) / t.h;
          const bulge = Math.sin(Math.min(1, kk * 1.15) * Math.PI * 0.62);
          const hl = 0.5 + 0.5 * Math.cos(((t.rot - glint) * Math.PI) / 180);
          rings.push(
            <Slice
              key={y}
              w={t.w * (0.72 + 0.28 * bulge) + 9}
              d={t.d * (0.72 + 0.28 * bulge) + 9}
              y={y}
              br="40%"
              bg={`rgba(200,232,255,${0.05 + hl * 0.05})`}
              border={`1.6px solid rgba(255,255,255,${0.35 + hl * 0.45})`}
            />,
          );
        }
        rings.push(
          <Slice
            key="cap"
            w={t.w + 9}
            d={t.d + 9}
            y={top + 2}
            br="38%"
            bg="linear-gradient(135deg, rgba(255,255,255,0.55), rgba(190,225,255,0.18) 40%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.4))"
            border="1.5px solid rgba(255,255,255,0.8)"
            shadow="0 0 18px rgba(180,225,255,0.55)"
          />,
        );
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              transformStyle: 'preserve-3d',
              transform: `translate3d(${t.x}px, ${-drop}px, ${t.z}px) rotateY(${t.rot}deg)`,
              opacity: Math.min(1, p * 1.6),
            }}
          >
            {rings}
          </div>
        );
      })}
    </>
  );
};

export const Arch3D: React.FC<{
  f: number;
  spin: number; // darjah
  tilt?: number;
  scale?: number;
  braces?: number;
  aligner?: number;
  lift?: number;
  x?: number;
  y?: number;
  shake?: number;
}> = ({f, spin, tilt = 24, scale = 1, braces = 0, aligner = 0, lift = 0, x = 540, y = 760, shake = 0}) => {
  const sx = shake ? Math.sin(f * 2.3) * shake : 0;
  return (
    <div style={{position: 'absolute', left: x + sx, top: y, perspective: 1500, perspectiveOrigin: '0px -200px'}}>
      {/* bayang lembut di lantai */}
      <div
        style={{
          position: 'absolute',
          left: -330 * scale,
          top: 40 * scale,
          width: 660 * scale,
          height: 150 * scale,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(102,9,32,0.28), transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          transformStyle: 'preserve-3d',
          transform: `scale(${scale}) rotateX(${-tilt}deg) rotateY(${spin}deg) translateZ(${-40}px)`,
        }}
      >
        {ARCH.map((t, k) => (
          <Tooth key={k} t={t} light={1} />
        ))}
        <Braces p={braces} f={f} />
        <Aligner p={aligner} lift={lift} f={f} />
      </div>
    </div>
  );
};
