"""
Buang latar video talking-head V3 dan padam kapsyen/ikon asal yang terbakar.

  pip install onnxruntime opencv-python-headless imageio-ffmpeg numpy
  mkdir -p cutout-work/models
  cp public/ref/hilang-gigi-asal.mp4 cutout-work/ref.mp4
  curl -L -o cutout-work/models/rvm.onnx \
    https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.onnx
  CUTOUT_WORK=cutout-work python3 tools/cutout/process.py
  cp cutout-work/fg.webm public/ref/hilang-gigi-fg.webm

Pass 1: mask kapsyen/ikon setiap frame.  Pass 2: inpaint, matting RVM pada frame
yang telah dibersihkan, encode WebM VP9 dengan saluran alfa.
"""
import cv2, numpy as np, subprocess, sys, time, os
sys.path.insert(0, os.path.dirname(__file__))
from capmask import frames, static, color_cand, icons, K, F, S, W, H

SKIP = [(511, 613), (735, 995)]          # panel & klip doktor stok: tidak dipotong
NOMASK = [(126, 134), (613, 620)]        # frame peralihan/kilat kuning
TD = 6                                    # pelebaran mask merentas masa
os.makedirs(f"{S}/mask", exist_ok=True)
inr = lambda t, rs: any(a <= t < b for a, b in rs)

def text(img, st):
    b, g, r = [img[..., i].astype(np.int16) for i in range(3)]
    yellow = (r > 170) & (g > 140) & (b < 110) & (r - b > 80)
    near_dark = cv2.dilate((img.max(axis=2) < 85).astype(np.uint8), np.ones((9, 9), np.uint8)) > 0
    cand = (color_cand(img) & st & near_dark) | yellow
    m = cv2.morphologyEx(cand.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    n, lab, sts, _ = cv2.connectedComponentsWithStats(m, 8)
    keep = np.zeros(n, bool); keep[1:] = sts[1:, cv2.CC_STAT_AREA] >= 25
    return cv2.morphologyEx(keep[lab].astype(np.uint8), cv2.MORPH_CLOSE, np.ones((7, 7), np.uint8))

# ---- pass 1: mask mentah ----
t0 = time.time(); buf = []; start = 0

MASK_FROM = int(os.environ.get("MASK_FROM", "0"))
def do(t):
    if t < MASK_FROM and os.path.exists(f"{S}/mask/{t:04d}.png"): return
    j = t - start
    img = buf[j]
    if inr(t, SKIP) or inr(t, NOMASK): m = np.zeros((H, W), np.uint8)
    else: m = text(img, static(buf, j)) | icons(img)
    cv2.imwrite(f"{S}/mask/{t:04d}.png", m * 255)

N = 0
for f in frames():
    buf.append(f); N += 1
    if len(buf) > 2 * K + 1: buf.pop(0); start += 1
    t = N - 1 - K
    if t >= 0: do(t)
for t in range(max(0, N - K), N): do(t)
print("pass1", N, round(time.time() - t0), flush=True)

# ---- pass 2: inpaint seluruh frame, matting semula pada frame bersih, encode RGBA ----
import onnxruntime as ort
sess = ort.InferenceSession(f"{S}/models/rvm.onnx", providers=["CPUExecutionProvider"])
z = lambda: np.zeros([1, 1, 1, 1], np.float32)
rec = [z(), z(), z(), z()]
ds = np.array([0.25], np.float32)
CUTS = {131, 207, 304, 363, 511, 613, 735, 893, 995}
enc = subprocess.Popen([F, "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{H}", "-r", "30", "-i", "-",
    "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "26", "-deadline", "good", "-cpu-used", "4", "-row-mt", "1",
    "-auto-alt-ref", "0", f"{S}/fg.webm"], stdin=subprocess.PIPE)
INSERTS = [(161, 206), (271, 359), (386, 429)]
TOPCUT = 800
ref_a = np.zeros((H, W), np.uint8)
masks = {}
def mask(t):
    if t not in masks: masks[t] = cv2.imread(f"{S}/mask/{t:04d}.png", 0)
    return masks[t]
ell = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))
for t, img in enumerate(frames()):
    if t in CUTS: rec = [z(), z(), z(), z()]
    if inr(t, SKIP):
        enc.stdin.write(np.zeros((H, W, 4), np.uint8).tobytes()); continue
    m = np.zeros((H, W), np.uint8)
    for k in range(max(0, t - TD), min(N, t + TD + 1)):
        if not (inr(k, SKIP) or inr(k, NOMASK)): m |= mask(k)
    rgb = cv2.inpaint(img, cv2.dilate(m, ell), 5, cv2.INPAINT_TELEA) if m.any() else img
    src = rgb[..., ::-1].astype(np.float32).transpose(2, 0, 1)[None] / 255
    fgr, pha, *rec = sess.run(None, {"src": src, "r1i": rec[0], "r2i": rec[1], "r3i": rec[2], "r4i": rec[3], "downsample_ratio": ds})
    a = (pha[0, 0] * 255).clip(0, 255).astype(np.uint8)
    # sisipan foto close-up di atas: jangan biar muka dalam foto jadi "orang"
    if any(s0 <= t < e0 for s0, e0 in INSERTS):
        cap = cv2.dilate(ref_a, np.ones((31, 31), np.uint8))
        a[:TOPCUT] = np.minimum(a[:TOPCUT], cap[:TOPCUT])
    elif any(t == s0 - 1 for s0, e0 in INSERTS):
        ref_a = a.copy()
    masks.pop(t - TD - 1, None)
    enc.stdin.write(np.dstack([rgb, a]).tobytes())
    if t % 100 == 0: print("pass2", t, round(time.time() - t0), flush=True)
enc.stdin.close(); enc.wait()
print("done", round(time.time() - t0))
