import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Backdrop, cl, D, ez, H, B, sp, Tag} from '../v2/kit';
import {Logo} from '../components/ui';
import {BridgeIcon, ChewIcon, DentureIcon, ImplantIcon, ShiftIcon, TiltIcon, Tooth, WaIcon} from './art';
import {END_LEN, HOOK_END, KESAN, RAWATAN} from './timeline';

// ---------- 1. Hook: menutup kotak merah asal dengan versi beranimasi ----------
// Kotak asal: x 84–994, y 389–605. Kad ini sentiasa lebih besar daripadanya.
export const HookCard: React.FC<{f: number}> = ({f}) => {
  const out = ez(f, HOOK_END, HOOK_END + 9);
  if (out >= 1) return null;
  const w1 = sp(f, 0, 11);
  const w2 = sp(f, 16, 9);
  const shake = f > 16 && f < 34 ? Math.sin(f * 2.6) * 7 * Math.exp(-(f - 16) / 8) : 0;
  const tooth = sp(f, 6, 8);
  const gapBlink = 0.55 + 0.45 * Math.sin(f / 4);

  return (
    <div
      style={{
        position: 'absolute',
        left: 26,
        right: 26,
        top: 328,
        height: 336,
        transform: `translateY(${-out * 420}px) rotate(${-1.5 + shake * 0.15}deg) scale(${1 + (1 - Math.min(w1, 1)) * 0.06})`,
        opacity: 1 - out,
        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.45))',
      }}
    >
      <div
        style={{
          height: 196,
          background: `linear-gradient(180deg, ${D.crimson}, #9d1234)`,
          borderRadius: '28px 28px 0 0',
          border: `4px solid ${D.gold}`,
          borderBottom: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          whiteSpace: 'nowrap',
          fontFamily: H,
          fontWeight: 700,
          fontSize: 112,
          color: D.cream,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        <span style={{transform: `translateY(${(1 - Math.min(w1, 1)) * 40}px)`}}>Hilang</span>
        {/* baris gigi dengan satu ruang kosong berkelip */}
        <svg width={150} height={108} viewBox="0 0 180 130" style={{transform: `scale(${tooth})`}}>
          <rect x={4} y={6} width={172} height={24} rx={12} fill="#f2a3b4" />
          {[24, 68, 156].map((x) => (
            <Tooth key={x} x={x} y={30} s={0.4} />
          ))}
          <rect x={92} y={34} width={40} height={78} rx={14} fill="none" stroke={D.goldHi} strokeWidth={5} strokeDasharray="10 8" opacity={gapBlink} />
        </svg>
        <span style={{color: D.goldHi, transform: `translateY(${(1 - Math.min(w1, 1)) * 40}px)`}}>1 gigi?</span>
      </div>
      <div
        style={{
          height: 140,
          background: `linear-gradient(180deg, ${D.goldHi}, ${D.gold})`,
          borderRadius: '0 0 28px 28px',
          border: `4px solid ${D.gold}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: H,
          fontWeight: 700,
          fontSize: 88,
          whiteSpace: 'nowrap',
          color: D.bg,
          textTransform: 'uppercase',
          transform: `translateX(${shake}px)`,
        }}
      >
        <span style={{opacity: Math.min(1, w2 * 1.5), transform: `scale(${1.6 - 0.6 * Math.min(w2, 1)})`, display: 'inline-block'}}>
          ⚠ Jangan ambil mudah!
        </span>
      </div>
    </div>
  );
};

// ---------- Panel kongsi untuk menggantikan slaid kelabu ----------
const PanelShell: React.FC<{f: number; len: number; children: React.ReactNode}> = ({f, len, children}) => {
  const inP = sp(f, 0, 14, 0.6);
  const flash = interpolate(f, [0, 6], [0.6, 0], cl);
  return (
    <AbsoluteFill>
      <Backdrop f={f + 500} camY={0} />
      <AbsoluteFill style={{transform: `scale(${1.08 - 0.08 * Math.min(inP, 1)})`, opacity: Math.min(1, inP * 2)}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{background: D.goldHi, opacity: flash, mixBlendMode: 'screen'}} />
      {/* bar tempoh halus di bawah panel */}
      <div style={{position: 'absolute', left: 120, right: 120, bottom: 225, height: 6, borderRadius: 3, background: 'rgba(232,199,133,0.18)'}}>
        <div style={{width: `${(f / len) * 100}%`, height: '100%', borderRadius: 3, background: D.gold}} />
      </div>
    </AbsoluteFill>
  );
};

const Heading: React.FC<{f: number; tag: string; children: React.ReactNode}> = ({f, tag, children}) => {
  const t = sp(f, 0, 14);
  const h = sp(f, 3, 12);
  return (
    <div style={{position: 'absolute', top: 210, left: 60, right: 60, textAlign: 'center'}}>
      <Tag text={tag} o={Math.min(1, t)} />
      <div
        style={{
          marginTop: 26,
          fontFamily: H,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1.02,
          color: D.cream,
          textTransform: 'uppercase',
          opacity: Math.min(1, h),
          transform: `translateY(${(1 - Math.min(h, 1)) * 50}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Row: React.FC<{f: number; at: number; n: number; icon: React.ReactNode; title: string; sub: string; accent: string}> = ({
  f,
  at,
  n,
  icon,
  title,
  sub,
  accent,
}) => {
  const p = sp(f, at, 11, 0.6);
  const pc = Math.min(p, 1);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        background: D.card,
        border: `3px solid ${accent}`,
        borderRadius: 30,
        padding: '22px 34px',
        opacity: pc,
        transform: `translateX(${(1 - pc) * 260}px) rotate(${(1 - pc) * 6}deg) scale(${0.9 + 0.1 * p})`,
        boxShadow: `0 0 ${30 * Math.max(0, 1.2 - (f - at) / 20)}px ${accent}`,
      }}
    >
      <div
        style={{
          width: 128,
          height: 128,
          flexShrink: 0,
          borderRadius: 64,
          background: accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <svg width={100} height={100} viewBox="0 0 100 100">
          {icon}
        </svg>
        <div
          style={{
            position: 'absolute',
            top: -10,
            left: -10,
            width: 50,
            height: 50,
            borderRadius: 25,
            background: D.goldHi,
            color: D.bg,
            fontFamily: H,
            fontWeight: 700,
            fontSize: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {n}
        </div>
      </div>
      <div>
        <div style={{fontFamily: H, fontWeight: 700, fontSize: 64, color: D.cream, textTransform: 'uppercase', lineHeight: 1.05}}>{title}</div>
        <div style={{fontFamily: B, fontWeight: 600, fontSize: 34, color: D.dim, marginTop: 6}}>{sub}</div>
      </div>
    </div>
  );
};

// ---------- 2. Kesan jika gigi hilang dibiarkan ----------
export const KesanPanel: React.FC<{f: number}> = ({f}) => {
  const [a1, a2, a3] = KESAN.items;
  const tilt = sp(f, a1, 16);
  const drift = sp(f, a2, 18);
  const warn = sp(f, a3, 10);
  const wob = f > a3 ? Math.sin((f - a3) / 2.2) * 3 * Math.exp(-(f - a3) / 25) : 0;
  const upperY = 690;
  const lowerY = 935;
  const xs = [150, 345, 540, 735, 930];

  return (
    <PanelShell f={f} len={KESAN.to - KESAN.from}>
      <Heading f={f} tag="KALAU DIBIARKAN">
        Lama-lama <span style={{color: D.gold}}>apa jadi?</span>
      </Heading>

      {/* rahang: ruang kosong di tengah, gigi jiran condong masuk, gigi bawah "naik" */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {xs.map((x, i) => {
          if (i === 2) return null;
          const lean = i === 1 ? 1 : i === 3 ? -1 : 0;
          return (
            <Tooth
              key={`u${x}`}
              x={x + lean * drift * 34}
              y={upperY}
              rot={lean * tilt * 16}
              s={1}
              stroke={lean ? D.crimson : D.gold}
              fill={lean ? '#fde9ec' : D.cream}
            />
          );
        })}
        {xs.map((x, i) => (
          <Tooth
            key={`l${x}`}
            x={x}
            y={lowerY - (i === 2 ? drift * 36 : 0)}
            up={false}
            s={0.95}
            stroke={i === 2 ? D.crimson : D.gold}
            fill={i === 2 ? '#fde9ec' : D.cream}
          />
        ))}
        <rect x={40} y={upperY - 104} width={1000} height={84} rx={40} fill="#b8425d" />
        <rect x={40} y={lowerY + 18} width={1000} height={84} rx={40} fill="#b8425d" />
        {/* ruang kosong berkelip */}
        <rect
          x={490}
          y={upperY + 2}
          width={100}
          height={100}
          rx={24}
          fill="none"
          stroke={D.goldHi}
          strokeWidth={5}
          strokeDasharray="14 10"
          opacity={0.5 + 0.5 * Math.sin(f / 4)}
        />
        {/* anak panah pergerakan */}
        <g opacity={Math.min(1, drift)} transform="translate(0 150)">
          <path d="M400 640 C 440 610, 470 610, 490 640" fill="none" stroke={D.goldHi} strokeWidth={8} strokeLinecap="round" />
          <path d="M480 624 L 492 642 L 472 648" fill="none" stroke={D.goldHi} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M680 640 C 640 610, 610 610, 590 640" fill="none" stroke={D.goldHi} strokeWidth={8} strokeLinecap="round" />
          <path d="M600 624 L 588 642 L 608 648" fill="none" stroke={D.goldHi} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>

      <div
        style={{position: 'absolute', top: 1085, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 24, transform: `rotate(${wob * 0.3}deg)`}}
      >
        <Row f={f} at={a1} n={1} icon={<TiltIcon />} title="Gigi senget" sub="Jiran condong ke ruang kosong" accent={D.crimson} />
        <Row f={f} at={a2} n={2} icon={<ShiftIcon />} title="Gigi sebelah bergerak" sub="Susunan gigi berubah" accent={D.crimson} />
        <Row f={f} at={a3} n={3} icon={<ChewIcon />} title="Susah nak kunyah" sub="Makan jadi tak selesa" accent={D.crimson} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 470,
          right: 70,
          fontFamily: H,
          fontWeight: 700,
          fontSize: 44,
          color: D.bg,
          background: D.goldHi,
          padding: '6px 22px',
          borderRadius: 12,
          transform: `rotate(6deg) scale(${warn})`,
        }}
      >
        ⚠ MAKIN RUMIT
      </div>
    </PanelShell>
  );
};

// ---------- 3. Pilihan rawatan ----------
export const RawatanPanel: React.FC<{f: number}> = ({f}) => {
  const [b1, b2, b3] = RAWATAN.items;
  const cards = [
    {at: b1, icon: <BridgeIcon />, title: 'Bridge', sub: 'Gigi palsu tetap, disokong gigi sebelah'},
    {at: b2, icon: <ImplantLike />, title: 'Dental implant', sub: 'Skru titanium sebagai akar gigi baharu'},
    {at: b3, icon: <DentureIcon />, title: 'Denture', sub: 'Gigi palsu yang boleh ditanggalkan'},
  ];
  return (
    <PanelShell f={f} len={RAWATAN.to - RAWATAN.from}>
      <Heading f={f - RAWATAN.title} tag="CONTOHNYA">
        Cara <span style={{color: D.gold}}>isi ruang</span> gigi
      </Heading>
      <div style={{position: 'absolute', top: 560, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 34}}>
        {cards.map((c, i) => {
          const p = sp(f, c.at, 10, 0.6);
          const pc = Math.min(p, 1);
          const glow = Math.max(0, 1.3 - (f - c.at) / 18);
          return (
            <div
              key={c.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 34,
                background: D.card,
                border: `3px solid ${D.gold}`,
                borderRadius: 34,
                padding: '26px 36px',
                opacity: pc,
                transform: `translateY(${(1 - pc) * 120}px) scale(${0.85 + 0.15 * p})`,
                boxShadow: `0 0 ${40 * glow}px rgba(232,199,133,0.9), 0 18px 40px rgba(0,0,0,0.4)`,
              }}
            >
              <div
                style={{
                  width: 210,
                  height: 210,
                  flexShrink: 0,
                  borderRadius: 30,
                  background: 'radial-gradient(circle at 50% 40%, rgba(232,199,133,0.28), rgba(232,199,133,0.05))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width={190} height={190} viewBox="0 0 200 200" style={{transform: `rotate(${(1 - pc) * -20}deg)`}}>
                  {c.icon}
                </svg>
              </div>
              <div>
                <div style={{fontFamily: H, fontWeight: 500, fontSize: 34, letterSpacing: 6, color: D.gold}}>PILIHAN {i + 1}</div>
                <div style={{fontFamily: H, fontWeight: 700, fontSize: 78, color: D.cream, textTransform: 'uppercase', lineHeight: 1.05}}>{c.title}</div>
                <div style={{fontFamily: B, fontWeight: 600, fontSize: 33, color: D.dim, marginTop: 6, lineHeight: 1.25}}>{c.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1500,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: B,
          fontWeight: 600,
          fontSize: 34,
          color: D.cream,
          opacity: ez(f, b3 + 8, b3 + 18),
        }}
      >
        Doktor akan cadangkan pilihan yang sesuai selepas pemeriksaan
      </div>
    </PanelShell>
  );
};

const ImplantLike: React.FC = () => (
  <g transform="translate(10 4) scale(0.9)">
    <ImplantIcon />
  </g>
);

// ---------- 4. Lower-third ketika doktor mengajak datang check ----------
export const CtaLowerThird: React.FC<{f: number}> = ({f}) => {
  const p = sp(f, 8, 13);
  const pc = Math.min(p, 1);
  const pulse = 1 + 0.03 * Math.sin(f / 5);
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 1440,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        background: D.card,
        border: `3px solid ${D.gold}`,
        borderRadius: 999,
        padding: '16px 34px 16px 18px',
        opacity: pc,
        transform: `translateY(${(1 - pc) * 200}px) scale(${pulse})`,
        boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
      }}
    >
      <div style={{borderRadius: 999, background: D.gold, padding: 12, display: 'flex'}}>
        <WaIcon size={62} bg={D.bg} fg={D.gold} />
      </div>
      <div>
        <div style={{fontFamily: H, fontWeight: 700, fontSize: 50, color: D.cream, lineHeight: 1}}>011-7027 2360</div>
        <div style={{fontFamily: B, fontWeight: 600, fontSize: 28, color: D.gold, marginTop: 6}}>Izznara · Jejawi & Mergong</div>
      </div>
    </div>
  );
};

// ---------- 5. Kad penutup ----------
export const END_HIT3 = 90;
export const EndCard: React.FC<{f: number}> = ({f}) => {
  const logo = sp(f, 4, 14);
  const head = sp(f, 12, 13);
  const btn = sp(f, 30, 10);
  const info = sp(f, 44, 14);
  const send = sp(f, 58, 11);
  const pulse = f > 40 ? 1 + 0.035 * Math.max(0, Math.sin(f / 4)) : 1;
  const flash = interpolate(f, [END_HIT3 - 1, END_HIT3, END_HIT3 + 12], [0, 0.55, 0], cl);
  const inFlash = interpolate(f, [0, 8], [0.8, 0], cl);
  const fade = interpolate(f, [END_LEN - 12, END_LEN], [1, 0.85], cl);

  return (
    <AbsoluteFill style={{opacity: fade}}>
      <Backdrop f={f + 1100} camY={0} />
      <div style={{position: 'absolute', top: 230, left: 0, right: 0, textAlign: 'center', opacity: Math.min(1, logo), transform: `scale(${0.8 + 0.2 * Math.min(logo, 1)})`}}>
        <Logo white height={150} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 470,
          left: 90,
          right: 90,
          textAlign: 'center',
          fontFamily: H,
          fontWeight: 700,
          fontSize: 106,
          lineHeight: 1.02,
          color: D.cream,
          textTransform: 'uppercase',
          opacity: Math.min(1, head),
          transform: `translateY(${(1 - Math.min(head, 1)) * 50}px)`,
        }}
      >
        Isi ruang gigi <span style={{color: D.gold}}>sebelum jadi rumit</span>
      </div>
      <div style={{position: 'absolute', top: 820, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16, opacity: Math.min(1, head)}}>
        {['Bridge', 'Implant', 'Denture'].map((t) => (
          <div key={t} style={{fontFamily: H, fontWeight: 500, fontSize: 38, letterSpacing: 3, color: D.gold, border: `2px solid ${D.gold}`, borderRadius: 999, padding: '8px 28px', textTransform: 'uppercase'}}>
            {t}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: 960, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            background: `linear-gradient(180deg, ${D.goldHi}, ${D.gold})`,
            color: D.bg,
            borderRadius: 999,
            padding: '26px 52px',
            fontFamily: H,
            fontWeight: 700,
            fontSize: 70,
            boxShadow: `0 0 ${(pulse - 1) * 1400}px rgba(232,199,133,0.8), 0 20px 50px rgba(0,0,0,0.5)`,
            transform: `scale(${btn * pulse})`,
          }}
        >
          <WaIcon size={68} />
          011-7027 2360
        </div>
      </div>
      <div style={{position: 'absolute', top: 1130, left: 0, right: 0, textAlign: 'center', opacity: Math.min(1, info), transform: `translateY(${(1 - Math.min(info, 1)) * 30}px)`}}>
        <div style={{fontFamily: B, fontWeight: 700, fontSize: 42, color: D.cream}}>WhatsApp untuk konsultasi gigi hilang</div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 18, marginTop: 26}}>
          {['Jejawi · Perlis', 'Mergong · Alor Setar'].map((b) => (
            <div key={b} style={{fontFamily: H, fontWeight: 500, fontSize: 36, letterSpacing: 3, color: D.cream, background: 'rgba(192,26,66,0.55)', borderRadius: 999, padding: '8px 26px', textTransform: 'uppercase'}}>
              📍 {b}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1370,
          left: 60,
          right: 60,
          textAlign: 'center',
          background: D.crimson,
          border: `3px solid ${D.gold}`,
          borderRadius: 24,
          padding: '20px 26px 22px',
          boxShadow: `0 0 ${30 + 20 * Math.sin(f / 6)}px rgba(192,26,66,0.7)`,
          opacity: Math.min(1, send),
          transform: `translateY(${(1 - Math.min(send, 1)) * 120}px)`,
        }}
      >
        <div style={{fontFamily: H, fontWeight: 700, fontSize: 54, lineHeight: 1.1, color: D.cream, textTransform: 'uppercase'}}>
          Tekan <span style={{color: D.goldHi, background: 'rgba(0,0,0,0.25)', padding: '0 12px', borderRadius: 8}}>Send Message</span> di bawah
        </div>
        <div style={{fontFamily: B, fontWeight: 700, fontSize: 34, color: D.cream, marginTop: 8}}>untuk tempah slot pemeriksaan</div>
      </div>
      <div style={{position: 'absolute', top: 1590 + Math.abs(Math.sin(f / 5)) * 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 180, opacity: ez(f, 66, 76)}}>
        {[0, 1, 2].map((i) => (
          <svg key={i} width="70" height="80" viewBox="0 0 70 80">
            <path d="M8 8 L35 35 L62 8 M8 42 L35 69 L62 42" fill="none" stroke={D.gold} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ))}
      </div>
      <AbsoluteFill style={{background: D.goldHi, opacity: Math.max(flash, inFlash), mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};
