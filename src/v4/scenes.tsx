import React from 'react';
import {interpolate} from 'remotion';
import {B, BEAT, cl, D, ez, H, sp, Stage} from '../v2/kit';
import {Logo} from '../components/ui';
import {Kicker} from '../v3/Captions';
import {Col, Slam} from '../v3/scenes';
import {Bolt, boltPath, Check, IceGlass, Sparkle} from '../v3/props';
import {Germ, marginY, Toothbrush} from './Teeth';
import {recession, T, teethTf, toScreen, win} from './timeline';

const RED = '#e0405e';
const BLUE = '#bfe8ff';

// ---------- ikon punca (dipakai di kad & babak "ikut punca") ----------
export const BrushIcon: React.FC<{f: number}> = ({f}) => (
  <g transform={`translate(${Math.sin(f / 1.6) * 14} 10) rotate(-18)`}>
    <Toothbrush s={0.62} />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M ${-70 + i * 26} -66 l -16 -20`} stroke={RED} strokeWidth={6} strokeLinecap="round" opacity={Math.abs(Math.sin(f / 3 + i))} />
    ))}
  </g>
);

export const GermIcon: React.FC<{f: number}> = ({f}) => (
  <g>
    <circle r={64} fill={RED} opacity={0.22} />
    <Germ x={-26} y={-10} f={f} seed={1} s={1.5} />
    <Germ x={30} y={22} f={f} seed={2} s={1.2} rot={30} />
    <Germ x={22} y={-38} f={f} seed={3} s={0.9} rot={-40} />
  </g>
);

export const ClenchIcon: React.FC<{f: number}> = ({f}) => {
  const j = Math.sin(f * 2.1) * 2.5;
  return (
    <g>
      <g transform="translate(-58 -46)">
        <mask id="v4moon">
          <rect x={-40} y={-40} width={80} height={80} fill="#fff" />
          <circle cx={14} cy={-8} r={26} fill="#000" />
        </mask>
        <circle r={30} fill={D.gold} mask="url(#v4moon)" />
      </g>
      <text x={34} y={-50} fontFamily={H} fontWeight={700} fontSize={40} fill={D.cream} opacity={0.8}>
        Zz
      </text>
      {/* gigi atas & bawah dikacip */}
      <g transform={`translate(${j} 28)`}>
        <rect x={-70} y={-34} width={140} height={30} rx={8} fill={D.cream} />
        <rect x={-70} y={4} width={140} height={30} rx={8} fill={D.cream} />
        {[-35, 0, 35].map((x) => (
          <path key={x} d={`M ${x} -34 V 34`} stroke="#c9b99c" strokeWidth={4} />
        ))}
        <path d="M -92 -18 l -14 -10 M -92 18 l -14 10 M 92 -18 l 14 -10 M 92 18 l 14 10" stroke={RED} strokeWidth={6} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ---------- 0. Cermin (di belakang gigi) ----------
export const MirrorBack: React.FC<{f: number}> = ({f}) => {
  const o = win(f, 0, T.recede + 10, 1, 16);
  if (o <= 0) return null;
  const tf = teethTf(f);
  const w = 960;
  const h = 860;
  const glare = interpolate(f, [8, 70], [-500, 900], cl);
  return (
    <div
      style={{
        position: 'absolute',
        left: tf.x - w / 2,
        top: tf.y - h / 2 - 30,
        width: w,
        height: h,
        borderRadius: 60,
        opacity: o,
        overflow: 'hidden',
        border: '16px solid #cfc7c2',
        boxShadow: '0 0 0 4px #7d7470, 0 30px 80px rgba(0,0,0,0.6), inset 0 0 120px rgba(255,255,255,0.08)',
        background: 'linear-gradient(160deg, rgba(220,230,240,0.16), rgba(120,130,150,0.06) 60%, rgba(220,230,240,0.12))',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: glare,
          width: 120,
          height: 1300,
          transform: 'rotate(24deg)',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
        }}
      />
    </div>
  );
};

// ---------- 1. "Gigi makin panjang?" (0 – 176) ----------
export const MirrorScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, 0, T.recede + 4, 1, 10);
  if (o <= 0) return null;
  const q = sp(f, 43, 13);
  const no = f >= T.notGrow;
  return (
    <div style={{opacity: o}}>
      <Col top={232} gap={10}>
        <div style={{opacity: Math.min(1, q) * (1 - ez(f, T.notGrow - 6, T.notGrow)), transform: `scale(${0.8 + 0.2 * Math.min(1, q)})`, fontFamily: H, fontWeight: 700, fontSize: 96, color: D.cream, textTransform: 'uppercase', letterSpacing: 2, textShadow: '0 10px 40px rgba(0,0,0,0.7)'}}>
          Gigi makin panjang?
        </div>
      </Col>
      {no ? (
        <div style={{position: 'absolute', top: 232, left: 0, right: 0, textAlign: 'center'}}>
          <Slam f={f} at={T.notGrow} size={96} color="#ff7a93">
            Gigi tak membesar
          </Slam>
        </div>
      ) : null}
    </div>
  );
};

// pembaris "panjang" (koordinat tempatan gigi)
export const Ruler: React.FC<{f: number}> = ({f}) => {
  const o = win(f, 30, T.recede + 6, 12, 10);
  if (o <= 0) return null;
  const bot = marginY(recession(f), 1);
  const x = -480;
  return (
    <g opacity={o}>
      <path d={`M ${x} -258 V ${bot}`} stroke={D.gold} strokeWidth={8} strokeLinecap="round" />
      <path d={`M ${x - 26} -258 H ${x + 26} M ${x - 26} ${bot} H ${x + 26}`} stroke={D.gold} strokeWidth={8} strokeLinecap="round" />
      <path d={`M ${x - 18} ${bot - 22} L ${x} ${bot} L ${x + 18} ${bot - 22}`} fill="none" stroke={D.goldHi} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

// ---------- 2. Gusi menyusut (176 – 316) ----------
export const RecedeScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.recede - 4, T.causes + 4, 8, 10);
  if (o <= 0) return null;
  const root = toScreen(f, 0, 70);
  const lbl = sp(f, 292, 13);
  return (
    <div style={{opacity: o}}>
      <Col top={250} gap={14}>
        <Kicker text="SEBALIKNYA" o={sp(f, T.recede + 4, 14)} />
        <Slam f={f} at={T.shrink} size={124} color={D.gold}>
          Gusi menyusut
        </Slam>
      </Col>
      {/* label akar terdedah */}
      <Stage>
        <path
          d={`M ${root.x + 40} ${root.y} L ${root.x + 150} ${root.y + 190}`}
          stroke={D.goldHi}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="230"
          strokeDashoffset={230 * (1 - Math.min(1, lbl))}
        />
        <circle cx={root.x + 30} cy={root.y} r={14 * Math.min(1, lbl)} fill={D.goldHi} />
      </Stage>
      <div
        style={{
          position: 'absolute',
          left: root.x - 20,
          top: root.y + 196,
          fontFamily: H,
          fontWeight: 700,
          fontSize: 54,
          letterSpacing: 3,
          color: D.bg,
          background: D.goldHi,
          padding: '6px 22px',
          borderRadius: 12,
          opacity: Math.min(1, lbl),
          transform: `scale(${0.7 + 0.3 * Math.min(1, lbl)})`,
        }}
      >
        AKAR TERDEDAH
      </div>
    </div>
  );
};

// anak panah gusi turun (koordinat tempatan)
export const DownArrows: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.shrink - 6, T.causes, 8, 12);
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      {[-190, 0, 190].map((x, i) =>
        [0, 1].map((k) => {
          const p = (((f - T.shrink) / 18 + k * 0.5 + i * 0.2) % 1 + 1) % 1;
          return (
            <path
              key={`${i}${k}`}
              d={`M ${x - 26} ${80 + p * 70} l 26 22 l 26 -22`}
              fill="none"
              stroke="#fff"
              strokeWidth={9}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={Math.sin(Math.PI * p) * 0.9}
              transform={`translate(0 ${marginY(recession(f)) - 40})`}
            />
          );
        })
      )}
    </g>
  );
};

// ---------- 3. Tiga punca (316 – 536) ----------
const CAUSES = [
  {at: T.brush, until: T.disease, label: ['Berus terlalu', 'kuat'], Icon: BrushIcon},
  {at: T.disease, until: T.clench, label: ['Penyakit', 'gusi'], Icon: GermIcon},
  {at: T.clench, until: T.sens, label: ['Ketap gigi', 'waktu tidur'], Icon: ClenchIcon},
];

const CauseCard: React.FC<{f: number; i: number; active: boolean; small?: boolean}> = ({f, i, active, small}) => {
  const c = CAUSES[i];
  const s = small ? 0.62 : 1;
  return (
    <div
      style={{
        width: 300 * s,
        height: 360 * s,
        borderRadius: 32 * s,
        background: D.card,
        border: `${active ? 5 : 3}px solid ${active ? D.gold : 'rgba(232,199,133,0.35)'}`,
        boxShadow: active ? '0 0 40px rgba(232,199,133,0.45)' : '0 20px 50px rgba(0,0,0,0.5)',
        transform: `scale(${active ? 1.06 : 1})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{fontFamily: H, fontWeight: 700, fontSize: 40 * s, color: D.gold, marginTop: 14 * s}}>{i + 1}</div>
      <svg width={260 * s} height={170 * s} viewBox="-130 -85 260 170" style={{overflow: 'visible'}}>
        <c.Icon f={active || small ? f : 0} />
      </svg>
      {small ? null : (
        <div style={{fontFamily: H, fontWeight: 700, fontSize: 42, lineHeight: 1.1, color: active ? D.cream : D.dim, textTransform: 'uppercase', textAlign: 'center', marginTop: 18}}>
          {c.label[0]}
          <br />
          {c.label[1]}
        </div>
      )}
    </div>
  );
};

export const CausesScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.causes - 4, T.sens + 4, 8, 10);
  if (o <= 0) return null;
  return (
    <div style={{opacity: o}}>
      <Col top={710}>
        <Kicker text="ANTARA PUNCANYA" o={sp(f, T.causes + 6, 14)} />
      </Col>
      <div style={{position: 'absolute', top: 820, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 28}}>
        {CAUSES.map((c, i) => {
          const e = sp(f, c.at - 4, 12);
          return (
            <div key={i} style={{opacity: Math.min(1, e * 1.4), transform: `translateY(${(1 - Math.min(1, e)) * 80}px)`}}>
              <CauseCard f={f} i={i} active={f >= c.at && f < c.until} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// aksi punca di atas gigi (koordinat tempatan)
export const CauseFx: React.FC<{f: number}> = ({f}) => {
  const r = recession(f);
  const brush = win(f, T.brush - 4, T.disease + 2, 6, 8);
  const germs = win(f, T.disease, T.clench + 4, 10, 10);
  return (
    <g>
      {brush > 0 ? (
        <g opacity={brush}>
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M ${-260 + i * 170} ${marginY(r) + 10} q 30 -16 60 0`} stroke="#fff" strokeWidth={6} fill="none" opacity={Math.abs(Math.sin(f / 2 + i))} />
          ))}
          <g transform={`translate(${Math.sin(f / 1.5) * 150} ${marginY(r) - 64}) rotate(180)`}>
            <Toothbrush s={1.15} />
          </g>
        </g>
      ) : null}
      {germs > 0
        ? [-300, -120, 60, 230, 340].map((x, i) => (
            <Germ key={i} x={x} y={marginY(r, 0.8) + 30 + (i % 2) * 40} f={f} seed={i} s={1.6 * germs} rot={i * 37} />
          ))
        : null}
    </g>
  );
};

// ---------- 4. Ngilu (536 – 706) ----------
export const SensScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.sens - 4, T.fill + 4, 8, 10);
  if (o <= 0) return null;
  const glassIn = sp(f, T.cold - 6, 13, 0.7);
  const g = {x: 860 + (1 - Math.min(glassIn, 1)) * 340, y: 360};
  const root = toScreen(f, 0, 90);
  const seed = Math.floor(f / 3);
  return (
    <div style={{opacity: o}}>
      <Col top={230}>
        <Kicker text="TANDA LAIN" o={sp(f, T.sens + 50, 14)} />
      </Col>
      <div style={{position: 'absolute', top: 330, left: 70}}>
        <Slam f={f} at={T.ngilu} size={150} color={BLUE}>
          Ngilu!
        </Slam>
      </div>
      <Stage>
        {f >= T.cold + 4 ? (
          <Bolt d={boltPath(g.x - 60, g.y + 60, root.x + 40, root.y, seed, 9, 30)} color={BLUE} o={Math.min(1, glassIn) * (seed % 3 === 0 ? 1 : 0.55)} />
        ) : null}
        <g transform={`translate(${g.x} ${g.y}) rotate(${(1 - Math.min(glassIn, 1)) * 20})`} opacity={Math.min(1, glassIn)}>
          <IceGlass f={f} s={0.9} />
        </g>
      </Stage>
    </div>
  );
};

// kilat ngilu dari akar (koordinat tempatan)
export const NgiluFx: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.ngilu - 2, T.fill + 2, 4, 8);
  if (o <= 0) return null;
  const seed = Math.floor(f / 3);
  return (
    <g opacity={o}>
      {[-190, 0, 190].map((x, i) =>
        [-1, 1].map((side) => {
          const on = ((f + i * 4 + side * 3) % 12) < 8 ? 1 : 0;
          return (
            <Bolt
              key={`${i}${side}`}
              d={boltPath(x + side * 60, 70, x + side * 150, -10 + i * 10, seed + i * 3 + side, 5, 16)}
              color={i === 1 ? BLUE : '#ffffff'}
              o={on}
              w={6}
            />
          );
        })
      )}
    </g>
  );
};

// ---------- 5. "Jangan terus tampal je" (706 – 830) ----------
export const FillScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.fill - 4, T.cause + 4, 8, 10);
  if (o <= 0) return null;
  const x = sp(f, T.tampal + 12, 11, 0.6);
  return (
    <div style={{opacity: o}}>
      <Col top={240} gap={12}>
        <Kicker text="JANGAN TERUS FIKIR" o={sp(f, T.fill + 72, 14)} />
        <Slam f={f} at={T.tampal - 2} size={130}>
          Nak tampal je?
        </Slam>
      </Col>
      <Stage>
        {f >= T.tampal + 12 ? (
          <g transform={`translate(540 ${teethTf(f).y - 40}) scale(${Math.min(1.2, x)})`} opacity={Math.min(1, x * 1.5)}>
            <circle r={250} fill="none" stroke={RED} strokeWidth={34} opacity={0.9} />
            <path d="M -176 176 L 176 -176" stroke={RED} strokeWidth={34} strokeLinecap="round" opacity={0.9} />
          </g>
        ) : null}
      </Stage>
    </div>
  );
};

// tampalan pada akar terdedah (koordinat tempatan)
export const PatchFx: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.tampal - 4, T.cause + 2, 8, 8);
  if (o <= 0) return null;
  const r = recession(f);
  return (
    <g opacity={o}>
      {[-190, 0, 190].map((x, i) => {
        const p = ez(f, T.tampal - 4 + i * 4, T.tampal + 8 + i * 4);
        const h = marginY(r, i === 1 ? 1 : 0.85) - 4;
        return <rect key={i} x={x - 52} y={0} width={104} height={h * p} rx={22} fill="#d9d2c6" stroke="#fff" strokeWidth={4} opacity={0.95} />;
      })}
    </g>
  );
};

// ---------- 6. Rawatan ikut punca (830 – 942) ----------
export const CauseScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.cause - 4, T.doctor + 4, 8, 10);
  if (o <= 0) return null;
  return (
    <div style={{opacity: o}}>
      <Col top={700} gap={10}>
        <Kicker text="RAWATAN BERGANTUNG PADA" o={sp(f, T.cause + 10, 14)} />
        <Slam f={f} at={T.punca} size={176} color={D.gold}>
          Punca
        </Slam>
      </Col>
      <div style={{position: 'absolute', top: 1000, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 40}}>
        {[0, 1, 2].map((i) => {
          const e = sp(f, T.punca + 8 + i * 5, 12);
          return (
            <div key={i} style={{opacity: Math.min(1, e * 1.4), transform: `translateY(${(1 - Math.min(1, e)) * 60}px)`}}>
              <CauseCard f={f} i={i} active={false} small />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- 7. Jumpa doktor gigi (942 – 1115) ----------
const CHECKS = ['Kenal pasti punca', 'Nasihat doktor gigi', 'Rawatan yang sesuai'];

export const DoctorScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.doctor - 4, T.cta + 4, 8, 10);
  if (o <= 0) return null;
  return (
    <div style={{opacity: o}}>
      <Col top={232} gap={12}>
        <Kicker text="JALAN PALING SELAMAT" o={sp(f, 966, 14)} />
        <Slam f={f} at={T.check} size={104} color={D.gold}>
          Jumpa doktor gigi
        </Slam>
      </Col>
      <div
        style={{
          position: 'absolute',
          top: 1010,
          left: 190,
          width: 700,
          padding: '26px 40px',
          borderRadius: 30,
          background: D.card,
          border: `3px solid rgba(232,199,133,0.5)`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          opacity: Math.min(1, sp(f, 1003, 14) * 1.4),
          transform: `translateY(${(1 - Math.min(1, sp(f, 1003, 14))) * 60}px)`,
        }}
      >
        {CHECKS.map((c, i) => {
          const at = 1060 + i * 14;
          const e = sp(f, at, 12);
          return (
            <div key={c} style={{display: 'flex', alignItems: 'center', gap: 24, height: 62}}>
              <svg width={52} height={52} viewBox="-70 -70 140 140" style={{opacity: Math.min(1, e), transform: `scale(${Math.min(1.1, e)})`}}>
                <Check />
              </svg>
              <div style={{fontFamily: B, fontWeight: 700, fontSize: 40, color: f >= at ? D.cream : D.dim}}>{c}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// kanta pembesar memeriksa gusi (koordinat tempatan)
export const LensFx: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.check - 10, T.cta, 10, 10);
  if (o <= 0) return null;
  const x = interpolate(f, [T.check - 10, T.cta], [-320, 320], cl);
  return (
    <g opacity={o} transform={`translate(${x} ${80 + Math.sin(f / 9) * 20})`}>
      <circle r={120} fill="rgba(191,232,255,0.16)" stroke={D.gold} strokeWidth={16} />
      <path d="M -70 -60 A 92 92 0 0 1 10 -100" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.7} />
      <path d="M 86 86 L 190 190" stroke={D.gold} strokeWidth={34} strokeLinecap="round" />
    </g>
  );
};

// ---------- 8. CTA (1115 – akhir) ----------
export const CtaScene: React.FC<{f: number}> = ({f}) => {
  const o = win(f, T.cta - 4, 9999, 8, 8);
  if (o <= 0) return null;
  const logo = sp(f, T.cta + 4, 14);
  const head = sp(f, T.cta + 20, 13, 0.7);
  const head2 = sp(f, T.cta + 60, 13, 0.7);
  const btn = sp(f, T.cta + 76, 10);
  const chips = sp(f, T.cta + 90, 14);
  const pulse = f > T.cta + 86 ? 1 + 0.04 * Math.exp(-((f - T.cta - 86) % BEAT) / 4) : 1;
  const flash = interpolate(f, [T.hit - 1, T.hit, T.hit + 14], [0, 0.6, 0], cl);
  const tf = teethTf(f);
  return (
    <div style={{opacity: o}}>
      <div style={{position: 'absolute', top: 170, left: 0, right: 0, textAlign: 'center', opacity: logo, transform: `scale(${0.85 + logo * 0.15})`}}>
        <Logo white height={118} />
      </div>
      <Col top={655} gap={0}>
        <div style={{opacity: head, transform: `translateY(${(1 - head) * 40}px)`, fontFamily: H, fontWeight: 700, fontSize: 124, lineHeight: 1.02, color: D.gold, textTransform: 'uppercase'}}>
          Jaga gusi anda
        </div>
        <div style={{opacity: head2, transform: `translateY(${(1 - head2) * 40}px)`, fontFamily: H, fontWeight: 700, fontSize: 132, lineHeight: 1.02, color: D.cream, textTransform: 'uppercase'}}>
          Dari sekarang
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
        Maklumat umum sahaja. Rawatan bergantung kepada pemeriksaan & penilaian doktor gigi.
      </div>
      <Stage>
        <Sparkle x={tf.x - 230} y={tf.y - 40} s={0.5 + 0.1 * Math.sin(f / 5)} o={0.9 * logo} />
        <Sparkle x={tf.x + 230} y={tf.y + 20} s={0.42 + 0.1 * Math.cos(f / 5)} o={0.9 * logo} />
      </Stage>
      <div style={{position: 'absolute', inset: 0, background: D.goldHi, opacity: flash, mixBlendMode: 'screen'}} />
    </div>
  );
};
