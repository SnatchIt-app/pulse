// Shared date validation + normalization. Safe for both client and server use
// (no "server-only" import). All date strings are YYYY-MM-DD; lexicographic
// comparison of that format is equivalent to chronological comparison.
//
// Business timezone is Miami (Eastern). Validating "tomorrow" in this zone keeps
// the public date pickers and server-side checks in agreement.

export const BUSINESS_TZ = "America/New_York";

const YMD = /^\d{4}-\d{2}-\d{2}$/;

function ymdInTZ(date: Date, tz: string): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Today as YYYY-MM-DD in the business timezone. */
export function todayISO(tz: string = BUSINESS_TZ): string {
  return ymdInTZ(new Date(), tz);
}

/** Tomorrow as YYYY-MM-DD in the business timezone — the minimum allowed date. */
export function tomorrowISO(tz: string = BUSINESS_TZ): string {
  const [y, m, d] = todayISO(tz).split("-").map(Number) as [number, number, number];
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + 1);
  return dt.toISOString().slice(0, 10);
}

/** True when the string is a real calendar date in strict YYYY-MM-DD form. */
export function isValidYMD(value: string): boolean {
  if (!YMD.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number) as [number, number, number];
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/**
 * Normalize a possibly-empty/whitespace date input to a clean YYYY-MM-DD string
 * or null. Guarantees Postgres date columns never receive "" or whitespace.
 */
export function normalizeDate(value: string | null | undefined): string | null {
  if (value == null) return null;
  const t = value.trim();
  return t.length > 0 ? t : null;
}

/** True when value is a valid date on or after tomorrow (business tz). */
export function isFutureDate(value: string, tz: string = BUSINESS_TZ): boolean {
  if (!isValidYMD(value)) return false;
  return value >= tomorrowISO(tz);
}

/** True when end is strictly after start. Both must be YYYY-MM-DD. */
export function isAfter(end: string, start: string): boolean {
  return end > start;
}

// ─── Spec-named aliases / combined validator ───────────────────────────────────

/** Tomorrow as YYYY-MM-DD in the business timezone (min selectable date). */
export function getTomorrowDateString(tz: string = BUSINESS_TZ): string {
  return tomorrowISO(tz);
}

/** Trim + coerce blank/whitespace to null so date columns never receive "". */
export function normalizeDateOrNull(value: string | null | undefined): string | null {
  return normalizeDate(value);
}

/**
 * Validate a start/end date pair. Returns a user-friendly error message, or null
 * when valid. Each present date must be a real calendar date in the future
 * (tomorrow or later), and end must fall strictly after start.
 * Used by both the public form and the API so the rules cannot diverge.
 */
export function validateDateRange(
  start: string | null,
  end: string | null,
  tz: string = BUSINESS_TZ,
): string | null {
  if (start !== null) {
    if (!isValidYMD(start)) return "Please select a valid date.";
    if (!isFutureDate(start, tz)) return "Please select a future date.";
  }
  if (end !== null) {
    if (!isValidYMD(end)) return "Please select a valid date.";
    if (!isFutureDate(end, tz)) return "Please select a future date.";
  }
  if (start !== null && end !== null && !isAfter(end, start)) {
    return "End date must be after the start date.";
  }
  return null;
}
