"""Pengesan kapsyen/teks terbakar dalam video asal (warna + kestabilan masa + bayang gelap)."""
import cv2, numpy as np, subprocess
import os
import imageio_ffmpeg
F=imageio_ffmpeg.get_ffmpeg_exe()
S=os.environ.get("CUTOUT_WORK", "cutout-work")  # mesti ada ref.mp4 & models/rvm.onnx
W,H=1080,1920
K=4
def frames():
    p=subprocess.Popen([F,'-v','error','-i',f'{S}/ref.mp4','-f','rawvideo','-pix_fmt','bgr24','-'],stdout=subprocess.PIPE)
    while True:
        b=p.stdout.read(W*H*3)
        if len(b)<W*H*3: return
        yield np.frombuffer(b,np.uint8).reshape(H,W,3)

def color_cand(img):
    b,g,r=[img[...,i].astype(np.int16) for i in range(3)]
    mn=np.minimum(np.minimum(b,g),r); mx=np.maximum(np.maximum(b,g),r)
    white=(mn>222)&(mx-mn<28)
    yellow=(r>185)&(g>155)&(b<120)&(r-b>90)
    hsv=cv2.cvtColor(img,cv2.COLOR_BGR2HSV)
    h,s,v=hsv[...,0],hsv[...,1],hsv[...,2]
    icon=(s>110)&(v>90)&(((h>=80)&(h<=130)))  # cyan/biru ikon
    return white|yellow|icon

def static(buf, t):
    # stabil jika sama dengan jiran sebelah belakang ATAU hadapan
    cur=buf[t].astype(np.int16)
    def ok(idx):
        m=np.ones(cur.shape[:2],bool)
        for j in idx:
            m&=np.abs(buf[j].astype(np.int16)-cur).max(axis=2)<14
        return m
    back=ok(range(max(0,t-K),t)) if t>0 else np.zeros(cur.shape[:2],bool)
    fwd=ok(range(t+1,min(len(buf),t+K+1))) if t<len(buf)-1 else np.zeros(cur.shape[:2],bool)
    return back|fwd

def icon_mask(img, st):
    b,g,r=[img[...,i].astype(np.int16) for i in range(3)]
    hsv=cv2.cvtColor(img,cv2.COLOR_BGR2HSV)
    h,s,v=hsv[...,0].astype(np.int16),hsv[...,1],hsv[...,2]
    navy=(b-r>30)&(b-g>5)&(v<150)&st
    navy=cv2.morphologyEx(navy.astype(np.uint8),cv2.MORPH_OPEN,np.ones((2,2),np.uint8))
    n,lab,sts,_=cv2.connectedComponentsWithStats(navy,8)
    keep=np.zeros(n,bool); keep[1:]=sts[1:,cv2.CC_STAT_AREA]>=150  # garis luar ikon ialah komponen besar
    navy=keep[lab]
    if not navy.any(): return np.zeros(img.shape[:2],np.uint8)
    # isi bentuk ikon: kawasan tertutup oleh garis luar + warna ikon statik berhampiran
    near=cv2.dilate(navy.astype(np.uint8),np.ones((25,25),np.uint8))>0
    colorful=((s>70)|(np.minimum(np.minimum(b,g),r)>200))&st
    m=(navy|(colorful&near)).astype(np.uint8)
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(21,21)))
    cnts,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    out=np.zeros_like(m)
    for c in cnts:
        if cv2.contourArea(c)>600: cv2.drawContours(out,[c],-1,1,-1)
    return out

def mask_for(buf,t):
    img=buf[t]
    st=static(buf,t)
    icons=icon_mask(img,st)
    cand=color_cand(img)&st
    v=img.max(axis=2)
    dark=(v<85)
    near_dark=cv2.dilate(dark.astype(np.uint8),np.ones((9,9),np.uint8))>0
    m=cand&near_dark
    # buang titik terpencil, sambung glif
    m=cv2.morphologyEx(m.astype(np.uint8),cv2.MORPH_OPEN,np.ones((2,2),np.uint8))
    n,lab,st,_=cv2.connectedComponentsWithStats(m,8)
    keep=np.zeros(n,bool); keep[1:]=st[1:,cv2.CC_STAT_AREA]>=25
    m=keep[lab].astype(np.uint8)
    # tutup lubang glif + tutup bayang
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((7,7),np.uint8))
    m=cv2.dilate(m|icons,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(13,13)))
    return m


def icons(img):
    b, g, r = [img[..., i].astype(np.int16) for i in range(3)]
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v = hsv[..., 0].astype(np.int16), hsv[..., 1], hsv[..., 2]
    navy = ((b - r > 30) & (b - g > 5) & (v < 150)).astype(np.uint8)
    cyan = ((h >= 80) & (h <= 105) & (s > 120) & (v > 120)).astype(np.uint8)
    seed = cv2.morphologyEx(navy | cyan, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(seed, 8)
    keep = np.zeros(n, bool); keep[1:] = st[1:, cv2.CC_STAT_AREA] >= 150
    seed = keep[lab]
    if not seed.any(): return np.zeros((H, W), np.uint8)
    near = cv2.dilate(seed.astype(np.uint8), np.ones((25, 25), np.uint8)) > 0
    colorful = (s > 70) | (np.minimum(np.minimum(b, g), r) > 200)
    # garisan "deringan" krim di sekeliling ikon
    far = cv2.dilate(seed.astype(np.uint8), np.ones((121, 121), np.uint8)) > 0
    cream = (r > 235) & (g > 222) & (r - b > 18) & (g - b > 10) & far
    m = (seed | (colorful & near) | cream).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (21, 21)))
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    out = np.zeros_like(m)
    for c in cnts:
        if cv2.contourArea(c) > 600: cv2.drawContours(out, [c], -1, 1, -1)
    out |= cream.astype(np.uint8)
    return out
