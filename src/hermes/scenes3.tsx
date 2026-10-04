import React from 'react';
import {Img, staticFile} from 'remotion';
import {BODY, Card, Chip, cl, Dot, ease, Head, HEAD, Icon, MONO, P, prog, R, useP, useScene} from './kit';

// ───────────────────────────────────────────────────────── 9. Kos
export const CostScene: React.FC = () => {
  const {f, L} = useScene();
  const n1 = ease(f, (L[1] ?? 0) - 4, (L[1] ?? 0) + 40);
  const bar = useP(2, 0, 20);
  const cache = ease(f, (L[3] ?? 0), (L[3] ?? 0) + 40);
  const dots = ease(f, (L[4] ?? 0), (L[4] ?? 0) + 70);
  const segs = [
    {k: 'Arahan', w: 12, c: P.cyan},
    {k: 'Memori', w: 10, c: P.violet},
    {k: 'Senarai alat', w: 20, c: P.gold},
    {k: 'Perbualan', w: 58, c: P.green},
  ];
  return (
    <>
      <Head step="Kos" title="Berapa bayarannya?" sub="Pelayan tetap · model ialah yang perlu dipantau" />
      <R at={1} style={{position: 'absolute', left: 110, top: 290, width: 520}}>
        <Card glow={P.gold} style={{height: 480}}>
          <div style={{fontSize: 24, color: P.dim}}>Sepanjang video itu dibuat</div>
          <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 130, color: P.text, lineHeight: 1.1, marginTop: 10}}>
            {Math.round(105 * n1)}
          </div>
          <div style={{fontSize: 28, color: P.dim}}>permintaan</div>
          <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 110, color: P.gold, lineHeight: 1.1, marginTop: 24}}>
            US${(0.13 * n1).toFixed(2)}
          </div>
          <div style={{fontSize: 28, color: P.dim}}>jumlah belanja (13 sen)</div>
        </Card>
      </R>

      <div style={{position: 'absolute', left: 670, top: 290, width: 640, height: 480}}>
        <R at={2}>
          <Card style={{height: 480}}>
            <div style={{fontFamily: HEAD, fontSize: 36, color: P.cyan}}>Setiap mesej ≈ 38,000 token</div>
            <div style={{fontSize: 22, color: P.dim, marginTop: 8, lineHeight: 1.35}}>
              Ejen menghantar semula semuanya setiap kali. Itulah “konteks”, hampir seluruh bil.
            </div>
            <div style={{display: 'flex', height: 66, borderRadius: 14, overflow: 'hidden', marginTop: 28, transform: `scaleX(${bar})`, transformOrigin: 'left'}}>
              {segs.map((s) => (
                <div key={s.k} style={{width: `${s.w}%`, background: s.c, opacity: 0.85}} />
              ))}
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14}}>
              {segs.map((s) => (
                <span key={s.k} style={{fontSize: 21, color: P.dim, display: 'flex', alignItems: 'center', gap: 8}}>
                  <Dot color={s.c} size={12} /> {s.k}
                </span>
              ))}
            </div>
            <div style={{marginTop: 30, fontSize: 24, color: P.text}}>Bahagian yang dibaca dari cache</div>
            <div style={{height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.1)', marginTop: 10, overflow: 'hidden'}}>
              <div style={{width: `${75 * cache}%`, height: '100%', background: `linear-gradient(90deg, ${P.green}, ${P.cyan})`}} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: P.green, marginTop: 10}}>
              {Math.round(75 * cache)}% · jauh lebih murah
            </div>
          </Card>
        </R>
      </div>

      <R at={4} style={{position: 'absolute', left: 1350, top: 290, width: 460}}>
        <Card glow={P.green} style={{height: 480}}>
          <div style={{fontSize: 24, color: P.dim}}>Kredit US$5 cukup untuk</div>
          <div style={{fontFamily: HEAD, fontWeight: 700, fontSize: 82, color: P.green, lineHeight: 1.1}}>≈ 4,000</div>
          <div style={{fontSize: 26, color: P.dim, marginBottom: 14}}>mesej</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 7}}>
            {Array.from({length: 40}, (_, i) => (
              <div key={i} style={{height: 20, borderRadius: 5, background: i / 40 < dots ? P.green : 'rgba(255,255,255,0.1)'}} />
            ))}
          </div>
          <div style={{marginTop: 22, fontSize: 22, color: P.dim, lineHeight: 1.4}}>
            Tukar model bila-bila:
            <div style={{marginTop: 8}}>
              <Chip color={P.gold} size={22}>/model</Chip>
            </div>
            <div style={{marginTop: 10}}>Model Claude / ChatGPT lebih mahal daripada DeepSeek.</div>
          </div>
        </Card>
      </R>
    </>
  );
};

// ───────────────────────────────────────────────────────── 10. Bila bermasalah & seterusnya
export const FixScene: React.FC = () => {
  const {f, L} = useScene();
  const doctor = prog(f, (L[1] ?? 0) + 110, 14);
  const next = useP(2, 0, 18);
  const sub = ease(f, (L[2] ?? 0) + 20, (L[2] ?? 0) + 70);
  const ladder = [
    {at: 0, d: 0, n: '1', t: 'Semak Logs', s: 'tapis: Error · Warning · Info · Debug', c: P.cyan},
    {at: 0, d: 80, n: '2', t: 'Restart Gateway', s: 'biasanya cukup untuk bot yang senyap', c: P.gold},
    {at: 1, d: 0, n: '3', t: 'Restart aplikasi', s: 'Docker Manager → ⋯ → Restart (log keluar, log masuk semula)', c: P.red},
  ];
  const nexts = ['Sub-agent serentak', 'Profil kerja & peribadi', 'Lebih banyak saluran', 'Import dari OpenClaw'];
  return (
    <>
      <Head step="Penyelesaian" title="Bila sesuatu pelik" sub="Dan ke mana seterusnya" />
      <div style={{position: 'absolute', left: 110, top: 290, width: 860, display: 'flex', flexDirection: 'column', gap: 18}}>
        {ladder.map((l) => (
          <R key={l.n} at={l.at} d={l.d} x={-30} y={0}>
            <Card pad={20} glow={l.c} style={{display: 'flex', alignItems: 'center', gap: 20}}>
              <div style={{width: 58, height: 58, borderRadius: '50%', background: l.c, color: '#0b1020', fontFamily: HEAD, fontWeight: 700, fontSize: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                {l.n}
              </div>
              <div>
                <div style={{fontWeight: 700, fontSize: 30}}>{l.t}</div>
                <div style={{fontSize: 22, color: P.dim}}>{l.s}</div>
              </div>
            </Card>
          </R>
        ))}
        <div
          style={{
            opacity: doctor,
            transform: `translateY(${(1 - doctor) * 16}px)`,
            fontFamily: MONO,
            fontSize: 26,
            background: 'rgba(0,0,0,0.5)',
            border: `1px solid ${P.line}`,
            borderRadius: 16,
            padding: '16px 22px',
            color: P.green,
          }}
        >
          <span style={{color: P.dim}}>Web Console $</span> hermes doctor
          <div style={{color: P.dim, fontSize: 21, marginTop: 6}}>→ laporan kesihatan penuh</div>
        </div>
      </div>

      <div style={{position: 'absolute', left: 1030, top: 290, width: 780, opacity: next, transform: `translateX(${(1 - next) * 40}px)`}}>
        <Card glow={P.violet} style={{height: 540}}>
          <div style={{fontFamily: HEAD, fontSize: 38, color: P.violet, letterSpacing: 1}}>SELEPAS INI</div>
          <svg width={720} height={170} style={{marginTop: 6}}>
            <g>
              <circle cx={360} cy={36} r={40} fill={P.gold} opacity={0.9} />
              <text x={360} y={43} textAnchor="middle" fontSize={22} fontWeight={700} fill="#10131f" fontFamily={BODY}>Utama</text>
              {[0, 1, 2, 3].map((i) => {
                const x = 120 + i * 160;
                const p = Math.min(1, Math.max(0, sub * 1.4 - i * 0.1));
                return (
                  <g key={i} opacity={p}>
                    <line x1={360} y1={76} x2={x} y2={120} stroke={P.violet} strokeWidth={3} strokeDasharray="6 6" />
                    <circle cx={x} cy={132} r={24} fill={P.violet} />
                    <text x={x} y={139} textAnchor="middle" fontSize={20} fontWeight={700} fill="#10131f" fontFamily={BODY}>{i + 1}</text>
                  </g>
                );
              })}
            </g>
          </svg>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6}}>
            {nexts.map((n, i) => (
              <div key={n} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, opacity: prog(f, (L[2] ?? 0) + 10 + i * 18, 14)}}>
                <Dot color={P.violet} size={14} /> {n}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

// ───────────────────────────────────────────────────────── 11. Penutup
export const OutroScene: React.FC = () => {
  const {f, L} = useScene();
  const pulse = 0.5 + 0.5 * Math.sin(f / 9);
  return (
    <>
      <Head title="Kerja rumah anda" sub="Cara terbaik untuk bermula" />
      <div style={{position: 'absolute', left: 110, top: 290, width: 860}}>
        <R at={0}>
          <Card glow={P.gold} style={{padding: 34}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <Icon.Star size={52} />
              <div style={{fontFamily: HEAD, fontSize: 38, color: P.gold}}>Tanya ejen anda:</div>
            </div>
            <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 38, lineHeight: 1.35, marginTop: 18}}>
              “Apa yang awak boleh <span style={{color: P.gold}}>ambil alih</span> daripada senarai tugas saya?”
            </div>
            <div style={{fontSize: 24, color: P.dim, marginTop: 18}}>Ceritakan kerja dan jadual mingguan anda, biar ia mencadangkan.</div>
          </Card>
        </R>
        <R at={1} style={{marginTop: 24}}>
          <Card pad={22} style={{fontSize: 23, color: P.dim, lineHeight: 1.45}}>
            <div style={{color: P.text, fontWeight: 700, marginBottom: 6}}>Sumber & nota</div>
            “Hermes Agent – Full Tutorial & Setup Guide (For Beginners)”, Matt · Metics Media (YouTube).
            <div style={{fontFamily: MONO, fontSize: 20, color: P.cyan, marginTop: 6}}>youtube.com/watch?v=DYdvJCxWd6M</div>
            <div style={{marginTop: 6}}>Harga & langkah mungkin sudah berubah.</div>
          </Card>
        </R>
      </div>
      <R at={0} y={30} style={{position: 'absolute', left: 1050, top: 300}}>
        <div style={{borderRadius: 26, overflow: 'hidden', border: `3px solid ${P.gold}88`, boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 ${40 + pulse * 40}px ${P.cyan}33`}}>
          <Img src={staticFile('hermes/presenter.jpg')} style={{width: 760, height: 428, display: 'block'}} />
        </div>
        <div style={{fontFamily: BODY, fontSize: 20, color: P.dim, marginTop: 12, textAlign: 'right'}}>
          Tangkapan skrin: Matt (Metics Media), penerang video asal
        </div>
      </R>
    </>
  );
};
