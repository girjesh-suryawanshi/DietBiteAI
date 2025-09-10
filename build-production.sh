#!/bin/bash
# Custom build script for production that fixes import.meta.dirname issue

echo "Building client with Vite..."
vite build

echo "Building server with esbuild (fixing import.meta.dirname)..."
esbuild server/index.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=dist \
  --define:import.meta.dirname='"/app"'

echo "Build completed successfully!"