#!/bin/sh
# Bersihkan suara video asal V3 -> public/v3/voice.wav
# (high-pass, denoise ringan, EQ kejelasan, kompresor lembut)
set -e
cd "$(dirname "$0")/.."
ffmpeg -v error -y -i public/v3/source.mp4 -vn \
  -af "highpass=f=85,afftdn=nf=-32:nr=8,equalizer=f=280:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1.4:g=2.5,equalizer=f=9500:t=h:g=1.5,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,alimiter=limit=0.9" \
  -ar 48000 public/v3/voice.wav
