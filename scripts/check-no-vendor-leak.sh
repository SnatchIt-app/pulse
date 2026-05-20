#!/usr/bin/env bash
# Fail the build if vendor identity leaks into PUBLIC surfaces.
# Scans built output (.next/) + static assets (public/) only.
# Source files under app/admin, lib/supabase, supabase/ may legitimately
# reference vendor data — it is RLS-gated and stripped from public projections.

set -euo pipefail

PATTERNS='miamiworldrental|miami world rental|\bmwr\b|avantio|provided by|partner property|third-party|external supplier'

TARGETS=()
[ -d .next ] && TARGETS+=(".next")
[ -d public ] && TARGETS+=("public")

if [ ${#TARGETS[@]} -eq 0 ]; then
  echo "check-no-vendor-leak: no build output found (.next/ missing). Run 'pnpm build' first."
  exit 0
fi

if grep -REilo "$PATTERNS" "${TARGETS[@]}" \
    --include='*.html' --include='*.js' --include='*.css' --include='*.json' \
    --include='*.txt' --include='*.xml' --include='*.svg' --include='*.webmanifest' \
    --include='*.rsc' 2>/dev/null; then
  echo ""
  echo "vendor-leak: FAIL — banned strings found in public build output."
  exit 1
fi

echo "vendor-leak: clean."
exit 0
