import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, random, Sequence, staticFile} from 'remotion';
import {Logo} from '../components/ui';
import {BridgeIcon, ChewIcon, DentureIcon, ImplantIcon, ShiftIcon, TiltIcon, Tooth, WaIcon} from '../v3/art';
import {CHUNKS} from '../v3/captions';
import {DOCTOR, END_LEN, HOOK_END, INSERTS, KESAN, RAWATAN} from '../v3/timeline';
import {bounce, clF, FUN, outline, P, PanelBackdrop, POP, stickerBox, ToothBuddy} from './kitF';

const SRC = 'ref/hilang-gigi-asal.mp4';
const KEY_COLORS = [P.pink, P.cyan, P.lime, P.orange, P.yellow, P.purple];

// ---------- Hook ----------
export const HookF: React.FC<{f: number}> = ({f}) => {
  const out = interpolate(f, [HOOK_END - 4, HOOK_END + 6], [0, 1], clF);
  if (out >= 1) return null;
  const b1 = bounce(f, 0);
  const b2 = bounce(f, 14, 8);
  const bud = bounce(f, 6, 7);
  const wig = Math.sin(f / 3) * 3;
  return (
    <div style={{position: 'absolute', top: 250, left: 0, right: 0, transform: `translateY(${-out * 700}px)`}}>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            ...stickerBox(P.yellow, 34, 12),
            padding: '18px 44px 6px',
            fontFamily: FUN,
            fontSize: 122,
            lineHeight: 1,
            color: P.pink,
            ...outline(0, 0),
            textShadow: `6px 6px 0 ${P.ink}`,
            transform: `rotate(${-4 + wig * 0.3}deg) scale(${b1})`,
            whiteSpace: 'nowrap',
          }}
        >
          Hilang <span style={{color: P.purple}}>1</span> gigi?
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 26}}>
        <div
          style={{
            ...stickerBox(P.pink, 26, 10),
            padding: '14px 36px 4px',
            fontFamily: FUN,
            fontSize: 72,
            lineHeight: 1,
            color: P.white,
            textShadow: `4px 4px 0 ${P.ink}`,
            transform: `rotate(${3 - wig * 0.3}deg) scale(${b2})`,
            whiteSpace: 'nowrap',
          }}
        >
          Jangan ambil mudah!
        </div>
      </div>
      <div style={{position: 'absolute', right: 30, top: -150, transform: `rotate(${12 + wig}deg) scale(${bud})`}}>
        <ToothBuddy size={170} mood="shock" f={f} gap />
      </div>
    </div>
  );
};

// ---------- Rangka panel ----------
const PanelF: React.FC<{f: number; s: number; children: React.ReactNode}> = ({f, s, children}) => {
  // wipe jalur berwarna masuk
  const stripes = [P.yellow, P.pink, P.cyan, P.lime];
  return (
    <AbsoluteFill>
      <PanelBackdrop f={f} s={s} />
      {children}
      {stripes.map((c, i) => {
        const x = interpolate(f, [i * 1.5, 8 + i * 1.5], [0, 1250], clF);
        return x < 1250 ? (
          <div key={i} style={{position: 'absolute', top: -200, bottom: -200, left: -300 + x, width: 260, background: c, transform: 'skewX(-14deg)', borderLeft: `8px solid ${P.ink}`, borderRight: `8px solid ${P.ink}`}} />
        ) : null;
      })}
    </AbsoluteFill>
  );
};

const TitleF: React.FC<{f: number; tag: string; tagColor: string; children: React.ReactNode}> = ({f, tag, tagColor, children}) => {
  const t = bounce(f, 4);
  const h = bounce(f, 8);
  return (
    <div style={{position: 'absolute', top: 190, left: 40, right: 40, textAlign: 'center'}}>
      <div style={{display: 'inline-block', ...stickerBox(tagColor, 999, 6), padding: '8px 30px 2px', fontFamily: FUN, fontSize: 44, color: P.ink, transform: `rotate(-3deg) scale(${t})`}}>
        {tag}
      </div>
      <div style={{marginTop: 22, fontFamily: FUN, fontSize: 116, lineHeight: 1, color: P.white, ...outline(14, 10), transform: `scale(${h}) rotate(${(1 - Math.min(h, 1)) * 8}deg)`}}>
        {children}
      </div>
    </div>
  );
};

const RowF: React.FC<{f: number; at: number; n: number; icon: React.ReactNode; title: string; sub: string; color: string; tilt: number}> = ({f, at, n, icon, title, sub, color, tilt}) => {
  const p = bounce(f, at, 8);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 26, ...stickerBox(P.white, 30, 10), padding: '18px 28px', transform: `translateX(${(1 - Math.min(p, 1)) * 700}px) rotate(${tilt}deg) scale(${0.85 + 0.15 * p})`}}>
      <div style={{width: 124, height: 124, flexShrink: 0, borderRadius: 62, background: color, border: `6px solid ${P.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
        <svg width={96} height={96} viewBox="0 0 100 100">
          {icon}
        </svg>
        <div style={{position: 'absolute', top: -14, left: -14, width: 52, height: 52, borderRadius: 26, background: P.yellow, border: `5px solid ${P.ink}`, fontFamily: FUN, fontSize: 34, color: P.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 4}}>{n}</div>
      </div>
      <div>
        <div style={{fontFamily: FUN, fontSize: 60, color: P.ink, lineHeight: 1}}>{title}</div>
        <div style={{fontFamily: POP, fontWeight: 700, fontSize: 32, color: '#4b3a66', marginTop: 6}}>{sub}</div>
      </div>
    </div>
  );
};

// ---------- Kesan ----------
export const KesanF: React.FC<{f: number}> = ({f}) => {
  const [a1, a2, a3] = KESAN.items;
  const tilt = bounce(f, a1, 12);
  const drift = bounce(f, a2, 14);
  const sad = bounce(f, a3, 8);
  const upperY = 690;
  const lowerY = 935;
  const xs = [150, 345, 540, 735, 930];
  return (
    <PanelF f={f} s={3}>
      <TitleF f={f} tag="Kalau dibiarkan..." tagColor={P.yellow}>
        Lama-lama <span style={{color: P.yellow}}>apa jadi?</span>
      </TitleF>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <rect x={30} y={upperY - 125} width={1020} height={460} rx={60} fill={P.white} stroke={P.ink} strokeWidth={7} />
        {xs.map((x, i) => {
          if (i === 2) return null;
          const lean = i === 1 ? 1 : i === 3 ? -1 : 0;
          return <Tooth key={`u${x}`} x={x + lean * drift * 34} y={upperY} rot={lean * tilt * 16} fill={lean ? '#ffe0ef' : P.white} stroke={P.ink} />;
        })}
        {xs.map((x, i) => (
          <Tooth key={`l${x}`} x={x} y={lowerY - (i === 2 ? drift * 36 : 0)} up={false} s={0.95} fill={i === 2 ? '#ffe0ef' : P.white} stroke={P.ink} />
        ))}
        <rect x={40} y={upperY - 108} width={1000} height={88} rx={44} fill={P.pink} stroke={P.ink} strokeWidth={6} />
        <rect x={40} y={lowerY + 18} width={1000} height={88} rx={44} fill={P.pink} stroke={P.ink} strokeWidth={6} />
        <rect x={490} y={upperY + 2} width={100} height={100} rx={24} fill="none" stroke={P.purple} strokeWidth={7} strokeDasharray="14 10" opacity={0.5 + 0.5 * Math.sin(f / 4)} />
        <g opacity={Math.min(1, drift)} transform="translate(0 150)">
          {['M400 640 C 440 610, 470 610, 490 640', 'M480 624 L 492 642 L 472 648', 'M680 640 C 640 610, 610 610, 590 640', 'M600 624 L 588 642 L 608 648'].map((d) => (
            <path key={d} d={d} fill="none" stroke={P.orange} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>
      </svg>
      <div style={{position: 'absolute', top: 1090, left: 60, right: 60, display: 'flex', flexDirection: 'column', gap: 26}}>
        <RowF f={f} at={a1} n={1} icon={<TiltIcon />} title="Gigi senget" sub="Jiran condong ke ruang kosong" color={P.pink} tilt={-1.5} />
        <RowF f={f} at={a2} n={2} icon={<ShiftIcon />} title="Gigi sebelah bergerak" sub="Susunan gigi berubah" color={P.purple} tilt={1.2} />
        <RowF f={f} at={a3} n={3} icon={<ChewIcon />} title="Susah nak kunyah" sub="Makan jadi tak selesa" color={P.orange} tilt={-1} />
      </div>
      <div style={{position: 'absolute', top: 1660, right: 60, transform: `scale(${sad}) rotate(${Math.sin(f / 4) * 6}deg)`}}>
        <ToothBuddy size={150} mood="sad" f={f} />
      </div>
    </PanelF>
  );
};

// ---------- Rawatan ----------
const ImplantLike: React.FC = () => (
  <g transform="translate(10 4) scale(0.9)">
    <ImplantIcon />
  </g>
);

export const RawatanF: React.FC<{f: number}> = ({f}) => {
  const [b1, b2, b3] = RAWATAN.items;
  const cards = [
    {at: b1, icon: <BridgeIcon />, title: 'Bridge', sub: 'Gigi palsu tetap, disokong gigi sebelah', c: P.cyan, r: -2},
    {at: b2, icon: <ImplantLike />, title: 'Dental implant', sub: 'Skru titanium sebagai akar gigi baharu', c: P.lime, r: 1.5},
    {at: b3, icon: <DentureIcon />, title: 'Denture', sub: 'Gigi palsu yang boleh ditanggalkan', c: P.yellow, r: -1.5},
  ];
  const happy = bounce(f, b3 + 6, 8);
  return (
    <PanelF f={f} s={1}>
      <TitleF f={f - RAWATAN.title} tag="Contohnya" tagColor={P.lime}>
        Cara <span style={{color: P.yellow}}>isi ruang</span> gigi
      </TitleF>
      <div style={{position: 'absolute', top: 570, left: 60, right: 60, display: 'flex', flexDirection: 'column', gap: 36}}>
        {cards.map((c, i) => {
          const p = bounce(f, c.at, 8);
          return (
            <div key={c.title} style={{display: 'flex', alignItems: 'center', gap: 30, ...stickerBox(c.c, 34, 12), padding: '22px 30px', transform: `scale(${p}) rotate(${c.r + (1 - Math.min(p, 1)) * 12}deg)`}}>
              <div style={{width: 200, height: 200, flexShrink: 0, borderRadius: 28, background: P.white, border: `6px solid ${P.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width={176} height={176} viewBox="0 0 200 200">
                  {c.icon}
                </svg>
              </div>
              <div>
                <div style={{display: 'inline-block', background: P.ink, color: P.white, fontFamily: FUN, fontSize: 30, padding: '4px 16px 0', borderRadius: 10}}>Pilihan {i + 1}</div>
                <div style={{fontFamily: FUN, fontSize: 76, color: P.ink, lineHeight: 1, marginTop: 8}}>{c.title}</div>
                <div style={{fontFamily: POP, fontWeight: 700, fontSize: 31, color: P.ink, marginTop: 6, lineHeight: 1.25}}>{c.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1540, left: 70, right: 230, ...stickerBox(P.white, 24, 8), padding: '16px 24px', fontFamily: POP, fontWeight: 800, fontSize: 32, color: P.ink, transform: `scale(${happy}) rotate(-1deg)`}}>
        Doktor akan cadangkan pilihan yang sesuai selepas pemeriksaan
      </div>
      <div style={{position: 'absolute', top: 1500, right: 50, transform: `scale(${happy}) rotate(${Math.sin(f / 4) * 8}deg)`}}>
        <ToothBuddy size={150} mood="happy" f={f} />
      </div>
    </PanelF>
  );
};

// ---------- Kad foto close-up ----------
const CROP_Y = 60;
const CROP_H = 360;
const CS = 0.8;
export const InsertsF: React.FC<{frame: number}> = ({frame}) => (
  <>
    {INSERTS.map(([a, b], idx) => {
      if (frame < a || frame >= b) return null;
      const f = frame - a;
      const p = bounce(f, 0, 8);
      const out = interpolate(frame, [b - 6, b], [0, 1], clF);
      const rot = idx % 2 ? 3 : -3;
      return (
        <div key={a} style={{position: 'absolute', top: 150, left: (1080 - 1080 * CS) / 2 - 14, transform: `scale(${Math.min(p, 1.2) * (1 - out)}) rotate(${rot + Math.sin(f / 8) * 1.2}deg)`}}>
          <div style={{...stickerBox(P.white, 20, 12), padding: 14}}>
            <div style={{width: 1080 * CS, height: CROP_H * CS, overflow: 'hidden', position: 'relative', borderRadius: 8, border: `4px solid ${P.ink}`}}>
              <div style={{position: 'absolute', left: 0, top: -CROP_Y * CS, width: 1080, height: 1920, transform: `scale(${CS})`, transformOrigin: '0 0'}}>
                <Sequence from={a} durationInFrames={b - a} layout="none">
                  <OffthreadVideo src={staticFile(SRC)} trimBefore={a} muted style={{width: 1080, height: 1920}} />
                </Sequence>
              </div>
            </div>
          </div>
          {/* pita pelekat */}
          <div style={{position: 'absolute', top: -22, left: 60, width: 170, height: 52, background: 'rgba(255,225,77,0.85)', border: `4px solid ${P.ink}`, transform: 'rotate(-8deg)'}} />
          <div style={{position: 'absolute', top: -22, right: 60, width: 170, height: 52, background: 'rgba(34,211,238,0.85)', border: `4px solid ${P.ink}`, transform: 'rotate(7deg)'}} />
        </div>
      );
    })}
  </>
);

// ---------- Klip doktor stok ----------
export const DoctorF: React.FC<{frame: number}> = ({frame}) => {
  const [a, b] = DOCTOR;
  if (frame < a || frame >= b) return null;
  const f = frame - a;
  const p = bounce(f, 0, 9);
  const s = 0.74;
  return (
    <div style={{position: 'absolute', top: 190, left: (1080 - 1080 * s) / 2 - 18, transform: `scale(${Math.min(p, 1.15)}) rotate(${2 - (1 - Math.min(p, 1)) * 10 + Math.sin(f / 10)}deg)`}}>
      <div style={{...stickerBox(P.white, 26, 16), padding: 18}}>
        <div style={{width: 1080 * s, height: 1920 * s, overflow: 'hidden', borderRadius: 12, border: `5px solid ${P.ink}`}}>
          <div style={{width: 1080, height: 1920, transform: `scale(${s})`, transformOrigin: '0 0'}}>
            <Sequence from={a} durationInFrames={b - a} layout="none">
              <OffthreadVideo src={staticFile(SRC)} trimBefore={a} muted style={{width: 1080, height: 1920}} />
            </Sequence>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', bottom: -40, left: -30, transform: `rotate(-10deg) scale(${bounce(f, 10)})`, ...stickerBox(P.yellow, 999, 8), padding: '10px 30px 2px', fontFamily: FUN, fontSize: 52, color: P.ink}}>
        Nasihat doktor 👨‍⚕️
      </div>
    </div>
  );
};

// ---------- Kapsyen pelekat ----------
const hidden = (f: number) => (f >= KESAN.from && f < KESAN.to) || (f >= RAWATAN.from && f < RAWATAN.to) || (f >= DOCTOR[0] && f < DOCTOR[1]);

export const CaptionsF: React.FC<{frame: number}> = ({frame}) => {
  if (hidden(frame)) return null;
  const idx = CHUNKS.findIndex((c, i) => {
    const next = CHUNKS[i + 1];
    const end = next ? Math.min(next[0].s, c[c.length - 1].e + 12) : c[c.length - 1].e + 12;
    return frame >= c[0].s && frame < end;
  });
  if (idx < 0) return null;
  const chunk = CHUNKS[idx];
  const pop = bounce(frame, chunk[0].s, 9);
  const tilt = (random(`cap${idx}`) - 0.5) * 6;
  return (
    <div style={{position: 'absolute', top: 1240, left: 30, right: 30, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '4px 20px', transform: `scale(${pop}) rotate(${tilt}deg)`}}>
      {chunk.map((w, i) => {
        const on = frame >= w.s;
        const active = on && frame < w.e + 2;
        const wp = bounce(frame, w.s, 8);
        const kc = KEY_COLORS[(idx + i) % KEY_COLORS.length];
        const jump = active ? -10 * Math.min(wp, 1) : 0;
        if (w.k) {
          return (
            <span key={i} style={{display: 'inline-block', ...stickerBox(kc, 18, 8), padding: '10px 20px 0', fontFamily: FUN, fontSize: 92, lineHeight: 1, color: P.white, textShadow: `4px 4px 0 ${P.ink}`, WebkitTextStroke: `3px ${P.ink}`, paintOrder: 'stroke fill', opacity: on ? 1 : 0.6, transform: `translateY(${jump}px) rotate(${on ? (i % 2 ? 4 : -4) : 0}deg) scale(${active ? 1.08 : 1})`}}>
              {w.t}
            </span>
          );
        }
        return (
          <span key={i} style={{display: 'inline-block', fontFamily: FUN, fontSize: 96, lineHeight: 1.1, color: active ? P.yellow : P.white, ...outline(14, 8), opacity: on ? 1 : 0.55, transform: `translateY(${jump}px) scale(${active ? 1.08 : 1})`}}>
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Lower-third WhatsApp ----------
export const CtaF: React.FC<{f: number}> = ({f}) => {
  const p = bounce(f, 8, 8);
  const wig = Math.sin(f / 4) * 2;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1500, display: 'flex', alignItems: 'center', gap: 20, ...stickerBox(P.wa, 999, 10), padding: '14px 32px 14px 16px', transform: `translateY(${(1 - Math.min(p, 1)) * 300}px) rotate(${wig}deg)`}}>
      <div style={{borderRadius: 999, background: P.white, border: `5px solid ${P.ink}`, padding: 8, display: 'flex'}}>
        <WaIcon size={66} bg={P.wa} fg={P.white} />
      </div>
      <div>
        <div style={{fontFamily: FUN, fontSize: 60, color: P.white, lineHeight: 1, textShadow: `4px 4px 0 ${P.ink}`}}>011-7027 2360</div>
        <div style={{fontFamily: POP, fontWeight: 800, fontSize: 28, color: P.ink, marginTop: 4}}>Izznara · Jejawi & Mergong</div>
      </div>
    </div>
  );
};

// ---------- Kad penutup ----------
export const END_HIT_F = 90;
export const EndF: React.FC<{f: number}> = ({f}) => {
  const logo = bounce(f, 4);
  const head = bounce(f, 12);
  const btn = bounce(f, 28, 7);
  const info = bounce(f, 42);
  const send = bounce(f, 56, 8);
  const pulse = 1 + 0.05 * Math.max(0, Math.sin(f / 3.5));
  const conf = f - END_HIT_F;
  return (
    <AbsoluteFill>
      <PanelBackdrop f={f} s={0} />
      <div style={{position: 'absolute', top: 190, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${logo}) rotate(-2deg)`}}>
        <div style={{...stickerBox(P.white, 999, 10), padding: '20px 50px'}}>
          <Logo height={110} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 430, left: 40, right: 40, textAlign: 'center', fontFamily: FUN, fontSize: 118, lineHeight: 1, color: P.white, ...outline(14, 10), transform: `scale(${head}) rotate(${Math.sin(f / 10) * 1.5}deg)`}}>
        Isi ruang gigi <span style={{color: P.yellow}}>sebelum jadi rumit!</span>
      </div>
      <div style={{position: 'absolute', top: 800, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18}}>
        {[
          ['Bridge', P.cyan],
          ['Implant', P.lime],
          ['Denture', P.yellow],
        ].map(([t, c], i) => (
          <div key={t} style={{...stickerBox(c, 999, 6), padding: '8px 28px 0', fontFamily: FUN, fontSize: 46, color: P.ink, transform: `rotate(${(i - 1) * 4}deg) scale(${bounce(f, 18 + i * 4)})`}}>
            {t}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: 940, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, ...stickerBox(P.wa, 999, 12), padding: '22px 50px 16px 30px', fontFamily: FUN, fontSize: 84, color: P.white, textShadow: `5px 5px 0 ${P.ink}`, transform: `scale(${Math.min(btn, 1.3) * pulse}) rotate(-2deg)`}}>
          <div style={{borderRadius: 999, background: P.white, border: `5px solid ${P.ink}`, padding: 8, display: 'flex', marginTop: -6}}>
            <WaIcon size={70} bg={P.wa} fg={P.white} />
          </div>
          011-7027 2360
        </div>
      </div>
      <div style={{position: 'absolute', top: 1140, left: 0, right: 0, textAlign: 'center', transform: `scale(${info})`}}>
        <div style={{fontFamily: POP, fontWeight: 900, fontSize: 42, color: P.white, ...outline(8, 5)}}>WhatsApp untuk konsultasi gigi hilang</div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 18, marginTop: 24}}>
          {[
            ['📍 Jejawi · Perlis', P.pink],
            ['📍 Mergong · Alor Setar', P.purple],
          ].map(([b, c], i) => (
            <div key={b} style={{...stickerBox(c, 999, 6), padding: '10px 26px', fontFamily: POP, fontWeight: 800, fontSize: 32, color: P.white, transform: `rotate(${i ? 2 : -2}deg)`}}>
              {b}
            </div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', top: 1360, left: 60, right: 60, textAlign: 'center', ...stickerBox(P.yellow, 30, 12), padding: '22px 24px 14px', transform: `scale(${send}) rotate(${1 + Math.sin(f / 5)}deg)`}}>
        <div style={{fontFamily: FUN, fontSize: 64, lineHeight: 1.05, color: P.ink}}>
          Tekan <span style={{background: P.pink, color: P.white, padding: '4px 14px 0', borderRadius: 12, border: `4px solid ${P.ink}`, display: 'inline-block'}}>Send Message</span> di bawah
        </div>
        <div style={{fontFamily: POP, fontWeight: 800, fontSize: 34, color: P.ink, marginTop: 10}}>untuk tempah slot pemeriksaan</div>
      </div>
      <div style={{position: 'absolute', top: 1610 + Math.abs(Math.sin(f / 5)) * 26, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 170, opacity: interpolate(f, [64, 72], [0, 1], clF)}}>
        {[P.pink, P.cyan, P.lime].map((c, i) => (
          <svg key={i} width="80" height="90" viewBox="0 0 80 90">
            <path d="M10 10 L40 40 L70 10 M10 48 L40 78 L70 48" fill="none" stroke={P.ink} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 10 L40 40 L70 10 M10 48 L40 78 L70 48" fill="none" stroke={c} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ))}
      </div>
      <div style={{position: 'absolute', top: 1620, left: 30, transform: `scale(${bounce(f, 70)}) rotate(${Math.sin(f / 4) * 10}deg)`}}>
        <ToothBuddy size={120} mood="happy" f={f} />
      </div>
      {/* konfeti pada hentakan penutup */}
      {conf >= 0 ? (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: 60}, (_, i) => {
            const ang = random(`ca${i}`) * Math.PI * 2;
            const v = 14 + random(`cv${i}`) * 22;
            const x = 540 + Math.cos(ang) * v * conf;
            const y = 1000 + Math.sin(ang) * v * conf + 0.9 * conf * conf;
            const c = [P.pink, P.cyan, P.lime, P.yellow, P.orange, P.purple][i % 6];
            return <rect key={i} x={x} y={y} width={22} height={12} rx={3} fill={c} stroke={P.ink} strokeWidth={2.5} transform={`rotate(${conf * 20 + i * 30} ${x + 11} ${y + 6})`} opacity={interpolate(conf, [30, 50], [1, 0], clF)} />;
          })}
        </svg>
      ) : null}
      <AbsoluteFill style={{background: P.white, opacity: interpolate(f, [0, 6], [0.8, 0], clF)}} />
      <AbsoluteFill style={{opacity: interpolate(f, [END_LEN - 10, END_LEN], [0, 0.2], clF), background: P.ink}} />
    </AbsoluteFill>
  );
};

// ---------- Bar kemajuan & logo ----------
export const ProgressF: React.FC<{frame: number; total: number}> = ({frame, total}) => (
  <div style={{position: 'absolute', top: 18, left: 30, right: 30, height: 26, borderRadius: 13, background: P.white, border: `5px solid ${P.ink}`, overflow: 'hidden'}}>
    <div
      style={{
        width: `${(frame / total) * 100}%`,
        height: '100%',
        background: `repeating-linear-gradient(-45deg, ${P.pink} 0 18px, ${P.yellow} 18px 36px)`,
        backgroundPosition: `${frame * 2}px 0`,
        borderRight: `5px solid ${P.ink}`,
      }}
    />
  </div>
);

export const LogoF: React.FC<{o: number}> = ({o}) => (
  <div style={{position: 'absolute', bottom: 90, right: 40, opacity: o, transform: 'rotate(-3deg)'}}>
    <div style={{...stickerBox(P.white, 999, 6), padding: '8px 22px'}}>
      <Logo height={46} />
    </div>
  </div>
);
