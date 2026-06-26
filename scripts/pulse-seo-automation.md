# Pulse Autonomous SEO Engine — launchd automation

This automation publishes one brand-new SEO journal article every 3 days,
entirely hands-off, from this Mac. It runs Claude Code non-interactively with
the Pulse Autonomous SEO Engine prompt, which researches a new keyword, writes
the article into `data/journal.ts`, runs `format:check` / `lint` / `build`, and
commits and pushes to `main` (which triggers a Vercel production deploy).

## Pieces

| File | Purpose |
| --- | --- |
| `scripts/run-pulse-seo.sh` | The runner. Sets up the environment, enforces the 3-day cadence, invokes Claude Code, and writes timestamped logs. |
| `~/Library/LaunchAgents/com.pulse.seo.articles.plist` | The launchd agent. Fires the runner daily at 09:00 local time. |
| `logs/pulse-seo.log` | Timestamped stdout of each run (gitignored). |
| `logs/pulse-seo-error.log` | Timestamped errors of each run (gitignored). |
| `logs/launchd-out.log` / `logs/launchd-error.log` | Raw launchd-level stdout/stderr (gitignored). |
| `logs/.last-run` | Cadence guard: Unix timestamp of the last successful run (gitignored). |

### How the schedule works

launchd cannot natively express "every 3 days at a fixed time"
(`StartCalendarInterval` is day-of-month / weekday based; `StartInterval` can't
anchor to a clock time). So the agent fires **daily at 09:00**, and the script
checks `logs/.last-run`: if fewer than 3 days have passed it logs a skip and
exits. The effective cadence is **once every 3 days at 9 AM local**. The guard
file is only advanced after a **successful** run, so a failed run retries the
next morning instead of waiting another 3 days.

> **Permissions note:** the runner calls Claude with
> `--dangerously-skip-permissions` so the unattended job never blocks on an
> interactive approval. This was explicitly chosen for full autonomy. It means
> the scheduled job can run arbitrary tool calls and push to `main` without a
> human in the loop. To dial this back later, swap the flag for
> `--permission-mode acceptEdits` plus a `.claude/settings.json` allowlist.

---

## Install the LaunchAgent

```bash
# Load it (modern API; survives reboot because it lives in ~/Library/LaunchAgents)
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.pulse.seo.articles.plist

# Confirm it's registered
launchctl list | grep com.pulse.seo.articles
```

If `bootstrap` reports it's already loaded, unload first (see below) then
re-bootstrap. On older macOS you can use the legacy equivalent:

```bash
launchctl load ~/Library/LaunchAgents/com.pulse.seo.articles.plist
```

## Unload / uninstall

```bash
# Stop and unregister the agent
launchctl bootout gui/$(id -u)/com.pulse.seo.articles

# (legacy equivalent)
launchctl unload ~/Library/LaunchAgents/com.pulse.seo.articles.plist

# To remove entirely, also delete the plist
rm ~/Library/LaunchAgents/com.pulse.seo.articles.plist
```

## Reload after editing the plist

```bash
launchctl bootout gui/$(id -u)/com.pulse.seo.articles 2>/dev/null
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.pulse.seo.articles.plist
```

---

## Manually test it

**Validate the plist syntax:**

```bash
plutil -lint ~/Library/LaunchAgents/com.pulse.seo.articles.plist
```

**Dry checks (no article created):** confirm the script path exists, is
executable, and parses:

```bash
ls -l "/Users/josetascon/Pulse exotics/Pulse exotics/pulse/scripts/run-pulse-seo.sh"
bash -n "/Users/josetascon/Pulse exotics/Pulse exotics/pulse/scripts/run-pulse-seo.sh"
```

**Force a real run now (this WILL create + push an article), bypassing the
3-day guard:**

```bash
"/Users/josetascon/Pulse exotics/Pulse exotics/pulse/scripts/run-pulse-seo.sh" --force
```

**Trigger it through launchd (respects the 3-day guard — only runs if due):**

```bash
launchctl kickstart -k gui/$(id -u)/com.pulse.seo.articles
```

> The normal cadence guard means a launchd-triggered run within 3 days of the
> last one will just log a skip. Use `--force` to override during testing.

---

## Check logs

```bash
cd "/Users/josetascon/Pulse exotics/Pulse exotics/pulse"

# Live tail of the main run log
tail -f logs/pulse-seo.log

# Errors only
tail -n 50 logs/pulse-seo-error.log

# launchd-level output (env / spawn problems show up here)
tail -n 50 logs/launchd-out.log logs/launchd-error.log

# When did it last successfully run? (Unix epoch seconds)
date -r "$(cat logs/.last-run)"
```

## Verify the latest commit pushed

```bash
cd "/Users/josetascon/Pulse exotics/Pulse exotics/pulse"

# Local vs remote should match after a successful run
git fetch origin
git log --oneline -1
git log --oneline -1 origin/main

# Tree should be clean and in sync
git status -sb

# Most recent article commits
git log --oneline -5 --grep="Add journal article"
```

If `origin/main` is behind local, the push step failed — check
`logs/pulse-seo-error.log`, confirm GitHub auth works
(`git push origin main` by hand), then re-run with `--force`.
