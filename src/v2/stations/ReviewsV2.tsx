import React from 'react';
import {getLength} from '@remotion/paths';
import {interpolate} from 'remotion';
import {B, cl, D, ez, H, sp, Stage, Tag, Wire} from '../kit';

// Petikan ulasan Google sebenar (servis sahaja — tiada dakwaan hasil rawatan)
const REVIEWS = [
  {
    text: 'Servis yg sangat2 baik, Doktor dan staff sangat friendly.. anak2 pun suka ke klinik gigi',
    name: 'Nor Hayati H.',
    branch: 'Jejawi',
  },
  {
    text: 'Terima kasih dr atas perkhidmatan yang baik..lemah lembut ja dr pon..staff pon baik dan friendly',
    name: 'Zarina M.',
    branch: 'Mergong',
  },
  {
    text: '…servis mantap..doktor buat keja sgt2 teliti..',
    name: 'Zuri Y.',
    branch: 'Jejawi',
  },
];
export const REVIEW_AT = [45, 90, 135];
export const STAR_AT = [8, 12, 16, 20, 24];
const CARD_Y = [640, 906, 1172];
const CARD_H = 244;
const RX = 1040;

const Star: React.FC<{size: number; fill?: string; s?: number}> = ({size, fill = D.gold, s = 1}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{transform: `scale(${s})`}}>
    <path d="M12 1.8l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.9l-6.4 3.5L7 14.3l-5.3-5 7.2-.9z" fill={fill} />
  </svg>
);

const ENTRY = `M540 -40 C 540 120, ${RX} 120, ${RX} 360 L${RX} ${CARD_Y[0]}`;
const RAIL = `${ENTRY} L${RX} ${CARD_Y[2] + CARD_H}`;

export const ReviewsV2: React.FC<{f: number}> = ({f}) => {
  const total = getLength(RAIL);
  const entry = getLength(ENTRY);
  const railP = interpolate(
    f,
    [-12, 30, ...REVIEW_AT.map((a) => a + 2)],
    [0, entry / total, ...CARD_Y.map((y) => (entry + (y + CARD_H / 2 - CARD_Y[0])) / total)],
    cl,
  );
  const railEnd = interpolate(f, [REVIEW_AT[2] + 2, REVIEW_AT[2] + 20], [railP, 1], cl);
  const big = sp(f, 2, 12);

  return (
    <>
      <div style={{position: 'absolute', top: 230, left: 70, right: 90}}>
        <Tag text="ULASAN GOOGLE" o={ez(f, 0, 10)} />
        <div style={{display: 'flex', alignItems: 'center', gap: 28, marginTop: 18}}>
          <div
            style={{
              fontFamily: H,
              fontWeight: 700,
              fontSize: 190,
              lineHeight: 1,
              color: D.gold,
              transform: `scale(${0.6 + Math.min(big, 1.1) * 0.4})`,
              transformOrigin: 'left center',
              textShadow: '0 0 40px rgba(232,199,133,0.35)',
            }}
          >
            4.9
          </div>
          <div>
            <div style={{display: 'flex', gap: 6}}>
              {STAR_AT.map((at, i) => {
                const s = sp(f, at, 8, 0.5);
                return <Star key={i} size={66} s={Math.min(1.25, s)} fill={f >= at ? D.gold : 'rgba(232,199,133,0.15)'} />;
              })}
            </div>
            <div style={{fontFamily: B, fontWeight: 700, fontSize: 40, color: D.cream, marginTop: 8, opacity: ez(f, 24, 34)}}>
              905 ulasan di Google
            </div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 16, marginTop: 20, opacity: ez(f, 30, 40)}}>
          {['Mergong · 4.9★ · 542', 'Jejawi · 4.9★ · 363'].map((t) => (
            <div
              key={t}
              style={{
                fontFamily: H,
                fontWeight: 500,
                fontSize: 30,
                letterSpacing: 2,
                color: D.dim,
                border: '2px solid rgba(247,242,234,0.25)',
                borderRadius: 999,
                padding: '4px 18px',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      <Stage>
        <Wire d={RAIL} p={Math.max(railP, railEnd)} spark={railEnd < 0.999} />
        <Wire d={`M${RX} ${CARD_Y[2] + CARD_H} C ${RX} 1700, 540 1640, 540 1960`} p={ez(f, 212, 242)} />
      </Stage>

      {REVIEWS.map((r, i) => {
        const s = sp(f, REVIEW_AT[i], 14);
        const node = sp(f, REVIEW_AT[i] + 2, 8);
        return (
          <React.Fragment key={r.name}>
            <div
              style={{
                position: 'absolute',
                left: RX - 20,
                top: CARD_Y[i] + CARD_H / 2 - 20,
                width: 40,
                height: 40,
                borderRadius: 20,
                background: D.gold,
                boxShadow: `0 0 30px ${D.gold}`,
                transform: `scale(${node})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 50,
                right: 90,
                top: CARD_Y[i],
                height: CARD_H,
                boxSizing: 'border-box',
                background: D.card,
                border: '2px solid rgba(232,199,133,0.45)',
                borderRight: `8px solid ${D.gold}`,
                borderRadius: 18,
                padding: '22px 30px 20px 96px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                transform: `translateX(${(1 - s) * -1000}px) rotate(${(1 - s) * -4}deg)`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 22,
                  top: 4,
                  fontFamily: H,
                  fontWeight: 700,
                  fontSize: 150,
                  lineHeight: 1,
                  color: D.gold,
                  opacity: 0.9,
                }}
              >
                “
              </div>
              <div style={{fontFamily: B, fontWeight: 600, fontSize: 34, lineHeight: 1.32, color: D.cream}}>{r.text}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <div style={{display: 'flex', gap: 2}}>
                  {[0, 1, 2, 3, 4].map((k) => (
                    <Star key={k} size={28} />
                  ))}
                </div>
                <div style={{fontFamily: B, fontWeight: 700, fontSize: 28, color: D.gold}}>{r.name}</div>
                <div
                  style={{
                    fontFamily: H,
                    fontWeight: 500,
                    fontSize: 24,
                    letterSpacing: 3,
                    color: D.dim,
                    textTransform: 'uppercase',
                    marginLeft: 'auto',
                  }}
                >
                  {r.branch}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 90,
          top: 1440,
          fontFamily: B,
          fontSize: 25,
          lineHeight: 1.4,
          color: D.dim,
          opacity: ez(f, 150, 165),
        }}
      >
        Petikan ulasan Google pesakit Izznara. Pengalaman setiap individu mungkin berbeza.
      </div>
    </>
  );
};
