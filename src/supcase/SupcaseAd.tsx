import React, {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import '@fontsource/oswald/500.css';
import '@fontsource/oswald/700.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

// Iklan pendek (9:16) untuk SUPCASE Magnetic Wallet + Stand — pautan Shopee
// 120 BPM: 1 beat = 15 frame. Dua versi: penuh 23s & pendek 15s (lihat CUTS di bawah).

const FPS = 30;
const T = 8; // tempoh peralihan (frame)
const END_HIT = 90; // dalam babak CTA

const C = {
  orange: '#ee4d2d',
  orange2: '#ff7a3d',
  deep: '#b8301a',
  ink: '#121212',
  ink2: '#262220',
  cream: '#fff4ee',
  white: '#ffffff',
  yellow: '#ffd23f',
  dim: 'rgba(255,255,255,0.72)',
};
const H = 'Oswald, sans-serif';
const B = 'Inter, sans-serif';
const FONTS = ['500 40px Oswald', '700 40px Oswald', '500 40px Inter', '700 40px Inter', '800 40px Inter'];

const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sp = (f: number, at: number, damping = 12, mass = 0.6) => spring({frame: f - at, fps: FPS, config: {damping, mass}});
const ez = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {...cl, easing: Easing.bezier(0.65, 0, 0.35, 1)});
const img = (n: string) => staticFile(`supcase/${n}.jpg`);

// ---------- komponen ----------
const Pop: React.FC<{f: number; at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number}> = ({
  f,
  at,
  children,
  style,
  from = 60,
}) => {
  const s = sp(f, at);
  return (
    <div style={{...style, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * from}px) scale(${0.85 + 0.15 * s})`}}>
      {children}
    </div>
  );
};

const Photo: React.FC<{
  f: number;
  at: number;
  src: string;
  w: number;
  h: number;
  x: number;
  y: number;
  fit?: 'cover' | 'contain';
  bg?: string;
  radius?: number;
  pos?: string;
}> = ({f, at, src, w, h, x, y, fit = 'cover', bg = C.white, radius = 44, pos = 'center'}) => {
  const s = sp(f, at, 14, 0.8);
  const zoom = 1.04 + 0.06 * interpolate(f, [at, at + 120], [0, 1], cl);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        overflow: 'hidden',
        background: bg,
        boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        opacity: Math.min(1, s * 1.6),
        transform: `translateY(${(1 - s) * 140}px) scale(${0.8 + 0.2 * s}) rotate(${(1 - s) * -4}deg)`,
      }}
    >
      <Img
        src={src}
        style={{width: '100%', height: '100%', objectFit: fit, objectPosition: pos, transform: `scale(${zoom})`}}
      />
    </div>
  );
};

const Chip: React.FC<{children: React.ReactNode; dark?: boolean; size?: number}> = ({children, dark, size = 38}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      padding: `${size * 0.42}px ${size * 0.8}px`,
      borderRadius: 999,
      background: dark ? C.ink : C.white,
      color: dark ? C.white : C.ink,
      fontFamily: B,
      fontWeight: 800,
      fontSize: size,
      boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

const Dot: React.FC<{color?: string}> = ({color = C.orange}) => (
  <span style={{width: 18, height: 18, borderRadius: 9, background: color, display: 'inline-block'}} />
);

const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({
  children,
  size = 150,
  color = C.white,
  style,
}) => (
  <div
    style={{
      fontFamily: H,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 0.98,
      color,
      textTransform: 'uppercase',
      letterSpacing: -1,
      ...style,
    }}
  >
    {children}
  </div>
);

const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.yellow}) => (
  <div style={{fontFamily: B, fontWeight: 800, fontSize: 40, letterSpacing: 6, color, textTransform: 'uppercase'}}>
    {children}
  </div>
);

// Latar oren Shopee dengan jalur diagonal bergerak
const OrangeBg: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 30%, ${C.orange2} 0%, ${C.orange} 55%, ${C.deep} 100%)`}}>
    <AbsoluteFill
      style={{
        opacity: 0.1,
        backgroundImage: 'repeating-linear-gradient(135deg, #fff 0 40px, transparent 40px 120px)',
        backgroundPosition: `${f * 2}px 0`,
      }}
    />
  </AbsoluteFill>
);

const DarkBg: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(110% 70% at 50% 40%, ${C.ink2} 0%, ${C.ink} 70%)`}} />
);

const Check: React.FC<{size?: number; color?: string}> = ({size = 40, color = C.orange}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx={12} cy={12} r={12} fill={color} />
    <path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------- babak ----------
const hookAt = (len: number) => (len >= 90 ? [12, 37, 62] : [6, 20, 34]);
const Hook: React.FC<{f: number; len: number}> = ({f, len}) => {
  const lines = ['Dompet tebal?', 'Kad bersepah?', 'Phone takde stand?'];
  const HOOK_AT = hookAt(len);
  const out = ez(f, len - 10, len);
  return (
    <AbsoluteFill>
      <DarkBg />
      <AbsoluteFill style={{justifyContent: 'center', padding: '0 90px', gap: 40, transform: `scale(${1 + out * 0.25})`, opacity: 1 - out}}>
        {lines.map((l, i) => {
          const s = sp(f, HOOK_AT[i], 10, 0.5);
          const strike = ez(f, HOOK_AT[i] + 10, HOOK_AT[i] + 18);
          return (
            <div key={l} style={{position: 'relative', alignSelf: 'flex-start', opacity: s, transform: `translateX(${(1 - s) * -120}px)`}}>
              <Big size={104} style={{whiteSpace: 'nowrap'}}>{l}</Big>
              <div
                style={{
                  position: 'absolute',
                  left: -10,
                  top: '52%',
                  height: 16,
                  borderRadius: 8,
                  width: `${strike * 104}%`,
                  background: C.orange,
                }}
              />
            </div>
          );
        })}
        {len >= 90 ? (
          <Pop f={f} at={68} style={{marginTop: 50}}>
            <div style={{fontFamily: B, fontWeight: 700, fontSize: 52, color: C.dim}}>Ada satu jawapan…</div>
          </Pop>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const HERO_AT = [30, 45, 60];
const Hero: React.FC<{f: number}> = ({f}) => {
  const float = Math.sin(f / 14) * 10;
  return (
    <AbsoluteFill>
      <OrangeBg f={f} />
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center'}}>
        <Pop f={f} at={0}>
          <Kicker>SUPCASE · Magnetic Wallet</Kicker>
        </Pop>
        <Pop f={f} at={2}>
          <Big size={170} style={{marginTop: 18}}>3 fungsi.</Big>
        </Pop>
        <Pop f={f} at={15}>
          <Big size={170} color={C.ink}>1 gajet.</Big>
        </Pop>
      </div>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${float}px)`}}>
        <Photo f={f} at={4} src={img('hero')} w={720} h={880} x={180} y={650} fit="contain" />
      </div>
      <div style={{position: 'absolute', bottom: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22}}>
        {['Dompet', 'Magnet', 'Stand'].map((t, i) => (
          <Pop key={t} f={f} at={HERO_AT[i]}>
            <Chip dark>
              <Dot color={C.orange} />
              {t}
            </Chip>
          </Pop>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const CARD_AT = [8, 16, 23, 31, 38];
const Cards: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill style={{background: C.cream}}>
    <div style={{position: 'absolute', top: 150, left: 90}}>
      <Pop f={f} at={0}>
        <Kicker color={C.orange}>Dompet</Kicker>
      </Pop>
      <Pop f={f} at={3}>
        <Big size={200} color={C.ink}>
          Simpan
          <br />
          <span style={{color: C.orange}}>5</span> kad
        </Big>
      </Pop>
    </div>
    <div style={{position: 'absolute', top: 610, left: 90, display: 'flex', gap: 20}}>
      {CARD_AT.map((at, i) => {
        const s = sp(f, at, 9, 0.5);
        return (
          <div
            key={i}
            style={{
              width: 150,
              height: 96,
              borderRadius: 14,
              background: i % 2 ? C.ink : C.orange,
              transform: `translateY(${(1 - s) * -80}px) rotate(${(1 - s) * 20}deg) scale(${s})`,
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
          >
            <div style={{position: 'absolute', left: 16, top: 22, width: 32, height: 24, borderRadius: 5, background: C.yellow}} />
            <div style={{position: 'absolute', left: 16, bottom: 18, width: 90, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.6)'}} />
          </div>
        );
      })}
    </div>
    <Photo f={f} at={6} src={img('cards')} w={900} h={900 * (510 / 640)} x={90} y={760} />
    <Pop f={f} at={30} style={{position: 'absolute', top: 1530, left: 90, right: 90}}>
      <div style={{fontFamily: B, fontWeight: 700, fontSize: 50, color: C.ink, lineHeight: 1.3}}>
        Kad bank, IC, lesen, Touch ’n Go —<br />
        <span style={{color: C.orange}}>semua di belakang phone.</span>
      </div>
    </Pop>
  </AbsoluteFill>
);

const Magnet: React.FC<{f: number}> = ({f}) => {
  const n = Math.round(interpolate(f, [6, 36], [0, 3000], {...cl, easing: Easing.out(Easing.cubic)}));
  const glow = 0.4 + 0.3 * Math.sin(f / 5);
  return (
    <AbsoluteFill>
      <DarkBg />
      <AbsoluteFill
        style={{background: `radial-gradient(50% 30% at 50% 28%, rgba(238,77,45,${glow}) 0%, transparent 70%)`}}
      />
      <div style={{position: 'absolute', top: 170, left: 0, right: 0, textAlign: 'center'}}>
        <Pop f={f} at={0}>
          <Kicker>Kuasa magnet</Kicker>
        </Pop>
        <Pop f={f} at={3}>
          <Big size={300} style={{fontVariantNumeric: 'tabular-nums'}}>
            {n.toLocaleString('en-US')}
            <span style={{color: C.orange}}>G</span>
          </Big>
        </Pop>
      </div>
      <Photo f={f} at={8} src={img('magnet')} w={960} h={960 * (930 / 1600)} x={60} y={740} bg="#eee" />
      <div style={{position: 'absolute', top: 1380, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
        <Pop f={f} at={30}>
          <Chip>
            <Check /> Serasi MagSafe
          </Chip>
        </Pop>
        <Pop f={f} at={40}>
          <Chip>
            <Check /> Lekat kemas, tak mudah tercabut
          </Chip>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

export const MODE_AT = [10, 25, 40, 55];
const Stand: React.FC<{f: number; len: number}> = ({f, len}) => {
  const tiles = [
    {src: 'vlog', t: 'Vlog'},
    {src: 'browse', t: 'Scroll'},
    {src: 'theatre', t: 'Tonton video'},
    {src: 'tripod', t: 'Video call'},
  ];
  const W = 440;
  const Ht = 400;
  return (
    <AbsoluteFill>
      <OrangeBg f={f} />
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center'}}>
        <Pop f={f} at={0}>
          <Kicker>Lipat sekali</Kicker>
        </Pop>
        <Pop f={f} at={3}>
          <Big size={180}>
            Jadi <span style={{color: C.ink}}>stand</span>
          </Big>
        </Pop>
      </div>
      {tiles.map((tile, i) => {
        const x = 80 + (i % 2) * (W + 40);
        const y = 560 + Math.floor(i / 2) * (Ht + 110);
        return (
          <React.Fragment key={tile.src}>
            <Photo f={f} at={MODE_AT[i]} src={img(tile.src)} w={W} h={Ht} x={x} y={y} radius={36} />
            <Pop f={f} at={MODE_AT[i] + 5} style={{position: 'absolute', left: x, top: y + Ht - 40, width: W, textAlign: 'center'}}>
              <Chip dark size={34}>
                {tile.t}
              </Chip>
            </Pop>
          </React.Fragment>
        );
      })}
      {len >= 90 ? (
        <Pop f={f} at={62} style={{position: 'absolute', bottom: 150, left: 0, right: 0, textAlign: 'center'}}>
          <div style={{fontFamily: B, fontWeight: 800, fontSize: 48, color: C.white}}>Menegak atau melintang — ikut suka.</div>
        </Pop>
      ) : null}
    </AbsoluteFill>
  );
};

const Rfid: React.FC<{f: number}> = ({f}) => {
  const ring = (f % 30) / 30;
  return (
    <AbsoluteFill>
      <DarkBg />
      <Photo f={f} at={0} src={img('rfid')} w={1080} h={1080 * (1155 / 1491)} x={0} y={740} radius={0} />
      <div style={{position: 'absolute', top: 150, left: 90, right: 90}}>
        <Pop f={f} at={0}>
          <Kicker>Selamat</Kicker>
        </Pop>
        <Pop f={f} at={3}>
          <Big size={170}>RFID blocking</Big>
        </Pop>
        <Pop f={f} at={10}>
          <div style={{fontFamily: B, fontWeight: 700, fontSize: 50, color: C.dim, marginTop: 14}}>
            Lindungi data kad anda dari imbasan curi.
          </div>
        </Pop>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 540 - 200 * ring,
          top: 1130 - 200 * ring,
          width: 400 * ring,
          height: 400 * ring,
          borderRadius: '50%',
          border: `8px solid ${C.orange}`,
          opacity: 1 - ring,
        }}
      />
      <Pop f={f} at={24} style={{position: 'absolute', bottom: 160, left: 0, right: 0, textAlign: 'center'}}>
        <Chip>
          <Check /> Termasuk 1 kad RFID
        </Chip>
      </Pop>
    </AbsoluteFill>
  );
};

const SWATCH = ['#2f4a3a', '#1f1f1f', '#3a3a3a', '#8a5a36', '#ee7d22', '#b9b9b9', '#c9a57c'];
const Colors: React.FC<{f: number}> = ({f}) => {
  const idx = Math.max(0, Math.min(6, Math.floor(f / 8)));
  return (
    <AbsoluteFill style={{background: C.white}}>
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center'}}>
        <Pop f={f} at={0}>
          <Big size={200} color={C.ink}>
            <span style={{color: C.orange}}>7</span> warna
          </Big>
        </Pop>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 40,
          width: 1000,
          height: 1000 * (620 / 1024),
          transform: `scale(${1 + 0.03 * Math.exp(-(f % 8) / 2)})`,
        }}
      >
        <Img src={img(`color${idx}`)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      </div>
      <div style={{position: 'absolute', top: 1320, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 26}}>
        {SWATCH.map((c, i) => (
          <div
            key={c}
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              background: c,
              border: `6px solid ${i === idx ? C.orange : 'transparent'}`,
              outline: '4px solid #fff',
              transform: `scale(${i === idx ? 1.18 : 1})`,
              boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
            }}
          />
        ))}
      </div>
      <Pop f={f} at={10} style={{position: 'absolute', top: 1480, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontFamily: B, fontWeight: 700, fontSize: 44, color: C.ink}}>
          Untuk iPhone 12 – 17 <span style={{color: '#8a817c'}}>(kecuali mini)</span>
        </div>
      </Pop>
    </AbsoluteFill>
  );
};

export const CTA_AT = [30, 38, 46];
const Cta: React.FC<{f: number}> = ({f}) => {
  const hit = f >= END_HIT ? Math.exp(-(f - END_HIT) / 6) : 0;
  const pulse = 1 + 0.04 * Math.sin((f / 15) * Math.PI * 2) + hit * 0.12;
  const tap = f > 55 ? (f - 55) % 30 : 99;
  return (
    <AbsoluteFill>
      <OrangeBg f={f} />
      <div style={{position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center'}}>
        <Pop f={f} at={0}>
          <div style={{fontFamily: B, fontWeight: 800, fontSize: 46, color: C.white}}>
            <span style={{color: C.yellow}}>★★★★★</span> 4.9 · 1.3k penilaian
          </div>
        </Pop>
      </div>
      <Photo f={f} at={2} src={img('hero')} w={520} h={740} x={280} y={220} fit="contain" />
      <Pop f={f} at={12} style={{position: 'absolute', top: 1000, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontFamily: B, fontWeight: 800, fontSize: 42, color: C.white, letterSpacing: 2}}>HANYA</div>
        <Big size={210} style={{transform: `scale(${1 + hit * 0.08})`}}>
          <span style={{fontSize: 110, verticalAlign: 'top', lineHeight: 1.4}}>RM</span>151.77
        </Big>
        <div style={{fontFamily: B, fontWeight: 700, fontSize: 34, color: C.white, opacity: 0.85}}>selepas baucar kedai*</div>
      </Pop>
      <div style={{position: 'absolute', top: 1400, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16}}>
        {['Free shipping', 'COD', 'Pulangan 15 hari'].map((t, i) => (
          <Pop key={t} f={f} at={CTA_AT[i]}>
            <Chip size={32}>
              <Check size={34} /> {t}
            </Chip>
          </Pop>
        ))}
      </div>
      <Pop f={f} at={50} style={{position: 'absolute', top: 1560, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            position: 'relative',
            padding: '34px 70px',
            borderRadius: 999,
            background: C.white,
            color: C.orange,
            fontFamily: H,
            fontWeight: 700,
            fontSize: 72,
            textTransform: 'uppercase',
            transform: `scale(${pulse})`,
            boxShadow: `0 0 0 ${10 + hit * 30}px rgba(255,255,255,${0.25 - hit * 0.1}), 0 20px 50px rgba(0,0,0,0.3)`,
          }}
        >
          Beli di Shopee →
          {tap < 20 ? (
            <div
              style={{
                position: 'absolute',
                right: 60,
                bottom: -30,
                width: 70 + tap * 5,
                height: 70 + tap * 5,
                marginRight: -tap * 2.5,
                marginBottom: -tap * 2.5,
                borderRadius: '50%',
                border: `6px solid ${C.white}`,
                opacity: 1 - tap / 20,
              }}
            />
          ) : null}
        </div>
      </Pop>
      <Pop f={f} at={58} style={{position: 'absolute', top: 1745, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontFamily: B, fontWeight: 800, fontSize: 40, color: C.white}}>Tekan link di bawah ⬇</div>
      </Pop>
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: B,
          fontWeight: 500,
          fontSize: 24,
          color: 'rgba(255,255,255,0.75)',
        }}
      >
        *Harga semasa di Shopee, tertakluk kepada perubahan.
      </div>
    </AbsoluteFill>
  );
};

type Sfx = {src: string; at: number; vol: number};
type Scene = {C: React.FC<{f: number; len: number}>; sfx: (len: number) => Sfx[]};
const pops = (at: number[], vol = 0.4, src = 'sfx-pop.wav') => at.map((a) => ({src, at: a, vol}));

const SCENES = {
  hook: {C: Hook, sfx: (len) => pops(hookAt(len), 0.55)},
  hero: {C: Hero, sfx: () => [{src: 'sfx-impact.wav', at: 0, vol: 0.6}, ...pops(HERO_AT)]},
  cards: {C: Cards, sfx: () => pops(CARD_AT)},
  magnet: {C: Magnet, sfx: () => [{src: 'sfx-ting.wav', at: 36, vol: 0.4}]},
  stand: {C: Stand, sfx: () => pops(MODE_AT)},
  rfid: {C: Rfid, sfx: () => []},
  colors: {C: Colors, sfx: () => []},
  cta: {C: Cta, sfx: () => [...pops(CTA_AT, 0.3, 'sfx-ting.wav'), {src: 'sfx-impact.wav', at: END_HIT, vol: 0.5}]},
} satisfies Record<string, Scene>;

type Cut = {music: string; scenes: [keyof typeof SCENES, number][]};
// Setiap sempadan babak jatuh pada beat; muzik dijana dengan drop & hentakan yang sepadan
export const CUTS = {
  full: {
    music: 'supcase-music.wav',
    scenes: [['hook', 90], ['hero', 90], ['cards', 75], ['magnet', 75], ['stand', 90], ['rfid', 60], ['colors', 60], ['cta', 150]],
  },
  short: {
    music: 'supcase-music-15s.wav',
    scenes: [['hook', 60], ['hero', 75], ['cards', 60], ['magnet', 60], ['stand', 75], ['cta', 120]],
  },
} satisfies Record<string, Cut>;
export const cutLength = (cut: Cut) => cut.scenes.reduce((a, [, len]) => a + len, 0);

export const SupcaseAd: React.FC<{cut: keyof typeof CUTS}> = ({cut}) => {
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender('Memuatkan font'));
  useEffect(() => {
    Promise.all(FONTS.map((f) => document.fonts.load(f))).then(() => continueRender(handle));
  }, [handle]);

  const {music, scenes} = CUTS[cut] as Cut;
  const starts = scenes.map((_, i) => scenes.slice(0, i).reduce((a, [, len]) => a + len, 0));
  const DROP = starts[1];
  const hitAt = starts[scenes.length - 1] + END_HIT;
  const sfx: Sfx[] = [
    ...scenes.flatMap(([k, len], i) => SCENES[k].sfx(len).map((s) => ({...s, at: starts[i] + s.at}))),
    ...starts.slice(2).map((b) => ({src: 'sfx-whoosh.wav', at: b - T - 2, vol: 0.5})),
  ];

  // "Punch" kecil pada setiap beat selepas drop
  const beatOn = frame >= DROP && frame < hitAt;
  const punch = beatOn ? 1 + 0.012 * Math.exp(-((frame - DROP) % 15) / 3.5) : 1;
  // Kilat putih pada drop
  const flash = frame >= DROP ? Math.exp(-(frame - DROP) / 4) : 0;

  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${punch})`}}>
        {scenes.map(([k, len], i) => {
          const S = SCENES[k].C;
          const start = starts[i];
          const end = start + len;
          const lead = i > 1 ? T : 0; // babak masuk sedikit awal, menyapu dari kanan
          if (frame < start - lead || frame >= end) return null;
          const p = lead ? ez(frame, start - lead, start) : 1;
          return (
            <AbsoluteFill
              key={i}
              style={{
                transform: `translateX(${(1 - p) * 1080}px) rotate(${(1 - p) * 4}deg)`,
                transformOrigin: '0% 100%',
                boxShadow: p < 1 ? '-30px 0 60px rgba(0,0,0,0.4)' : undefined,
              }}
            >
              <S f={frame - start} len={len} />
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: flash * 0.8, pointerEvents: 'none'}} />

      <Audio src={staticFile(`audio/${music}`)} volume={0.85} />
      {sfx.map((s, i) => (
        <Sequence key={i} from={s.at} durationInFrames={60} layout="none">
          <Audio src={staticFile(`audio/${s.src}`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
