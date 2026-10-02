import React from 'react';
import {interpolate, random} from 'remotion';
import {getLength, getPointAtLength} from '@remotion/paths';
import {B, BEAT, cl, D, ez, H, sp, Spark, Stage, Wire} from '../v2/kit';
import {Logo} from '../components/ui';
import {Kicker} from './Captions';
import {Bacterium, CANAL_L, CANAL_R, LANE_L, LANE_R} from './Tooth';
import {Bolt, boltPath, Burger, Check, Forceps, HotMug, IceGlass, Sparkle} from './props';
import {BACTERIA, beat, painAmp, T, toScreen, toothTf, win} from './timeline';

const BLUE = '#bfe8ff';
const RED = '#e0405e';

// ---------- teks "hentak" ----------
const Slam: React.FC<{f: number; at: number; size: number; color?: string; children: React.ReactNode; out?: number}> = ({
  f,
  at,
  size,
  color = D.cream,
  children,
  out = Infinity,
}) => {
  if (f < at) return null;
  const s = sp(f, at, 12, 0.6);
  const echo = ez(f, at, at + 14);
  const o = interpolate(f, [out - 8, out], [1, 0], cl);
  const base: React.CSSProperties = {
    fontFamily: H,
    fontWeight: 700,
    fontSize: size,
    lineHeight: 1,
    textTransform: 'uppercase',
    letterSpacing: 2,
    whiteSpace: 'nowrap',
  };
  return (
    <div style={{position: 'relative', display: 'inline-block', opacity: o}}>
      <div
        style={{
          ...base,
          position: 'absolute',
          inset: 0,
          color: 'transparent',
          WebkitTextStroke: `3px ${D.gold}`,
          transform: `scale(${1 + echo * 0.35})`,
          opacity: (1 - echo) * 0.7,
        }}
      >
        {children}
      </div>
      <div
        style={{
          ...base,
          color,
          transform: `scale(${1.7 - s * 0.7})`,
          filter: `blur(${(1 - Math.min(s, 1)) * 14}px)`,
          opacity: Math.min(1, s * 1.5),
          textShadow: '0 10px 40px rgba(0,0,0,0.7)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Col: React.FC<{top: number; gap?: number; children: React.ReactNode}> = ({top, gap = 6, children}) => (
  <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>
    {children}
  </div>
);

// ---------- 1. SAKIT (0 – 133) ----------
export const PainScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, 0, T.cold + 6, 1, 14);
  if (o <= 0) return null;
  const tf = toothTf(f);
  const c = {x: tf.x, y: tf.y - 90 * tf.s};
  const v = beat(f);
  const zzz = [0, 1, 2].map((i) => {
    const t = ez(f, 8 + i * 12, 48 + i * 12);
    return {x: 470 + i * 52 + t * 18, y: 400 - i * 44 - t * 30, s: 0.7 + i * 0.35, o: Math.sin(Math.PI * t)};
  });
  const strike = ez(f, 66, 80);
  return (
    <div style={{opacity: o}}>
      <Stage>
        {/* sinaran merah di belakang gigi */}
        <circle cx={c.x} cy={c.y} r={430 + v * 40} fill={RED} opacity={0.2 + v * 0.1} filter="url(#glow)" />
        {/* gelombang sakit */}
        {[0, 1, 2].map((i) => {
          const p = (((f + i * 10) % 30) + 30) % 30 / 30;
          const r = 110 + p * 330;
          return <ellipse key={i} cx={c.x} cy={c.y} rx={r * 1.15} ry={r} fill="none" stroke={RED} strokeWidth={10 * (1 - p) + 1} opacity={(1 - p) * 0.8 * painAmp(f)} />;
        })}
        {/* garis emanata */}
        {Array.from({length: 12}, (_, i) => {
          const a = (-170 + i * (160 / 11)) * (Math.PI / 180);
          const r1 = 330 + v * 14;
          const r2 = r1 + 40 + v * 46;
          return (
            <line
              key={i}
              x1={c.x + Math.cos(a) * r1 * 1.1}
              y1={c.y + Math.sin(a) * r1}
              x2={c.x + Math.cos(a) * r2 * 1.1}
              y2={c.y + Math.sin(a) * r2}
              stroke="#ff7a93"
              strokeWidth={9}
              strokeLinecap="round"
              opacity={0.9}
            />
          );
        })}
        {/* bulan */}
        <g transform="translate(205 395)" opacity={ez(f, 0, 14)}>
          <circle r={110} fill={D.gold} opacity={0.14} filter="url(#glow)" />
          <mask id="moonMask">
            <rect x={-100} y={-100} width={200} height={200} fill="#fff" />
            <circle cx={34} cy={-20} r={62} fill="#000" />
          </mask>
          <circle r={74} fill={D.gold} mask="url(#moonMask)" />
          {[
            [90, -70, 0],
            [-64, -96, 1],
            [100, 52, 2],
          ].map(([x, y, k]) => (
            <Sparkle key={k} x={x} y={y} s={0.28 + 0.1 * Math.sin(f / 6 + k)} o={0.8} />
          ))}
        </g>
        {/* zzz */}
        {zzz.map((z, i) => (
          <text key={i} x={z.x} y={z.y} fontFamily={H} fontWeight={700} fontSize={64 * z.s} fill={D.cream} opacity={z.o * (1 - strike * 0.7)}>
            Z
          </text>
        ))}
        <path d="M 470 410 L 690 340" stroke={RED} strokeWidth={16} strokeLinecap="round" strokeDasharray="260" strokeDashoffset={260 * (1 - strike)} />
      </Stage>
      {/* jam digital */}
      <div
        style={{
          position: 'absolute',
          left: 680,
          top: 330,
          width: 290,
          height: 130,
          borderRadius: 26,
          background: 'rgba(12,5,7,0.8)',
          border: `3px solid ${RED}`,
          boxShadow: `0 0 ${24 + v * 30}px rgba(224,64,94,0.7)`,
          textAlign: 'center',
          opacity: ez(f, 4, 18),
          transform: `translateY(${(1 - ez(f, 4, 18)) * -30}px)`,
        }}
      >
        <div style={{fontFamily: H, fontWeight: 700, fontSize: 82, lineHeight: '98px', color: '#ff7a93', letterSpacing: 4}}>
          3:07<span style={{fontSize: 38, marginLeft: 8, color: D.cream}}>AM</span>
        </div>
      </div>
    </div>
  );
};

// ---------- 2. NGILU PANAS / SEJUK (133 – 282) ----------
export const SensScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.cold - 4, T.infect + 4, 6, 12);
  if (o <= 0) return null;
  const tf = toothTf(f);
  const crown = {x: tf.x, y: tf.y - 150 * tf.s};
  const seed = Math.floor(f / 3);
  const hotIn = sp(f, 224, 13, 0.7);
  const coldIn = sp(f, 254, 13, 0.7);
  const hotP = {x: 195 - (1 - Math.min(hotIn, 1)) * 330, y: 590};
  const coldP = {x: 885 + (1 - Math.min(coldIn, 1)) * 330, y: 600};
  const gAt = (a: number, b: number) => (f >= a && f < b ? 1 : 0);
  return (
    <div style={{opacity: o}}>
      <Stage>
        {/* "ngilu" — kilat kecil sekeliling mahkota */}
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (-150 + i * 30) * (Math.PI / 180);
          const r1 = 250 * tf.s * 0.95;
          const on = ((f + i * 5) % 14) < 9 ? 1 : 0;
          return (
            <Bolt
              key={i}
              d={boltPath(
                crown.x + Math.cos(a) * r1 * 1.1,
                crown.y + 40 + Math.sin(a) * r1 * 0.85,
                crown.x + Math.cos(a) * (r1 + 90) * 1.1,
                crown.y + 40 + Math.sin(a) * (r1 + 90) * 0.85,
                seed + i,
                5,
                18
              )}
              color={i % 2 ? '#ffd6a0' : BLUE}
              o={(f > T.cold + 4 ? 1 : 0) * on}
              w={6}
            />
          );
        })}
        {/* panas → gigi */}
        {f >= 224 ? (
          <Bolt
            d={boltPath(hotP.x + 80, hotP.y + 40, crown.x - 150, crown.y + 40, seed, 8, 30)}
            color="#ffb27a"
            o={Math.min(1, hotIn) * (gAt(236, 270) || (seed % 3 === 0 ? 1 : 0.35))}
          />
        ) : null}
        {/* sejuk → gigi */}
        {f >= 254 ? (
          <Bolt
            d={boltPath(coldP.x - 80, coldP.y + 40, crown.x + 150, crown.y + 40, seed + 40, 8, 30)}
            color={BLUE}
            o={Math.min(1, coldIn) * (gAt(262, 285) || (seed % 3 === 1 ? 1 : 0.35))}
          />
        ) : null}
        <g transform={`translate(${hotP.x} ${hotP.y}) rotate(${(1 - Math.min(hotIn, 1)) * -20})`} opacity={Math.min(1, hotIn)}>
          <HotMug f={f} />
        </g>
        <g transform={`translate(${coldP.x} ${coldP.y}) rotate(${(1 - Math.min(coldIn, 1)) * 20})`} opacity={Math.min(1, coldIn)}>
          <IceGlass f={f} />
        </g>
      </Stage>
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 745,
          width: 310,
          textAlign: 'center',
          fontFamily: H,
          fontWeight: 700,
          fontSize: 54,
          letterSpacing: 5,
          color: '#ffb27a',
          opacity: Math.min(1, hotIn),
        }}
      >
        PANAS
      </div>
      <div
        style={{
          position: 'absolute',
          left: 730,
          top: 755,
          width: 310,
          textAlign: 'center',
          fontFamily: H,
          fontWeight: 700,
          fontSize: 54,
          letterSpacing: 5,
          color: BLUE,
          opacity: Math.min(1, coldIn),
        }}
      >
        SEJUK
      </div>
    </div>
  );
};

// ---------- 3. JANGKITAN (282 – 473) — bakteria + label ----------
const pointOn = (d: string, q: number) => getPointAtLength(d, getLength(d) * q)!;

const Leader: React.FC<{f: number; at: number; px: number; py: number; lx: number; ly: number; text: string; color?: string; align?: 'l' | 'r'}> = ({
  f,
  at,
  px,
  py,
  lx,
  ly,
  text,
  color = D.gold,
  align = 'l',
}) => {
  const p = ez(f, at, at + 14);
  if (p <= 0) return null;
  const {x, y} = toScreen(f, px, py);
  const ex = lx + (align === 'l' ? 0 : 0);
  return (
    <g opacity={Math.min(1, p * 1.5)}>
      <path d={`M ${ex} ${ly + 8} L ${x + (lx - x) * (1 - p)} ${y + (ly + 8 - y) * (1 - p)}`} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
      <circle cx={x} cy={y} r={11 * p} fill={color} />
      <circle cx={x} cy={y} r={22 * p} fill="none" stroke={color} strokeWidth={3} opacity={0.6} />
      <text
        x={ex}
        y={ly}
        textAnchor={align === 'l' ? 'start' : 'end'}
        fontFamily={H}
        fontWeight={700}
        fontSize={52}
        letterSpacing={5}
        fill={color}
        stroke="#0c0507"
        strokeWidth={10}
        paintOrder="stroke"
      >
        {text}
      </text>
    </g>
  );
};

export const BacteriaField: React.FC<{f: number}> = ({f}) => {
  if (f < 330 || f > T.kill + 80) return null;
  return (
    <>
      {BACTERIA.map((b, i) => {
        const prog = Math.min(1, Math.max(0, (f - b.start) / b.dur));
        const eased = 1 - Math.pow(1 - prog, 2);
        const q = eased * b.stop;
        const dead = ez(f, b.die, b.die + 10);
        const path = b.lane === 'L' ? LANE_L : LANE_R;
        const burst = f >= b.die && f < b.die + 18 ? ez(f, b.die, b.die + 18) : 0;
        const pt = pointOn(path, Math.max(0.001, q));
        return (
          <g key={i}>
            <Bacterium path={path} p={Math.max(0.001, q) * (prog > 0 ? 1 : 0)} f={f} seed={b.seed} size={1.05} dead={dead} />
            {burst > 0 ? (
              <g transform={`translate(${pt.x} ${pt.y})`} opacity={1 - burst}>
                {Array.from({length: 8}, (_, k) => {
                  const a = (k / 8) * Math.PI * 2;
                  return (
                    <line key={k} x1={Math.cos(a) * 18} y1={Math.sin(a) * 18} x2={Math.cos(a) * (28 + burst * 44)} y2={Math.sin(a) * (28 + burst * 44)} stroke="#fff6dc" strokeWidth={5} strokeLinecap="round" />
                  );
                })}
                <circle r={10 + burst * 34} fill="none" stroke={D.gold} strokeWidth={5} />
              </g>
            ) : null}
          </g>
        );
      })}
    </>
  );
};

export const InfectScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.infect - 4, T.myth + 4, 6, 12);
  if (o <= 0) return null;
  const v = beat(f);
  const tf = toothTf(f);
  const c = toScreen(f, 0, -90);
  return (
    <div style={{opacity: o}}>
      <Stage>
        <circle cx={c.x} cy={c.y} r={380 + v * 30} fill={RED} opacity={0.14 + v * 0.06} filter="url(#glow)" />
        {[0, 1].map((i) => {
          const p = (((f + i * 15) % 30) + 30) % 30 / 30;
          return <ellipse key={i} cx={c.x} cy={c.y} rx={(120 + p * 260) * 1.1} ry={120 + p * 260} fill="none" stroke={RED} strokeWidth={8 * (1 - p) + 1} opacity={(1 - p) * 0.55} />;
        })}
        <Leader f={f} at={344} px={-64} py={-192} lx={90} ly={430} text="BAKTERIA" color="#a6e36a" />
        <Leader f={f} at={405} px={40} py={-110} lx={990} ly={470} text="PULPA" align="r" />
        <Leader f={f} at={428} px={-70} py={150} lx={90} ly={1135} text="SARAF" />
      </Stage>
      <div style={{display: 'none'}}>{tf.s}</div>
    </div>
  );
};

// ---------- 4. SALAH FAHAM — cabut gigi? (473 – 641) ----------
export const MythScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.myth - 4, T.truth + 10, 6, 14);
  if (o <= 0) return null;
  const bub = sp(f, T.myth + 10, 11, 0.7);
  const burst = ez(f, T.truth - 2, T.truth + 12);
  const sweat = (i: number) => {
    const p = (((f - T.myth - i * 18) % 54) + 54) % 54 / 54;
    return p;
  };
  const tf = toothTf(f);
  return (
    <div style={{opacity: o}}>
      <Stage>
        {/* titisan peluh */}
        {[0, 1, 2].map((i) => {
          const p = sweat(i);
          const side = i % 2 ? 1 : -1;
          const x = tf.x + side * (230 + i * 12);
          const y = tf.y - 210 + p * 150;
          return (
            <path
              key={i}
              transform={`translate(${x} ${y})`}
              d="M 0 -26 C 14 -4 20 6 20 16 C 20 30 -20 30 -20 16 C -20 6 -14 -4 0 -26 Z"
              fill={BLUE}
              opacity={(1 - p) * 0.9 * Math.min(1, bub)}
            />
          );
        })}
        {/* titik fikiran */}
        {[
          [470, 678, 17],
          [440, 706, 11],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r * Math.min(1, bub)} fill={D.cream} />
        ))}
      </Stage>
      {/* gelembung fikir */}
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 330,
          width: 820,
          height: 320,
          borderRadius: 160,
          background: D.cream,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          transformOrigin: '30% 100%',
          transform: `scale(${Math.min(1, bub) * (1 + burst * 0.4)}) rotate(${Math.sin(f / 9) * 0.8}deg)`,
          opacity: Math.min(1, bub * 1.3) * (1 - burst),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        <svg width={170} height={250} viewBox="-100 -190 200 340">
          <Forceps s={1.1} rot={f > 560 ? Math.sin(f / 5) * 5 : 0} />
        </svg>
        <div>
          <div style={{fontFamily: H, fontWeight: 700, fontSize: 124, lineHeight: 1, color: '#c01a42', textTransform: 'uppercase'}}>Cabut?</div>
          <div style={{fontFamily: H, fontWeight: 500, fontSize: 40, letterSpacing: 4, color: '#3f0513', marginTop: 8, opacity: ez(f, 570, 584)}}>
            SATU-SATUNYA JALAN?
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- 5. HAKIKATNYA (641 – 771) ----------
export const TruthScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.truth - 2, T.title + 8, 4, 14);
  if (o <= 0) return null;
  const tf = toothTf(f);
  const ring = ez(f, T.truth + 22, T.truth + 66);
  const RING = `M ${tf.x} ${tf.y - 335} A 340 335 0 1 1 ${tf.x - 0.01} ${tf.y - 335}`;
  return (
    <div style={{opacity: o}}>
      <Col top={250} gap={0}>
        <Slam f={f} at={T.truth + 6} size={140} out={T.title + 6}>Tak perlu</Slam>
        <Slam f={f} at={T.truth + 24} size={175} color={D.gold} out={T.title + 6}>Cabut!</Slam>
      </Col>
      <Stage>
        <Wire d={RING} p={ring} width={9} spark={false} />
        {[
          [tf.x - 380, tf.y - 220, 0],
          [tf.x + 370, tf.y - 120, 1],
          [tf.x - 330, tf.y + 190, 2],
          [tf.x + 340, tf.y + 230, 3],
        ].map(([x, y, i]) => (
          <Sparkle key={i} x={x} y={y} s={(0.6 + 0.2 * Math.sin(f / 5 + i * 2)) * Math.min(1, ring * 1.5)} o={ring} />
        ))}
      </Stage>
    </div>
  );
};

// ---------- 6. TAJUK: RAWATAN AKAR (771 – 920) ----------
export const TitleScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.title - 2, T.file + 8, 4, 12);
  if (o <= 0) return null;
  const tf = toothTf(f);
  const tag = ez(f, T.title + 4, T.title + 20);
  return (
    <div style={{opacity: o}}>
      <div style={{position: 'absolute', top: 245, left: 0, right: 0, textAlign: 'center'}}>
        <Kicker text="ROOT CANAL TREATMENT" o={tag} />
      </div>
      <Col top={335} gap={0}>
        <Slam f={f} at={T.title + 8} size={150} out={T.file + 4}>Rawatan</Slam>
        <Slam f={f} at={T.title + 22} size={230} color={D.gold} out={T.file + 4}>Akar</Slam>
      </Col>
      <Stage>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2 + f / 60;
          const r = 330 + 18 * Math.sin(f / 9 + i);
          return <Sparkle key={i} x={tf.x + Math.cos(a) * r * 1.15} y={tf.y - 60 + Math.sin(a) * r * 0.8} s={0.45 + 0.2 * Math.sin(f / 6 + i * 2)} o={ez(f, T.title + 20, T.title + 40) * 0.9} />;
        })}
      </Stage>
    </div>
  );
};

// ---------- 7-9. PROSEDUR (920 – 1196) ----------
const STEPS = [
  {n: '1', t: 'BUANG SARAF', at: T.file},
  {n: '2', t: 'BASMI KUMAN', at: T.kill},
  {n: '3', t: 'TUTUP & TAMPAL', at: T.seal},
];

export const Stepper: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.file - 6, T.enjoy + 4, 14, 14);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', top: 205, left: 54, right: 54, display: 'flex', gap: 14, opacity: o}}>
      {STEPS.map((s, i) => {
        const next = STEPS[i + 1]?.at ?? T.relief;
        const active = f >= s.at && f < next;
        const done = f >= next;
        const pop = sp(f, s.at, 11, 0.6);
        return (
          <div
            key={s.n}
            style={{
              flex: 1,
              height: 82,
              borderRadius: 41,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              background: active ? `linear-gradient(180deg, ${D.goldHi}, ${D.gold})` : done ? 'rgba(232,199,133,0.16)' : 'rgba(12,5,7,0.6)',
              border: `3px solid ${active || done ? D.gold : 'rgba(232,199,133,0.35)'}`,
              color: active ? D.bg : done ? D.gold : 'rgba(247,242,234,0.55)',
              fontFamily: H,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: 2,
              transform: `scale(${active ? 0.94 + 0.06 * Math.min(1, pop) + 0.02 * Math.exp(-((f - s.at) % 40) / 6) : 1})`,
              boxShadow: active ? '0 0 30px rgba(232,199,133,0.6)' : 'none',
            }}
          >
            <span style={{fontSize: 40}}>{done ? '✓' : s.n}</span>
            {s.t}
          </div>
        );
      })}
    </div>
  );
};

const FILE_L = 'M -38 -330 L -38 -40 C -42 40 -74 110 -68 208';
const FILE_R = 'M 38 -330 L 38 -40 C 42 40 74 110 68 208';

export const FileTool: React.FC<{d: string; p: number; f: number; hx: number}> = ({d, p, f, hx}) => {
  if (p <= 0) return null;
  const len = getLength(d);
  const tip = getPointAtLength(d, len * Math.min(p, 0.999))!;
  const vib = Math.sin(f * 2.4) * 1.6;
  return (
    <g transform={`translate(${vib} 0)`}>
      <path d={d} fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" opacity={0.35} strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - p)} filter="url(#glow)" />
      <path d={d} fill="none" stroke="#d6cfd2" strokeWidth={9} strokeLinecap="round" strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - p)} />
      {/* pemegang */}
      <rect x={hx - 14} y={-396} width={28} height={74} rx={10} fill={D.gold} stroke="#8a6a2c" strokeWidth={4} />
      <path d={`M ${hx - 14} -380 h 28 M ${hx - 14} -362 h 28 M ${hx - 14} -344 h 28`} stroke="#8a6a2c" strokeWidth={4} />
      <circle cx={tip.x} cy={tip.y} r={8} fill="#fff" opacity={0.9} />
    </g>
  );
};

const fileProg = (f: number) => {
  // kiri turun, tarik, kanan turun, tarik
  const l = ez(f, 944, 986) - ez(f, 990, 1004);
  const r = ez(f, 1004, 1040) - ez(f, 1042, 1052);
  return {l, r};
};

export const cleanState = (f: number) => ({
  chamber: ez(f, 956, 1040),
  left: ez(f, 944, 986),
  right: ez(f, 1004, 1040),
});

export const fillState = (f: number) => ({
  left: ez(f, T.seal + 2, T.seal + 38),
  right: ez(f, T.seal + 10, T.seal + 46),
  chamber: ez(f, T.seal + 48, T.seal + 72),
});

// Dalam ruang gigi: air pembasmi kuman + penutup mahkota
export const ToothInside: React.FC<{f: number}> = ({f}) => {
  const flush = ez(f, T.kill + 2, T.kill + 42);
  const flushO = f < T.kill ? 0 : 0.55 * (1 - ez(f, T.kill + 56, T.kill + 74));
  const cap = ez(f, T.seal + 70, T.seal + 82);
  return (
    <>
      {flushO > 0 ? (
        <g opacity={flushO}>
          {[CANAL_L, CANAL_R].map((d, i) => {
            const len = getLength(d);
            return (
              <path key={i} d={d} fill="none" stroke="#9fe8ff" strokeWidth={22} strokeLinecap="round" strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - flush)} />
            );
          })}
          <path d="M -88 -95 C -88 -138 -42 -150 0 -132 C 42 -150 88 -138 88 -95 C 88 -55 62 -20 40 -8 L -40 -8 C -62 -20 -88 -55 -88 -95 Z" fill="#9fe8ff" opacity={flush} />
        </g>
      ) : null}
      <BacteriaField f={f} />
      {cap > 0 ? (
        <g clipPath="url(#toothClip)">
          <rect x={-200} y={-260} width={400} height={96 * cap} fill="url(#goldFill)" opacity={0.95} />
        </g>
      ) : null}
    </>
  );
};

export const ToothTools: React.FC<{f: number}> = ({f}) => {
  const {l, r} = fileProg(f);
  return (
    <>
      <FileTool d={FILE_L} p={l} f={f} hx={-38} />
      <FileTool d={FILE_R} p={r} f={f} hx={38} />
    </>
  );
};

export const ProcedureFx: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.file, T.relief + 10, 8, 14);
  if (o <= 0) return null;
  const tf = toothTf(f);
  const top = {x: tf.x, y: tf.y - 250 * tf.s};
  const flash = interpolate(f, [T.seal + 70, T.seal + 74, T.seal + 92], [0, 0.3, 0], cl);
  return (
    <div style={{opacity: o}}>
      <Stage>
        {/* serpihan tisu rosak terbang keluar */}
        {Array.from({length: 16}, (_, i) => {
          const t0 = 958 + i * 5.5;
          const p = (f - t0) / 38;
          if (p <= 0 || p >= 1) return null;
          const ang = -90 + (random(`d${i}`) - 0.5) * 110;
          const dist = 130 + random(`e${i}`) * 220;
          const x = top.x + Math.cos((ang * Math.PI) / 180) * dist * p + (random(`f${i}`) - 0.5) * 60;
          const y = top.y + Math.sin((ang * Math.PI) / 180) * dist * p + 90 * p * p;
          return <circle key={i} cx={x} cy={y} r={11 * (1 - p * 0.5)} fill={i % 3 === 0 ? '#8fd14f' : RED} opacity={1 - p} />;
        })}
        {/* percikan emas semasa menampal */}
        {f >= T.seal && f < T.relief
          ? [0, 1, 2, 3, 4, 5].map((i) => {
              const p = ((f - T.seal - i * 9) % 40) / 40;
              const x = tf.x + (i % 2 ? 1 : -1) * (80 + i * 22) * tf.s * 0.7;
              const y = tf.y + (190 - p * 300) * tf.s;
              return <Sparkle key={i} x={x} y={y} s={0.35 * (1 - p)} o={1 - p} />;
            })
          : null}
      </Stage>
      <div style={{position: 'absolute', inset: 0, background: D.goldHi, opacity: flash, mixBlendMode: 'screen'}} />
    </div>
  );
};

// ---------- 10. SAKIT HILANG (1196 – 1294) ----------
export const ReliefScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.relief - 2, T.enjoy + 10, 8, 14);
  if (o <= 0) return null;
  const tf = toothTf(f);
  const level = 10 * (1 - ez(f, T.relief + 6, T.relief + 52));
  const bar = level / 10;
  const check = sp(f, 1246, 11, 0.6);
  return (
    <div style={{opacity: o}}>
      <Stage>
        {/* gelombang tenang */}
        {[0, 1, 2].map((i) => {
          const p = ((f - T.relief - i * 22) % 66) / 66;
          if (p < 0) return null;
          const r = 140 + p * 380;
          return <ellipse key={i} cx={tf.x} cy={tf.y - 60} rx={r * 1.1} ry={r} fill="none" stroke={D.goldHi} strokeWidth={6 * (1 - p) + 1} opacity={(1 - p) * 0.6} />;
        })}
        {[
          [tf.x - 340, tf.y - 190, 0],
          [tf.x + 350, tf.y - 60, 1],
          [tf.x - 300, tf.y + 170, 2],
        ].map(([x, y, i]) => (
          <Sparkle key={i} x={x} y={y} s={0.55 + 0.2 * Math.sin(f / 5 + i * 2)} o={ez(f, T.relief + 14, T.relief + 30)} />
        ))}
        <g transform="translate(868 650)" opacity={Math.min(1, check)}>
          <Check s={Math.min(1.05, check) * 1.15} />
        </g>
      </Stage>
      {/* meter sakit */}
      <div style={{position: 'absolute', left: 52, top: 520, width: 150, textAlign: 'center', opacity: ez(f, T.relief, T.relief + 12)}}>
        <div style={{fontFamily: H, fontWeight: 500, fontSize: 30, letterSpacing: 5, color: D.dim}}>TAHAP SAKIT</div>
        <div
          style={{
            margin: '14px auto 0',
            width: 72,
            height: 360,
            borderRadius: 36,
            border: `4px solid ${D.cream}`,
            background: 'rgba(12,5,7,0.6)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${bar * 100}%`,
              background: `linear-gradient(0deg, ${bar > 0.3 ? RED : D.gold}, ${bar > 0.3 ? '#ff7a93' : D.goldHi})`,
            }}
          />
        </div>
        <div style={{fontFamily: H, fontWeight: 700, fontSize: 88, color: bar > 0.3 ? '#ff7a93' : D.gold, lineHeight: 1.1, marginTop: 6}}>{Math.round(level)}</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 700,
          top: 745,
          width: 340,
          textAlign: 'center',
          fontFamily: H,
          fontWeight: 700,
          fontSize: 56,
          letterSpacing: 4,
          color: D.gold,
          opacity: Math.min(1, check),
          textShadow: '0 4px 20px rgba(0,0,0,0.7)',
        }}
      >
        SELESA!
      </div>
    </div>
  );
};

// ---------- 11. NIKMATI SEMULA (1294 – 1493) ----------
const SMILE_RIM = 'M 160 900 Q 540 1260 920 900';

export const EnjoyScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.enjoy - 2, T.warn + 10, 10, 12);
  if (o <= 0) return null;
  const items = [
    {x: 235, at: 1345, el: <HotMug f={f} s={0.9} />},
    {x: 540, at: 1358, el: <Burger s={0.95} />},
    {x: 845, at: 1371, el: <IceGlass f={f} s={0.9} />},
  ];
  const smile = ez(f, 1396, 1428);
  const teethIn = ez(f, 1422, 1440);
  return (
    <div style={{opacity: o}}>
      <Stage>
        {items.map((it, i) => {
          const p = sp(f, it.at, 9, 0.6);
          const bob = Math.sin((f - it.at) / 8 + i) * 8;
          return (
            <g key={i} transform={`translate(${it.x} ${770 + bob}) scale(${Math.min(1.1, p)})`} opacity={Math.min(1, p * 2)}>
              {it.el}
            </g>
          );
        })}
        {/* senyuman: dalam gelap + gigi putih + wayar emas */}
        <path d={`${SMILE_RIM} Q 540 1020 160 900 Z`} fill="#4a0818" opacity={smile} />
        <clipPath id="mouthClip">
          <path d={`${SMILE_RIM} Q 540 1020 160 900 Z`} />
        </clipPath>
        <g clipPath="url(#mouthClip)" opacity={teethIn}>
          {Array.from({length: 9}, (_, i) => {
            const t = (i + 0.5) / 9;
            const x = 160 + 760 * t;
            const y = 900 + 38 * Math.sin(Math.PI * t) * 0.9;
            return <rect key={i} x={x - 38} y={y - 6} width={76} height={74 - Math.abs(t - 0.5) * 30} rx={22} fill={D.cream} stroke="#e5d3b6" strokeWidth={3} />;
          })}
        </g>
        <Wire d={SMILE_RIM} p={smile} width={14} spark={false} />
        {smile >= 1 ? (
          <>
            <Spark x={160} y={900} s={0.6 + 0.12 * Math.sin(f / 5)} />
            <Spark x={920} y={900} s={0.6 + 0.12 * Math.cos(f / 5)} />
          </>
        ) : null}
      </Stage>
    </div>
  );
};

// ---------- 12. SERUAN (1493 – 1750) ----------
export const CtaScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.warn - 4, 9999, 8, 8);
  if (o <= 0) return null;
  const logo = sp(f, T.warn + 4, 14);
  const head = sp(f, T.cta + 4, 13, 0.7);
  const head2 = sp(f, T.cta + 14, 13, 0.7);
  const btn = sp(f, T.cta + 30, 10);
  const chips = sp(f, T.cta + 50, 14);
  const pulse = f > T.cta + 40 ? 1 + 0.04 * Math.exp(-((f - T.cta - 40) % BEAT) / 4) : 1;
  const flash = interpolate(f, [T.hit - 1, T.hit, T.hit + 14], [0, 0.6, 0], cl);
  const warnOut = interpolate(f, [T.cta - 8, T.cta], [1, 0], cl);
  const tf = toothTf(f);
  return (
    <div style={{opacity: o}}>
      <div style={{position: 'absolute', top: 170, left: 0, right: 0, textAlign: 'center', opacity: logo, transform: `scale(${0.85 + logo * 0.15})`}}>
        <Logo white height={118} />
      </div>
      {/* "Jangan tunggu" */}
      {f < T.cta ? (
        <Col top={705} gap={0}>
          <div style={{opacity: warnOut}}>
            <Slam f={f} at={T.warn + 4} size={130} out={T.cta}>Jangan</Slam>
          </div>
          <div style={{opacity: warnOut}}>
            <Slam f={f} at={T.warn + 18} size={190} color="#ff7a93" out={T.cta}>Tunggu!</Slam>
          </div>
        </Col>
      ) : null}
      {f >= T.cta ? (
        <>
          <Col top={655} gap={0}>
            <div style={{opacity: head, transform: `translateY(${(1 - head) * 40}px)`, fontFamily: H, fontWeight: 700, fontSize: 118, lineHeight: 1.02, color: D.gold, textTransform: 'uppercase'}}>
              Rawatan Akar
            </div>
            <div style={{opacity: head2, transform: `translateY(${(1 - head2) * 40}px)`, fontFamily: H, fontWeight: 700, fontSize: 142, lineHeight: 1.02, color: D.cream, textTransform: 'uppercase'}}>
              Hari Ini
            </div>
          </Col>
          <div style={{position: 'absolute', top: 975, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                background: `linear-gradient(180deg, ${D.goldHi}, ${D.gold})`,
                color: D.bg,
                borderRadius: 999,
                padding: '24px 50px',
                fontFamily: H,
                fontWeight: 700,
                fontSize: 66,
                boxShadow: `0 0 ${50 * (pulse - 1) * 25}px rgba(232,199,133,0.8), 0 20px 50px rgba(0,0,0,0.5)`,
                transform: `scale(${Math.min(1, btn) * pulse})`,
                opacity: Math.min(1, btn * 1.5),
              }}
            >
              <svg width="62" height="62" viewBox="0 0 64 64">
                <path d="M32 6 C17 6 6 17 6 31 c0 5 1.4 9.6 3.9 13.5 L6 58 l14-3.7 C23.6 56.6 27.7 57.8 32 57.8 C47 57.8 58 46.4 58 32 S47 6 32 6 Z" fill={D.bg} />
                <path d="M24 20c-1-2-2-2-3-2s-2 0-3 1-3 3-3 7 3 8 3.5 8.5S24 44 32 47c6.5 2.5 8 2 9.5 1.8s4.5-2 5-3.8.5-3.4.4-3.8-.6-.6-1.4-1l-5-2.4c-.7-.3-1.2-.4-1.7.4s-2 2.4-2.4 2.9-.9.6-1.7.2-3.3-1.2-6.2-3.8c-2.3-2-3.9-4.6-4.3-5.4s0-1.2.3-1.6l1.2-1.4c.4-.5.5-.8.8-1.4s.1-1-.1-1.4Z" fill={D.gold} />
              </svg>
              011-7027 2360
            </div>
          </div>
          <div style={{position: 'absolute', top: 1120, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16, opacity: chips, transform: `translateY(${(1 - chips) * 24}px)`}}>
            {['Jejawi · Perlis', 'Mergong · Alor Setar'].map((b) => (
              <div key={b} style={{fontFamily: H, fontWeight: 500, fontSize: 34, letterSpacing: 3, color: D.gold, border: `2px solid ${D.gold}`, borderRadius: 999, padding: '6px 24px', textTransform: 'uppercase', background: 'rgba(12,5,7,0.55)'}}>
                {b}
              </div>
            ))}
          </div>
          <div style={{position: 'absolute', top: 1448, left: 120, width: 800, textAlign: 'center', fontFamily: B, fontWeight: 600, fontSize: 25, lineHeight: 1.35, color: D.dim, opacity: chips}}>
            Tertakluk kepada pemeriksaan & penilaian doktor gigi. Hasil rawatan berbeza bagi setiap individu.
          </div>
        </>
      ) : null}
      <Stage>
        {f >= T.cta ? (
          <>
            <Sparkle x={tf.x - 190} y={tf.y - 20} s={0.55 + 0.1 * Math.sin(f / 5)} o={0.9} />
            <Sparkle x={tf.x + 190} y={tf.y + 40} s={0.45 + 0.1 * Math.cos(f / 5)} o={0.9} />
          </>
        ) : null}
      </Stage>
      <div style={{position: 'absolute', inset: 0, background: D.goldHi, opacity: flash, mixBlendMode: 'screen'}} />
    </div>
  );
};
