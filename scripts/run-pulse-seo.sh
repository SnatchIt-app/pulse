#!/bin/bash
#
# run-pulse-seo.sh — Pulse Autonomous SEO Engine runner
#
# Invoked by the launchd agent com.pulse.seo.articles every day at 09:00 local
# time. A 3-day guard file (logs/.last-run) ensures the agent only actually
# runs once every 3 days, so the effective cadence is "every 3 days at 9 AM".
#
# It runs Claude Code non-interactively with the Pulse Autonomous SEO Engine
# prompt. Claude itself does the research, writing, integration, the
# format/lint/build checks, and the git add/commit/push to main — this script
# only sets up the environment, enforces the cadence, and captures timestamped
# logs.
#
# Manual run (ignores the 3-day guard):   scripts/run-pulse-seo.sh --force
#
set -uo pipefail

# ── Paths ──────────────────────────────────────────────────────────────────────
REPO="/Users/josetascon/Pulse exotics/Pulse exotics/pulse"
LOG_DIR="$REPO/logs"
LOG="$LOG_DIR/pulse-seo.log"
ERR="$LOG_DIR/pulse-seo-error.log"
STATE_FILE="$LOG_DIR/.last-run"

# launchd runs with a minimal environment, so resolve everything explicitly.
CLAUDE_BIN="/Users/josetascon/.local/bin/claude"
export HOME="/Users/josetascon"
export PATH="/Users/josetascon/.local/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# Cadence: only run if at least this many seconds have passed since the last
# successful run. 3 days = 259200 seconds.
MIN_INTERVAL=$((3 * 24 * 60 * 60))

# ── Helpers ────────────────────────────────────────────────────────────────────
now_ts() { date '+%Y-%m-%d %H:%M:%S'; }

# Append a single timestamped line to the main log.
log() { printf '[%s] %s\n' "$(now_ts)" "$*" >>"$LOG"; }

# Append a single timestamped line to the error log.
errlog() { printf '[%s] %s\n' "$(now_ts)" "$*" >>"$ERR"; }

# Read a captured file line-by-line and append timestamped lines to a target log.
stamp_into() {
  local src="$1" dest="$2"
  [ -s "$src" ] || return 0
  while IFS= read -r line || [ -n "$line" ]; do
    printf '[%s] %s\n' "$(now_ts)" "$line" >>"$dest"
  done <"$src"
}

mkdir -p "$LOG_DIR"

# ── Cadence guard ──────────────────────────────────────────────────────────────
FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

if [ "$FORCE" -ne 1 ] && [ -f "$STATE_FILE" ]; then
  last="$(cat "$STATE_FILE" 2>/dev/null || echo 0)"
  case "$last" in
    ''|*[!0-9]*) last=0 ;;
  esac
  now="$(date +%s)"
  elapsed=$((now - last))
  if [ "$elapsed" -lt "$MIN_INTERVAL" ]; then
    remaining=$(((MIN_INTERVAL - elapsed) / 3600))
    log "Skipping: last run was $((elapsed / 3600))h ago; next run in ~${remaining}h (3-day cadence)."
    exit 0
  fi
fi

# ── Repo + auth sanity ─────────────────────────────────────────────────────────
cd "$REPO" || { errlog "FATAL: cannot cd into repo: $REPO"; exit 1; }

if [ ! -x "$CLAUDE_BIN" ]; then
  errlog "FATAL: claude binary not found or not executable at $CLAUDE_BIN"
  exit 1
fi

log "==================================================================="
log "Pulse Autonomous SEO Engine — run started (force=$FORCE)"
log "Repo: $REPO"
log "Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
log "Claude: $("$CLAUDE_BIN" --version 2>/dev/null || echo unknown)"

# ── The recurring task: the Pulse Autonomous SEO Engine prompt ─────────────────
read -r -d '' PROMPT <<'PROMPT_EOF'
PULSE AUTONOMOUS SEO ENGINE

You are the autonomous SEO manager for the Pulse website. Your job is to grow
Pulse's organic search traffic and generate qualified leads. This run, publish
ONE brand-new production-ready article and complete the ENTIRE workflow
autonomously: research, write, integrate, verify, commit, push, deploy. Do not
ask for approval. Do not stop after writing. Complete the whole workflow.

BEFORE WRITING
Scan the entire repository. Read every existing journal article in
data/journal.ts plus the service pages, FAQ data, metadata, and sitemap. Build
an internal keyword map: for each published article note its title, slug,
primary keyword, secondary keywords, search intent, category, and related
services. Never duplicate a keyword. Never cannibalize an existing article.
Choose the highest-value high-intent keyword that has NOT yet been covered.

SEASONAL INTELLIGENCE
Pick a topic that fits the current calendar month and Pulse's real services:
Jan-Mar spring break / winter escapes; Apr-May Formula 1 / race week;
Jun-Jul World Cup / summer / international visitors; Aug-Sep vacation and family
travel; Oct-Nov Boat Show / holiday planning; Dec Art Basel / holidays / NYE.

WRITING STYLE
Write like a real Miami luxury concierge. Never sound like AI or generic
marketing. Never use em dashes or these words: curated, bespoke, elevated,
world-class, seamless, premium lifestyle, exclusive access, tailored
experiences, luxury redefined. No marketing fluff, no fake urgency, no fake
reviews, no fake inventory, no invented partnerships.

BRAND RULES
Pulse is an independent luxury mobility and concierge company. Pulse owns only
part of its vehicle fleet; many services are fulfilled through vetted partners.
Never imply ownership of jets, yachts, residences, restaurants, nightclubs, or
World Cup tickets. Never imply affiliation with FIFA. Use wording like "match
access requests", "travel planning", and "subject to availability".

ARTICLE REQUIREMENTS (1200-2000 words)
SEO title, meta description, slug, category, reading time, publish date, hero
heading, introduction, multiple H2 sections, FAQ, strong CTA, internal links,
Article schema, FAQ schema, breadcrumb schema. The journal system in
data/journal.ts is data-driven: adding one well-formed JournalArticle object
auto-registers the route, journal index, metadata, JSON-LD (Article + FAQ +
breadcrumb), and the sitemap entry. Set datePublished to today's date and add
the new article as the newest entry to keep chronological ordering.

INTERNAL LINKING
Link to at least 3 service pages, at least 2 previous journal articles, the
homepage where appropriate, and the relevant World Cup page when appropriate.

QUALITY CONTROL — do not stop until all three pass, fixing issues automatically:
  pnpm format:check
  pnpm lint
  pnpm build

GIT — once all checks pass, use existing local GitHub authentication:
  git add .
  git commit -m "Add journal article: [article title]"
  git push origin main
If push fails, diagnose, resolve, and retry until it succeeds. Only commit the
article source change; do not commit logs or temporary files.

Pushing to main triggers Vercel. Verify the push completed successfully.

Respond with a short final summary of the article published and the commit hash.
PROMPT_EOF

# ── Run Claude non-interactively ───────────────────────────────────────────────
# --dangerously-skip-permissions: required for unattended runs so tool calls
# (bash, git, edits) never block on an interactive permission prompt.
RUN_OUT="$(mktemp -t pulse-seo-out)"
RUN_ERR="$(mktemp -t pulse-seo-err)"

log "Invoking Claude Code (non-interactive)…"
"$CLAUDE_BIN" -p "$PROMPT" --dangerously-skip-permissions \
  >"$RUN_OUT" 2>"$RUN_ERR"
STATUS=$?

stamp_into "$RUN_OUT" "$LOG"
stamp_into "$RUN_ERR" "$ERR"
rm -f "$RUN_OUT" "$RUN_ERR"

# ── Outcome ────────────────────────────────────────────────────────────────────
if [ "$STATUS" -eq 0 ]; then
  date +%s >"$STATE_FILE"
  log "Run completed successfully (exit 0). HEAD: $(git rev-parse --short HEAD 2>/dev/null)"
  log "==================================================================="
else
  errlog "Run FAILED with exit code $STATUS. Cadence guard NOT advanced; will retry on next scheduled fire."
  log "Run FAILED with exit code $STATUS (see pulse-seo-error.log)."
  log "==================================================================="
fi

exit "$STATUS"
