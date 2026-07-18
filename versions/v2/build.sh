#!/bin/sh
# Builds the precompiled landing bundle for v2.
#
# Compiles the three landing JSX files (in the exact order index.html used to
# load them) into one minified plain-JS file, so visitors no longer download
# Babel or compile JSX in the browser. Cross-file references all go through
# window.* (window.Funnel, window.VideoTestimonials, ...), so minification
# renaming is safe.
#
# Run after editing any of the three JSX files:   sh build.sh
# Requires esbuild (brew install esbuild).
set -e
cd "$(dirname "$0")"

# Each file is compiled to its own IIFE, matching the per-file scope Babel
# Standalone gave them (they each declare e.g. `const { useState } = React`,
# and share things across files only via explicit window.* exports).
: > .bundle.tmp.js
for f in testimonials-faq.jsx funnel-app.jsx app.jsx; do
  esbuild "$f" --minify --target=es2017 --format=iife >> .bundle.tmp.js
done
mv .bundle.tmp.js app.v2.min.js

# Stamp the build version into index.html so browsers/CDN pick up the new
# bundle immediately (replaces the old Date.now() cache-buster, which
# disabled caching entirely).
V=$(date +%Y%m%d%H%M)
perl -pi -e "s/\\?v=NBBUILD[0-9]*/?v=NBBUILD$V/g" index.html
echo "Built app.v2.min.js ($(wc -c < app.v2.min.js | tr -d ' ') bytes), stamped v=NBBUILD$V"
echo "Reminder: ghl-pages/landing-page.html carries its own ?v= stamp — update it when re-pasting into GHL."
