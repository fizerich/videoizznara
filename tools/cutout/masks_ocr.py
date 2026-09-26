"""
Pass 1 (versi OCR): mask kapsyen & ikon terbakar, tanpa positif palsu pada tepi latar.

  pip install rapidocr_onnxruntime
  CUTOUT_WORK=cutout-work python3 tools/cutout/masks_ocr.py

Output: <work>/mask2/NNNN.png

Teks  : kotak baris dari pengesan teks RapidOCR (PP-OCR DB); dalam kotak, hanya piksel
        berwarna kapsyen (putih/kuning) + bayangnya.
Ikon  : garis luar biru gelap / sian (process.icons) + ikon putih bergaris luar gelap
        (bentuk tertutup statik) — lubangnya diisi.
"""
import os
import sys
import time

import cv2
import numpy as np
from rapidocr_onnxruntime import RapidOCR

sys.path.insert(0, os.path.dirname(__file__))
from capmask import K, S, W, H, frames, icons, static  # noqa: E402

SKIP = [(511, 613), (735, 995)]
NOMASK = [(126, 134), (613, 620)]
inr = lambda t, rs: any(a <= t < b for a, b in rs)
OUT = f"{S}/mask2"
os.makedirs(OUT, exist_ok=True)
eng = RapidOCR()


def fill_holes(m):
    """Isi kawasan tertutup (lubang) dalam mask binari."""
    inv = (m == 0).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(inv, 4)
    out = m.copy()
    for c in range(1, n):
        x, y, w, h, a = st[c]
        if x == 0 or y == 0 or x + w == W or y + h == H:
            continue  # bersambung dengan tepi = bukan lubang
        if 300 < a < 40000:
            out[lab == c] = 1
    return out


def text_mask(img):
    res, _ = eng(img, use_det=True, use_cls=False, use_rec=False)
    m = np.zeros((H, W), np.uint8)
    if not res:
        return m
    b, g, r = [img[..., i].astype(np.int16) for i in range(3)]
    mn = np.minimum(np.minimum(b, g), r)
    mx = np.maximum(np.maximum(b, g), r)
    white = (mn > 195) & (mx - mn < 45)
    yellow = (r > 170) & (g > 140) & (b < 120) & (r - b > 70)
    cand = (white | yellow).astype(np.uint8)
    for box in res:
        pts = np.array(box, np.float32).reshape(-1, 2)
        x0, y0 = pts.min(0) - 12
        x1, y1 = pts.max(0) + 12
        x0, y0 = int(max(0, x0)), int(max(0, y0))
        x1, y1 = int(min(W, x1)), int(min(H, y1))
        if (y1 - y0) > 160 or (x1 - x0) < 30:
            continue  # bukan baris kapsyen
        sub = cand[y0:y1, x0:x1]
        # glif + bayang (dilate) dalam kotak sahaja
        m[y0:y1, x0:x1] |= cv2.dilate(sub, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    return m


def outlined_icons(img, st):
    """Ikon putih bergaris luar gelap (cth. ikon gigi): garis luar statik yang menutup lubang."""
    v = img.max(axis=2)
    dark = (v < 70) & st
    dark = cv2.morphologyEx(dark.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    filled = fill_holes(dark)
    holes = (filled > 0) & (dark == 0)
    # lubang yang diisi mesti kebanyakannya putih (isi ikon)
    out = np.zeros((H, W), np.uint8)
    n, lab, stt, _ = cv2.connectedComponentsWithStats(holes.astype(np.uint8), 8)
    mn = img.min(axis=2)
    for c in range(1, n):
        comp = lab == c
        if (mn[comp] > 200).mean() > 0.7:
            out[comp] = 1
    if out.any():
        out = cv2.dilate(out, np.ones((9, 9), np.uint8))
        out |= (cv2.dilate(out, np.ones((9, 9), np.uint8)) > 0) & (dark > 0)
    return out.astype(np.uint8)


def main():
    t0 = time.time()
    buf, start, n = [], 0, 0

    def do(t):
        j = t - start
        img = buf[j]
        if inr(t, SKIP) or inr(t, NOMASK):
            m = np.zeros((H, W), np.uint8)
        else:
            st = static(buf, j)
            m = text_mask(img) | icons(img) | outlined_icons(img, st)
        cv2.imwrite(f"{OUT}/{t:04d}.png", m * 255)
        if t % 100 == 0:
            print("mask2", t, round(time.time() - t0), flush=True)

    for f in frames():
        buf.append(f)
        n += 1
        if len(buf) > 2 * K + 1:
            buf.pop(0)
            start += 1
        t = n - 1 - K
        if t >= 0:
            do(t)
    for t in range(max(0, n - K), n):
        do(t)
    print("done", n, round(time.time() - t0), flush=True)


if __name__ == "__main__":
    main()
