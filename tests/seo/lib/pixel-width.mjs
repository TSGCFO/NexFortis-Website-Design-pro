// Approximates Seobility's pixel-width measurement for SERP titles &
// meta descriptions. Per-character width table for Verdana 11px.
//
// Calibration target: every row in fixtures/seobility-pixel-widths.json
// must be within its declared tolerance.
//
// Calibration notes (2026-04-25 audit):
//   title scale 1.57 — derived from 8 Seobility-measured title rows.
//   description scale 1.08 — derived from 3 Seobility-measured description rows.
//   '+' added to punctuation table (width 7, same as digits).
//   '→' added (width 9, same as &/G/O) — appears in qb.nexfortis.com service titles.

const WIDTHS = {
  // lowercase letters
  a: 7, b: 7, c: 6, d: 7, e: 7, f: 4, g: 7, h: 7, i: 3, j: 4, k: 7, l: 3, m: 11,
  n: 7, o: 7, p: 7, q: 7, r: 5, s: 6, t: 4, u: 7, v: 7, w: 9, x: 7, y: 7, z: 6,
  // uppercase letters
  A: 8, B: 8, C: 8, D: 9, E: 7, F: 7, G: 9, H: 9, I: 4, J: 5, K: 9, L: 7, M: 10,
  N: 9, O: 9, P: 8, Q: 9, R: 9, S: 8, T: 8, U: 9, V: 8, W: 12, X: 8, Y: 8, Z: 8,
  // digits & space
  "0": 7, "1": 7, "2": 7, "3": 7, "4": 7, "5": 7, "6": 7, "7": 7, "8": 7, "9": 7,
  " ": 4,
  // common punctuation
  ".": 4, ",": 4, "!": 4, "?": 7, ":": 4, ";": 4, "-": 4, "—": 11, "–": 7,
  "(": 4, ")": 4, "[": 4, "]": 4, "/": 4, "\\": 4, "&": 9, "@": 12,
  "'": 3, "\"": 5, "|": 4, "•": 5,
  "+": 7, "→": 9,
};

const FALLBACK = 7; // average for unmapped chars

const KINDS = {
  title: { scale: 1.57 },
  description: { scale: 1.08 },
};

/**
 * Approximates the pixel width Seobility reports for a SERP title or
 * meta description string.
 *
 * @param {string} text - The raw title or description string.
 * @param {'title'|'description'} kind - Which SERP element to measure.
 * @returns {number} Estimated pixel width (integer, rounded).
 * @throws {Error} When kind is not 'title' or 'description'.
 */
export function pixelWidth(text, kind) {
  if (!KINDS[kind]) throw new Error(`unknown kind: ${kind}`);
  const { scale } = KINDS[kind];
  let total = 0;
  for (const ch of text) total += WIDTHS[ch] ?? FALLBACK;
  return Math.round(total * scale);
}
