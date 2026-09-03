/** How many decimals a number carries, exponent notation included (`1e-3` is 3). */
function decimals(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const text = String(value).toLowerCase();
  const exponentAt = text.indexOf('e');
  const mantissa = exponentAt === -1 ? text : text.slice(0, exponentAt);
  const exponent = exponentAt === -1 ? 0 : Number(text.slice(exponentAt + 1));
  const dotAt = mantissa.indexOf('.');
  const fraction = dotAt === -1 ? 0 : mantissa.length - dotAt - 1;
  return Math.max(0, fraction - exponent);
}

/** Above this the rounding is noise — 12 decimals is well past any step a control is given. */
const MAX_PLACES = 12;

function round(value: number, places: number): number {
  return Number.parseFloat(value.toFixed(Math.min(MAX_PLACES, places)));
}

/**
 * Add `delta` to `value`, rounded to the precision the two of them imply.
 *
 * A stepper that adds its raw step walks off the values it was given: `0.1 + 0.1 + 0.1` is
 * `0.30000000000000004` in binary floating point, so eight presses of `+0.1` land on a number
 * nobody asked for — and under a form binding that drift is written straight into the model.
 * The precision comes from `value` as well as `delta`, so a hand-typed `1.32` stepped by `1`
 * becomes `2.32` rather than being truncated to `2`.
 */
export function buiStep(value: number, delta: number): number {
  return round(value + delta, Math.max(decimals(value), decimals(delta)));
}

/**
 * Snap `value` onto the nearest `min + n * step`, with the same rounding as {@link buiStep} —
 * `Math.round(raw / step) * step` reintroduces the dust it was meant to remove
 * (`7 * 0.1` is `0.7000000000000001`).
 */
export function buiSnap(value: number, min: number, step: number): number {
  if (step <= 0) {
    return value;
  }
  return round(
    min + Math.round((value - min) / step) * step,
    Math.max(decimals(min), decimals(step)),
  );
}
