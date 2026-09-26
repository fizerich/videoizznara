"""
Pass 2 (versi baik): bersihkan kapsyen/ikon, matting semula, kemaskan alfa, encode RGBA.

  CUTOUT_WORK=cutout-work python3 tools/cutout/refine.py

Perlu: <work>/ref.mp4, <work>/alpha/NNNN.png (matte kasar pertama), <work>/mask2/NNNN.png
(dari masks_ocr.py), <work>/models/rvm.onnx dan <work>/models/lama.onnx:
  curl -L -o <work>/models/lama.onnx https://huggingface.co/Carve/LaMa-ONNX/resolve/main/lama_fp32.onnx
Output: <work>/fg.webm (VP9 + alfa).

Penambahbaikan berbanding pass 2 asal:
  1. Tampalan masa — kawasan kapsyen pada badan diisi dengan piksel sebenar dari frame lain
     (syot yang sama) di mana kawasan itu bersih; frame & anjakan kecil dipilih ikut padanan
     cincin di sekeliling kawasan. Selebihnya pada badan: LaMa. Latar: Telea.
  1b. Foto close-up sisipan di bahagian atas diganti dengan plate latar dari frame bersih.
  2. Warna tepi dari `fgr` RVM (warna yang dinyahcemar) — tiada halo dinding putih.
  3. Buang serpihan alfa kecil yang terpisah dari badan.
  4. Median alfa 3 frame dalam syot yang sama — tepi tidak berkelip.
"""
import os
import subprocess
import time
from collections import deque

import cv2
import numpy as np
import onnxruntime as ort
import imageio_ffmpeg

F = imageio_ffmpeg.get_ffmpeg_exe()
S = os.environ.get("CUTOUT_WORK", "cutout-work")
W, H = 1080, 1920
N = 1127

CUTS = [0, 131, 207, 304, 363, 511, 613, 735, 893, 995, N]
SKIP = [(511, 613), (735, 995)]  # panel & klip doktor stok: tidak dipotong
NOMASK = [(126, 134), (613, 620)]  # frame peralihan / kilat kuning
INSERTS = [(161, 206), (271, 359), (386, 429)]
PLATE_Y0, PLATE_Y1 = 680, 760
TD = 6  # pelebaran mask merentas masa
WIN = 90  # tetingkap carian tampalan (frame)
MASK_DIR = os.environ.get("MASK_DIR", "mask2")
USE_TEMPORAL = os.environ.get("USE_TEMPORAL", "0") == "1"  # tampalan masa (perlahan, jarang berjaya)

inr = lambda t, rs: any(a <= t < b for a, b in rs)
shot_of = lambda t: max(i for i, c in enumerate(CUTS[:-1]) if c <= t)
ELL13 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))


def frames():
    p = subprocess.Popen([F, "-v", "error", "-i", f"{S}/ref.mp4", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
    while True:
        b = p.stdout.read(W * H * 3)
        if len(b) < W * H * 3:
            return
        yield np.frombuffer(b, np.uint8).reshape(H, W, 3)


_raw = {}


def raw_mask(k):
    if k not in _raw:
        m = cv2.imread(f"{S}/{MASK_DIR}/{k:04d}.png", 0)
        _raw[k] = (m > 0).astype(np.uint8) if m is not None else np.zeros((H, W), np.uint8)
    return _raw[k]


_hole = {}


def hole(k):
    """Mask lubang untuk frame k: kesatuan mask mentah ±TD, dilebarkan."""
    if k not in _hole:
        m = np.zeros((H, W), np.uint8)
        for j in range(max(0, k - TD), min(N, k + TD + 1)):
            if not (inr(j, SKIP) or inr(j, NOMASK)):
                m |= raw_mask(j)
        _hole[k] = cv2.dilate(m, ELL13)
    return _hole[k]


def shift(img, dx, dy):
    M = np.float32([[1, 0, dx], [0, 1, dy]])
    return cv2.warpAffine(img, M, (img.shape[1], img.shape[0]), borderMode=cv2.BORDER_REPLICATE)


def temporal_fill(t, win, holem):
    """Isi setiap komponen lubang (atas badan sahaja) dengan tampalan dari frame lain.
    Pulangkan (rgb, sisa_lubang)."""
    img = win[t].copy()
    left = holem.copy()
    a0 = cv2.imread(f"{S}/alpha/{t:04d}.png", 0)  # matte kasar pass pertama
    body = (a0 > 128) if a0 is not None else np.ones((H, W), bool)
    n, lab, st, _ = cv2.connectedComponentsWithStats(holem, 8)
    shot = shot_of(t)
    cands = [k for k in range(t - WIN, t + WIN + 1) if k != t and k in win and shot_of(k) == shot and not inr(k, NOMASK)]
    cands.sort(key=lambda k: abs(k - t))
    for c in range(1, n):
        x, y, w, h, area = st[c]
        pad = 24
        x0, y0 = max(0, x - pad), max(0, y - pad)
        x1, y1 = min(W, x + w + pad), min(H, y + h + pad)
        comp = (lab[y0:y1, x0:x1] == c).astype(np.uint8)
        if not (body[y0:y1, x0:x1] & (comp > 0)).any():
            continue
        ring = (cv2.dilate(comp, np.ones((31, 31), np.uint8)) - cv2.dilate(comp, np.ones((7, 7), np.uint8))) > 0
        ring &= holem[y0:y1, x0:x1] == 0
        if ring.sum() < 50:
            continue
        cur = img[y0:y1, x0:x1].astype(np.int16)
        best = None
        scored = []
        for k in cands:
            # kawasan mesti bersih dalam frame k
            if (hole(k)[y0:y1, x0:x1] & comp).any():
                continue
            ref = win[k][y0:y1, x0:x1].astype(np.int16)
            s = np.abs(ref - cur)[ring].mean()
            scored.append((s, k))
            if len(scored) >= 24:
                break
        if not scored:
            continue
        scored.sort()
        for s0, k in scored[:4]:
            # cari anjakan kecil (goyangan badan)
            big = win[k][max(0, y0 - 10) : min(H, y1 + 10), max(0, x0 - 10) : min(W, x1 + 10)]
            ox, oy = x0 - max(0, x0 - 10), y0 - max(0, y0 - 10)
            for dy in range(-8, 9, 2):
                for dx in range(-8, 9, 2):
                    sy, sx = oy + dy, ox + dx
                    if sy < 0 or sx < 0 or sy + (y1 - y0) > big.shape[0] or sx + (x1 - x0) > big.shape[1]:
                        continue
                    ref = big[sy : sy + (y1 - y0), sx : sx + (x1 - x0)].astype(np.int16)
                    s = np.abs(ref - cur)[ring].mean()
                    if best is None or s < best[0]:
                        best = (s, k, dx, dy, ref)
        if best is None or best[0] > 28:
            continue  # sandaran: Telea
        s, k, dx, dy, ref = best
        # padankan kecerahan tampalan dengan cincin frame semasa
        off = (cur[ring].mean(axis=0) - ref[ring].mean(axis=0)).clip(-25, 25)
        patch = (ref + off).clip(0, 255).astype(np.float32)
        feather = cv2.GaussianBlur(cv2.dilate(comp, np.ones((5, 5), np.uint8)).astype(np.float32), (0, 0), 3)[..., None]
        feather = np.maximum(feather, comp[..., None].astype(np.float32))
        region = img[y0:y1, x0:x1].astype(np.float32)
        img[y0:y1, x0:x1] = (patch * feather + region * (1 - feather)).astype(np.uint8)
        left[y0:y1, x0:x1][comp > 0] = 0
    return img, left


_lama = None


def lama_fill(img, holem, body):
    """Isi komponen lubang yang menyentuh badan dengan LaMa (tekstur semula jadi)."""
    global _lama
    if _lama is None:
        _lama = ort.InferenceSession(f"{S}/models/lama.onnx", providers=["CPUExecutionProvider"])
    out = img.copy()
    left = holem.copy()
    n, lab, st, _ = cv2.connectedComponentsWithStats(holem, 8)
    on = [c for c in range(1, n) if body[lab == c].any()]
    if not on:
        return out, left
    # gabungkan komponen berdekatan -> satu panggilan LaMa setiap kelompok
    onm = np.isin(lab, on)
    groups = cv2.connectedComponentsWithStats(cv2.dilate(onm.astype(np.uint8), np.ones((61, 61), np.uint8)), 8)[1]
    for g in range(1, groups.max() + 1):
        comp = (onm & (groups == g)).astype(np.uint8)
        if not comp.any():
            continue
        ys, xs = np.where(comp)
        x, y, w, h = xs.min(), ys.min(), xs.max() - xs.min() + 1, ys.max() - ys.min() + 1
        side = int(min(1080, max(256, max(w, h) * 1.8 + 64)))
        cx, cy = x + w // 2, y + h // 2
        x0 = max(0, min(W - side, cx - side // 2))
        y0 = max(0, min(H - side, cy - side // 2))
        x1, y1 = x0 + side, y0 + side
        crop = out[y0:y1, x0:x1]
        m = comp[y0:y1, x0:x1]
        ci = cv2.resize(crop, (512, 512), interpolation=cv2.INTER_AREA)[..., ::-1].astype(np.float32).transpose(2, 0, 1)[None] / 255
        cm = (cv2.resize(m, (512, 512), interpolation=cv2.INTER_NEAREST) > 0).astype(np.float32)[None, None]
        res = _lama.run(None, {"image": ci, "mask": cm})[0][0].transpose(1, 2, 0)
        if res.max() <= 1.5:
            res = res * 255
        res = cv2.resize(res.clip(0, 255).astype(np.uint8)[..., ::-1], (side, side), interpolation=cv2.INTER_CUBIC)
        f = cv2.GaussianBlur(cv2.dilate(m, np.ones((5, 5), np.uint8)).astype(np.float32), (0, 0), 2)[..., None]
        f = np.maximum(f, m[..., None].astype(np.float32))
        out[y0:y1, x0:x1] = (res * f + crop * (1 - f)).astype(np.uint8)
        left[y0:y1, x0:x1][m > 0] = 0
    return out, left


def clean_alpha(a):
    """Buang serpihan alfa yang tidak bersambung dengan badan."""
    m = (a > 40).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    if n <= 2:
        return a
    areas = st[1:, cv2.CC_STAT_AREA]
    keep = np.zeros(n, bool)
    keep[1:] = areas >= max(4000, areas.max() * 0.03)
    drop = (~keep[lab]) & (m > 0)
    drop = cv2.dilate(drop.astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
    out = a.copy()
    out[drop & ~(keep[lab] & (m > 0))] = 0
    return out


def run():
    t0 = time.time()
    sess = ort.InferenceSession(f"{S}/models/rvm.onnx", providers=["CPUExecutionProvider"])
    z = lambda: np.zeros([1, 1, 1, 1], np.float32)
    rec = [z(), z(), z(), z()]
    ds = np.array([0.25], np.float32)
    enc = subprocess.Popen(
        [F, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{H}", "-r", "30", "-i", "-",
         "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "24", "-deadline", "good", "-cpu-used", "4",
         "-row-mt", "1", "-auto-alt-ref", "0", f"{S}/fg.webm"],
        stdin=subprocess.PIPE,
    )
    win = {}
    src = frames()
    nxt = 0
    def plate_top(t, img):
        """Ganti foto sisipan di bahagian atas dengan latar bersih dari frame lain (syot sama)."""
        shot = shot_of(t)
        cands = [k for k in range(t - WIN, t + WIN + 1) if k in win and shot_of(k) == shot and not inr(k, INSERTS)]
        if not cands:
            return img
        plate = win[min(cands, key=lambda k: abs(k - t))]
        # foto sisipan menutup y < ~680 (dengan tepi pudar); ganti penuh, campur ke y = 760
        ramp = np.clip((PLATE_Y1 - np.arange(H)) / (PLATE_Y1 - PLATE_Y0), 0, 1).astype(np.float32)[:, None, None]
        out = (plate * ramp + img * (1 - ramp)).astype(np.uint8)
        return out

    pending = deque()  # (t, rgb, alpha) menunggu median alfa

    def emit(t, rgb, a):
        enc.stdin.write(np.dstack([rgb, a]).tobytes())

    stats = {"patched": 0, "lama": 0, "telea": 0}
    for t in range(N):
        while nxt < N and nxt <= t + WIN:
            win[nxt] = next(src)
            nxt += 1
        for k in [k for k in win if k < t - WIN]:
            del win[k]
        for k in [k for k in list(_hole) if k < t - WIN - 1]:
            del _hole[k]
        for k in [k for k in list(_raw) if k < t - WIN - TD - 1]:
            del _raw[k]
        if t in CUTS:
            rec = [z(), z(), z(), z()]
        if inr(t, SKIP):
            while pending:
                emit(*pending.popleft())
            emit(t, np.zeros((H, W, 3), np.uint8), np.zeros((H, W), np.uint8))
            continue

        img = win[t]
        if inr(t, INSERTS):
            img = plate_top(t, img)
        hm = hole(t)
        if hm.any():
            if USE_TEMPORAL:
                rgb, left = temporal_fill(t, {**win, t: img}, hm)
            else:
                rgb, left = img, hm.copy()
            stats["patched"] += int(hm.sum() - left.sum())
            a0 = cv2.imread(f"{S}/alpha/{t:04d}.png", 0)
            body = cv2.dilate((a0 > 128).astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
            if inr(t, INSERTS):
                body[:PLATE_Y0] = False  # kawasan foto sisipan sudah diganti plate
            if left.any():
                rgb, left2 = lama_fill(rgb, left, body)
                stats["lama"] += int(left.sum() - left2.sum())
                left = left2
            stats["telea"] += int(left.sum())
            if left.any():
                rgb = cv2.inpaint(rgb, cv2.dilate(left, np.ones((3, 3), np.uint8)), 5, cv2.INPAINT_TELEA)
        else:
            rgb = img
        inp = rgb[..., ::-1].astype(np.float32).transpose(2, 0, 1)[None] / 255
        fgr, pha, *rec = sess.run(None, {"src": inp, "r1i": rec[0], "r2i": rec[1], "r3i": rec[2], "r4i": rec[3], "downsample_ratio": ds})
        a = (pha[0, 0] * 255).clip(0, 255).astype(np.uint8)
        fg = (fgr[0].transpose(1, 2, 0)[..., ::-1] * 255).clip(0, 255)
        # tepi: guna warna nyahcemar RVM
        w = np.clip((1 - a.astype(np.float32) / 255) * 4, 0, 1)[..., None]
        rgb = (rgb.astype(np.float32) * (1 - w) + fg * w).astype(np.uint8)
        a = clean_alpha(a)

        # median alfa 3 frame dalam syot yang sama
        pending.append([t, rgb, a])
        if len(pending) == 3:
            (ta, ra, aa), (tb, rb, ab), (tc, rc, ac) = pending
            if shot_of(ta) == shot_of(tb) == shot_of(tc):
                pending[1][2] = np.median(np.stack([aa, ab, ac]), axis=0).astype(np.uint8)
            emit(*pending.popleft())
        if t % 100 == 0:
            print("refine", t, round(time.time() - t0), stats, flush=True)
    while pending:
        emit(*pending.popleft())
    enc.stdin.close()
    enc.wait()
    print("done", round(time.time() - t0), stats, flush=True)


if __name__ == "__main__":
    run()
