import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile} from 'remotion';
import {Arch3D} from './Arch3D';
import {C, Check, Chip, cl, ez, F, Footage, Grade, out, PearlBg, S, sp, Sparkle} from './kit';
import {Logo} from '../components/ui';

const W = 1080;

const Title: React.FC<{children: React.ReactNode; p: number; size?: number; color?: string; top: number; style?: React.CSSProperties}> = ({
  children,
  p,
  size = 96,
  color = C.ink,
  top,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: 60,
      right: 60,
      textAlign: 'center',
      fontFamily: F.head,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.02,
      letterSpacing: -2,
      color,
      opacity: Math.min(1, p * 1.5),
      transform: `translateY(${(1 - p) * 50}px)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/* 1 ─ HOOK: braces besi + getah warna-warni → "aduh" */
export const HookScene: React.FC<{f: number}> = ({f}) => {
  const aduh = 184;
  const school = 206;
  const shake = interpolate(f, [aduh, aduh + 6, aduh + 26], [0, 14, 0], cl);
  const zoom = 1.55 + ez(f, 0, 180) * 0.25;
  return (
    <AbsoluteFill>
      <PearlBg f={f} />
      <Title p={sp(f, 2)} top={190} size={64} color={C.burg} style={{letterSpacing: 6, fontWeight: 800}}>
        NAK PAKAI
      </Title>
      <Title p={sp(f, 10)} top={262} size={150}>
        BRACES?
      </Title>
      <Arch3D f={f} spin={Math.sin(f / 50) * 28} tilt={14 + ez(f, 0, 120) * 6} scale={zoom} braces={ez(f, 25, 135)} y={860} shake={shake} />
      {/* label besi & getah */}
      <div style={{position: 'absolute', top: 1060, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22}}>
        <Chip text="Besi" p={sp(f, 80)} dot="#8e98a3" size={38} />
        <Chip text="Getah warna-warni" p={sp(f, 98)} dot="#ff4f8b" size={38} />
      </div>
      {/* aduh! */}
      {f >= aduh - 2 ? (
        <div
          style={{
            position: 'absolute',
            top: 470,
            left: 640,
            fontFamily: F.hand,
            fontWeight: 700,
            fontSize: 140,
            color: C.rose,
            transform: `rotate(-10deg) scale(${sp(f, aduh - 2, 9, 0.6)})`,
            textShadow: '0 8px 0 rgba(255,255,255,0.9)',
          }}
        >
          aduh!
        </div>
      ) : null}
      {f >= school ? (
        <div
          style={{
            position: 'absolute',
            top: 1170,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '14px 34px',
              background: '#fff6c9',
              fontFamily: F.hand,
              fontWeight: 700,
              fontSize: 64,
              color: C.ink,
              boxShadow: '0 14px 30px rgba(42,7,16,0.2)',
              transform: `rotate(${-3 + (1 - sp(f, school, 10)) * 12}deg) scale(${sp(f, school, 10)})`,
            }}
          >
            macam budak sekolah?
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* 2 ─ Profesional: mengajar, pesakit, klien */
const CUTS = [
  {src: 'v4/clip-meeting.mp4', at: 0, dur: 87, start: 0.2, label: 'Mengajar depan kelas', chip: 38},
  {src: 'v4/clip-doctor.mp4', at: 87, dur: 48, start: 1.0, label: 'Jumpa pesakit', chip: 89},
  {src: 'v4/clip-client.mp4', at: 135, dur: 40, start: 0.6, label: 'Bercakap dengan klien', chip: 136},
];

export const ProsScene: React.FC<{f: number}> = ({f}) => {
  const l = f - S.pros;
  const cut = [...CUTS].reverse().find((c) => l >= c.at)!;
  const ll = l - cut.at;
  const punch = 1 + 0.06 * Math.exp(-ll / 6);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${punch})`}}>
        <Footage src={cut.src} f={ll} dur={cut.dur} start={cut.start} zoom={[1.08, 1.16]} />
      </AbsoluteFill>
      <Grade />
      {/* garis masa "hari-hari" */}
      <div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center'}}>
        <Chip text={cut.label} p={sp(f, S.pros + cut.chip - 4)} dark dot="#ff8fab" size={46} />
      </div>
      <div style={{position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16}}>
        {CUTS.map((c, i) => (
          <div
            key={i}
            style={{
              width: 90,
              height: 8,
              borderRadius: 4,
              background: l >= c.at ? '#fff' : 'rgba(255,255,255,0.3)',
              opacity: ez(l, 0, 10),
            }}
          />
        ))}
      </div>
      {/* kilat potongan */}
      <AbsoluteFill style={{background: '#fff', opacity: interpolate(ll, [0, 5], [cut.at === 0 ? 0.9 : 0.45, 0], cl)}} />
    </AbsoluteFill>
  );
};

/* 3 ─ Segan */
export const SeganScene: React.FC<{f: number}> = ({f}) => {
  const l = f - S.segan;
  const segan = 523 - S.segan;
  const jelas = 552 - S.segan;
  const sat = interpolate(l, [segan - 20, segan + 10], [1, 0.25], cl);
  const lensP = sp(l, jelas, 12);
  return (
    <AbsoluteFill>
      <Footage src="v4/clip-meeting.mp4" f={l} dur={170} start={6.5} zoom={[1.12, 1.32]} pan={[0, -30]} sat={sat} bright={1 - (1 - sat) * 0.25} />
      <Grade top={0.5} />
      <Title p={sp(l, 20)} top={190} size={52} color="#fff" style={{fontWeight: 700, letterSpacing: 2}}>
        Nak betulkan gigi, tapi...
      </Title>
      {l >= segan - 4 ? (
        <div
          style={{
            position: 'absolute',
            top: 270,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: F.head,
            fontWeight: 900,
            fontSize: 230,
            letterSpacing: -6,
            color: 'transparent',
            WebkitTextStroke: '4px #fff',
            transform: `scale(${0.7 + 0.3 * sp(l, segan - 4, 10)})`,
            opacity: Math.min(1, sp(l, segan - 4) * 1.5),
            textShadow: '0 0 40px rgba(255,143,171,0.6)',
          }}
        >
          SEGAN
        </div>
      ) : null}
      {/* kanta: braces nampak jelas */}
      {lensP > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 540 - 250,
            top: 640,
            width: 500,
            height: 500,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '10px solid #fff',
            boxShadow: '0 0 0 6px rgba(192,26,66,0.9), 0 30px 60px rgba(0,0,0,0.5)',
            background: 'radial-gradient(circle, #fff, #f4e4e3)',
            transform: `scale(${lensP})`,
          }}
        >
          <Arch3D f={l} spin={0} tilt={8} scale={1.9} braces={1} x={250} y={330} />
          <div
            style={{
              position: 'absolute',
              bottom: 52,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontFamily: F.head,
              fontWeight: 900,
              fontSize: 40,
              color: C.rose,
              letterSpacing: 4,
            }}
          >
            NAMPAK JELAS
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* 4 ─ Pendedahan: Clear Aligner 3D */
export const RevealScene: React.FC<{f: number}> = ({f}) => {
  const l = f - S.reveal;
  const kami = 623 - S.reveal;
  const title = 672 - S.reveal;
  const drop0 = 718 - S.reveal;
  const snap = 772 - S.reveal;
  const aligner = ez(l, drop0, snap);
  const ring = interpolate(l, [snap, snap + 30], [0, 1], cl);
  const shimmer = interpolate(l, [title, title + 40], [-30, 130], cl);
  return (
    <AbsoluteFill>
      <PearlBg f={f} tint={aligner} />
      <div style={{position: 'absolute', top: 175, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: sp(l, kami), transform: `translateY(${(1 - sp(l, kami)) * 30}px)`}}>
        <Logo height={96} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 310,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: F.head,
          fontWeight: 900,
          fontSize: 150,
          lineHeight: 0.95,
          letterSpacing: -5,
          backgroundImage: `linear-gradient(100deg, ${C.burg} 0%, ${C.burg} ${shimmer - 15}%, #ff9fb5 ${shimmer}%, ${C.burg} ${shimmer + 15}%, ${C.burg} 100%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          opacity: Math.min(1, sp(l, title - 4) * 1.5),
          transform: `scale(${0.85 + 0.15 * sp(l, title - 4, 11)})`,
        }}
      >
        Clear
        <br />
        Aligner
      </div>
      <Arch3D f={f} spin={-28 + l * 0.22} tilt={30} scale={1.45} aligner={aligner} y={1000} />
      {/* riak ketika aligner terpasang */}
      {ring > 0 && ring < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 540 - 460 * ring,
            top: 960 - 200 * ring,
            width: 920 * ring,
            height: 400 * ring,
            borderRadius: '50%',
            border: `${6 * (1 - ring)}px solid rgba(120,190,255,0.9)`,
            opacity: 1 - ring,
          }}
        />
      ) : null}
      {[0, 1, 2, 3, 4].map((i) => {
        const s = interpolate(l, [snap + i * 3, snap + 8 + i * 3, snap + 26 + i * 3], [0, 0.6 + random(`sk${i}`) * 0.4, 0], cl);
        return <Sparkle key={i} x={300 + random(`sx${i}`) * 480} y={820 + random(`sy${i}`) * 200} s={s} rot={l * 2} />;
      })}
      <div style={{position: 'absolute', top: 1160, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20}}>
        <Chip text="Lut sinar" p={sp(l, drop0 + 4)} dot="#5bb6ff" size={40} />
        <Chip text="Ikut bentuk gigi" p={sp(l, 762 - S.reveal)} dot={C.rose} size={40} />
      </div>
      <AbsoluteFill style={{background: '#fff', opacity: interpolate(l, [0, 10], [1, 0], cl)}} />
    </AbsoluteFill>
  );
};

/* 5 ─ Kurang ketara bila senyum & bercakap */
export const KetaraScene: React.FC<{f: number}> = ({f}) => {
  const l = f - S.ketara;
  const ketara = 878 - S.ketara;
  const meter = ez(l, ketara - 6, ketara + 16);
  return (
    <AbsoluteFill>
      <Footage src="v4/clip-client.mp4" f={l} dur={104} start={3.6} zoom={[1.18, 1.3]} />
      <Grade />
      <div style={{position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18}}>
        <Chip text="Senyum" p={sp(l, 4)} dark dot="#ffd23f" size={42} />
        <Chip text="Bercakap" p={sp(l, 42)} dark dot="#7ee081" size={42} />
      </div>
      {/* meter ketara */}
      <div
        style={{
          position: 'absolute',
          left: 160,
          right: 160,
          top: 1040,
          padding: '26px 34px',
          borderRadius: 30,
          background: 'rgba(255,255,255,0.86)',
          boxShadow: '0 24px 50px rgba(0,0,0,0.35)',
          opacity: sp(l, ketara - 14),
          transform: `translateY(${(1 - sp(l, ketara - 14)) * 60}px)`,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.head, fontWeight: 800, fontSize: 30, color: C.muted, letterSpacing: 2}}>
          <span>KETARA</span>
          <span style={{color: C.burg}}>KURANG KETARA</span>
        </div>
        <div style={{position: 'relative', marginTop: 16, height: 22, borderRadius: 11, background: 'linear-gradient(90deg,#c9ced4,#eaf6ff)'}}>
          <div
            style={{
              position: 'absolute',
              top: -11,
              left: `calc(${10 + meter * 80}% - 22px)`,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: C.burg,
              border: '5px solid #fff',
              boxShadow: '0 6px 14px rgba(102,9,32,0.5)',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 6 ─ Boleh buka: makan, berus gigi, floss (foto tangan pegang aligner) */
const Icon: React.FC<{kind: 'eat' | 'brush' | 'floss'}> = ({kind}) => (
  <svg width={86} height={86} viewBox="0 0 64 64" fill="none" stroke={C.burg} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
    {kind === 'eat' ? (
      <>
        <path d="M18 8 V28 M12 8 V22 Q12 28 18 28 Q24 28 24 22 V8 M18 28 V56" />
        <path d="M44 56 V8 Q54 14 54 30 Q54 34 44 34" />
      </>
    ) : kind === 'brush' ? (
      <>
        <path d="M8 50 L40 18" />
        <rect x="36" y="6" width="22" height="12" rx="3" transform="rotate(-45 47 12)" />
        <path d="M40 8 L36 4 M46 6 L44 2 M52 10 L52 5" />
      </>
    ) : (
      <>
        <rect x="10" y="10" width="44" height="30" rx="8" />
        <path d="M20 40 Q32 64 44 40" strokeDasharray="4 6" />
        <path d="M18 24 H46" />
      </>
    )}
  </svg>
);

export const BukaScene: React.FC<{f: number}> = ({f}) => {
  const l = f - S.buka;
  const items = [
    {k: 'eat' as const, t: 'Makan', at: 918},
    {k: 'brush' as const, t: 'Berus gigi', at: 948},
    {k: 'floss' as const, t: 'Floss', at: 978},
  ];
  const buka = 993 - S.buka;
  const z = 1.08 + l * 0.0016;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#eceae9'}}>
        <Img
          src={staticFile('v4/aligner-hand.jpg')}
          style={{
            position: 'absolute',
            width: 1080,
            height: 2000,
            objectFit: 'cover',
            objectPosition: '50% 30%',
            top: -140,
            transform: `scale(${z}) translateY(${-l * 0.4}px)`,
            transformOrigin: '50% 40%',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(251,247,244,0.95) 0%, rgba(251,247,244,0) 26%, rgba(20,4,8,0) 60%, rgba(20,4,8,0.6) 100%)'}} />
      {/* kilauan pada aligner */}
      {[0, 1, 2].map((i) => {
        const t = (l + i * 22) % 66;
        return <Sparkle key={i} x={500 + i * 70} y={800 + (i % 2) * 60 - l * 0.6} s={interpolate(t, [0, 12, 30], [0, 0.55, 0], cl)} rot={t * 3} color="#eaf6ff" />;
      })}
      <Title p={sp(l, 0)} top={150} size={88}>
        Boleh <span style={{color: C.rose}}>buka</span>
      </Title>
      <div style={{position: 'absolute', top: 1095, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 26}}>
        {items.map((it) => {
          const p = sp(f, it.at - 4, 11);
          return (
            <div
              key={it.k}
              style={{
                width: 270,
                padding: '26px 0 22px',
                borderRadius: 34,
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 20px 44px rgba(42,7,16,0.28)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                opacity: Math.min(1, p * 1.5),
                transform: `translateY(${(1 - p) * 80}px) scale(${0.7 + 0.3 * p})`,
              }}
            >
              <Icon kind={it.k} />
              <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 36, color: C.ink}}>{it.t}</div>
            </div>
          );
        })}
      </div>
      {l >= buka ? (
        <div style={{position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <Chip text="Tanggal & pakai semula" p={sp(l, buka)} dot="#5bb6ff" size={38} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* 7 ─ Pakai balik ikut jadual doktor */
export const BalikScene: React.FC<{f: number}> = ({f}) => {
  const l = f - S.balik;
  const pakai = 1030 - S.balik;
  const jadual = 1062 - S.balik;
  const lift = 1 - ez(l, pakai, pakai + 26);
  const days = ['I', 'S', 'R', 'K', 'J', 'S', 'A'];
  return (
    <AbsoluteFill>
      <PearlBg f={f} tint={0.6} />
      <Title p={sp(l, 2)} top={180} size={96}>
        Pakai <span style={{color: C.rose}}>balik</span>
      </Title>
      <Arch3D f={f} spin={25 - l * 0.4} tilt={34} scale={1.25} aligner={1} lift={lift} y={760} />
      {/* kad jadual */}
      <div
        style={{
          position: 'absolute',
          left: 110,
          right: 110,
          top: 960,
          padding: '28px 36px 34px',
          borderRadius: 36,
          background: '#fff',
          boxShadow: '0 30px 60px rgba(42,7,16,0.22)',
          opacity: sp(l, jadual - 10),
          transform: `translateY(${(1 - sp(l, jadual - 10)) * 70}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: F.head, fontWeight: 800, fontSize: 36, color: C.ink}}>
          <svg width={44} height={44} viewBox="0 0 48 48" fill="none" stroke={C.burg} strokeWidth={4}>
            <rect x={6} y={10} width={36} height={32} rx={6} />
            <path d="M6 20 H42 M16 5 V14 M32 5 V14" strokeLinecap="round" />
          </svg>
          Ikut jadual doktor
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 24}}>
          {days.map((d, i) => {
            const p = sp(l, jadual + i * 4, 12);
            return (
              <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
                <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 26, color: C.muted}}>{d}</div>
                <Check p={p} size={70} color={i === 6 ? '#5bb6ff' : C.rose} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 8 ─ Untuk siapa: cikgu, pensyarah, doktor, kerja jumpa orang */
export const RolesScene: React.FC<{f: number}> = ({f}) => {
  const l = f - S.roles;
  const panels = [
    {src: 'v4/clip-meeting.mp4', start: 3.5, at: 1128, labels: [{t: 'Cikgu', at: 1138}, {t: 'Pensyarah', at: 1168}], pos: 'center 30%'},
    {src: 'v4/clip-doctor.mp4', start: 4.5, at: 1198, labels: [{t: 'Doktor', at: 1200}]},
    {src: 'v4/clip-client.mp4', start: 1.5, at: 1236, labels: [{t: 'Jumpa orang', at: 1255}]},
  ];
  const fin = 1292;
  const finP = sp(f, fin, 14);
  const pw = 1080 / 3;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      {panels.map((p, i) => {
        const e = out(f, p.at - 8, p.at + 12);
        const lab = [...p.labels].reverse().find((x) => f >= x.at - 4);
        const focus = f < fin ? 1 : 1 - finP * 0.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: i * pw,
              top: 0,
              width: pw,
              height: 1920,
              overflow: 'hidden',
              clipPath: `inset(${(1 - e) * 100}% 0 0 0)`,
              borderLeft: i ? '3px solid rgba(255,255,255,0.9)' : undefined,
            }}
          >
            <div style={{position: 'absolute', left: -pw, top: 0, width: 1080, height: 1920, filter: `blur(${(1 - focus) * 14}px)`}}>
              <Footage src={p.src} f={f - p.at} dur={300} start={p.start} zoom={[1.05, 1.15]} />
            </div>
            <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,4,8,0.1) 40%, rgba(20,4,8,0.75))'}} />
            {lab ? (
              <div
                key={lab.t}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 1090,
                  textAlign: 'center',
                  fontFamily: F.head,
                  fontWeight: 900,
                  fontSize: lab.t.length > 8 ? 46 : 56,
                  color: '#fff',
                  letterSpacing: 1,
                  textShadow: '0 4px 18px rgba(0,0,0,0.6)',
                  opacity: Math.min(1, sp(f, lab.at - 4) * 1.5) * (f < fin ? 1 : 1 - finP),
                  transform: `translateY(${(1 - sp(f, lab.at - 4)) * 40}px)`,
                }}
              >
                {lab.t}
              </div>
            ) : null}
          </div>
        );
      })}
      <AbsoluteFill style={{background: 'rgba(20,4,8,0.35)', opacity: finP}} />
      {f >= fin - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: 90,
            right: 90,
            top: 640,
            padding: '50px 40px',
            borderRadius: 44,
            background: 'rgba(255,255,255,0.92)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.45)',
            textAlign: 'center',
            opacity: Math.min(1, finP * 1.5),
            transform: `scale(${0.8 + 0.2 * finP})`,
          }}
        >
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Check p={ez(f, fin + 8, fin + 24)} size={90} />
          </div>
          <div style={{fontFamily: F.head, fontWeight: 900, fontSize: 70, lineHeight: 1.05, color: C.ink, marginTop: 18, letterSpacing: -1.5}}>
            Satu pilihan
            <br />
            <span style={{color: C.rose}}>yang boleh dipertimbangkan</span>
          </div>
        </div>
      ) : null}
      <AbsoluteFill style={{background: '#fff', opacity: interpolate(l, [0, 8], [0.8, 0], cl)}} />
    </AbsoluteFill>
  );
};

/* 9 ─ CTA: Send Message */
export const CtaScene: React.FC<{f: number}> = ({f}) => {
  const l = f - S.cta;
  const btn = 1440 - S.cta;
  const tap = 1466 - S.cta;
  const slot = 1496 - S.cta;
  const press = interpolate(l, [tap - 3, tap, tap + 8], [1, 0.9, 1], cl);
  const ripple = interpolate(l, [tap, tap + 26], [0, 1], cl);
  const hand = out(l, tap - 26, tap - 2);
  const slots = ['Pagi', 'Tengah hari', 'Petang'];
  return (
    <AbsoluteFill>
      <PearlBg f={f} tint={0.4} />
      <Title p={sp(l, 4)} top={170} size={60} color={C.burg} style={{fontWeight: 800, letterSpacing: 1}}>
        Sesuai tak untuk
      </Title>
      <Title p={sp(l, 12)} top={240} size={120}>
        gigi anda?
      </Title>
      <Arch3D f={f} spin={Math.sin(l / 45) * 26} tilt={30} scale={1.0} aligner={1} y={640} />
      {/* butang Send Message */}
      <div style={{position: 'absolute', top: 850, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            padding: '34px 66px',
            borderRadius: 999,
            background: `linear-gradient(135deg, ${C.rose}, ${C.burg})`,
            boxShadow: `0 ${24 * press}px 50px rgba(102,9,32,0.45)`,
            fontFamily: F.head,
            fontWeight: 900,
            fontSize: 62,
            color: '#fff',
            opacity: Math.min(1, sp(l, btn - 6) * 1.5),
            transform: `scale(${(0.7 + 0.3 * sp(l, btn - 6, 10)) * press})`,
          }}
        >
          <svg width={64} height={64} viewBox="0 0 48 48">
            <path d="M5 22 L43 6 L33 42 L23 28 Z" fill="#fff" />
            <path d="M23 28 L43 6" stroke={C.burg} strokeWidth={3} />
          </svg>
          Send Message
          {ripple > 0 && ripple < 1 ? (
            <div
              style={{
                position: 'absolute',
                inset: -40 * ripple,
                borderRadius: 999,
                border: `${8 * (1 - ripple)}px solid ${C.rose}`,
                opacity: 1 - ripple,
              }}
            />
          ) : null}
        </div>
      </div>
      {/* jari menekan */}
      {hand > 0 && l < tap + 40 ? (
        <div
          style={{
            position: 'absolute',
            left: 640 + (1 - hand) * 260,
            top: 905 + (1 - hand) * 300 + (press < 1 ? 8 : 0),
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.95), rgba(255,255,255,0.55) 55%, rgba(255,255,255,0) 72%)',
            border: '4px solid rgba(255,255,255,0.95)',
            boxShadow: '0 10px 30px rgba(42,7,16,0.35)',
            opacity: interpolate(l, [tap + 20, tap + 40], [1, 0], cl),
          }}
        />
      ) : null}
      {/* semak slot konsultasi */}
      <div
        style={{
          position: 'absolute',
          left: 110,
          right: 110,
          top: 1050,
          opacity: sp(l, slot),
          transform: `translateY(${(1 - sp(l, slot)) * 50}px)`,
        }}
      >
        <div style={{textAlign: 'center', fontFamily: F.head, fontWeight: 800, fontSize: 34, color: C.ink, letterSpacing: 1}}>Kami bantu semak slot konsultasi</div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 14, marginTop: 18}}>
          {slots.map((s, i) => {
            const p = sp(l, slot + 10 + i * 6, 12);
            const pick = i === 1 && l > slot + 44;
            return (
              <div
                key={s}
                style={{
                  padding: '16px 22px',
                  borderRadius: 20,
                  background: pick ? C.burg : '#fff',
                  color: pick ? '#fff' : C.ink,
                  fontFamily: F.head,
                  fontWeight: 700,
                  fontSize: 30,
                  boxShadow: '0 12px 26px rgba(42,7,16,0.16)',
                  opacity: p,
                  transform: `scale(${0.8 + 0.2 * p})`,
                }}
              >
                {s}
              </div>
            );
          })}
        </div>
      </div>
      {/* logo & penafian di akhir */}
      <div style={{position: 'absolute', top: 1340, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, opacity: ez(l, 188, 206)}}>
        <Logo height={110} />
        <div style={{fontFamily: F.head, fontWeight: 600, fontSize: 26, color: C.muted, textAlign: 'center', lineHeight: 1.4}}>
          Jejawi, Perlis · Mergong, Alor Setar
          <br />
          Kesesuaian rawatan tertakluk kepada penilaian doktor gigi.
        </div>
      </div>
    </AbsoluteFill>
  );
};
