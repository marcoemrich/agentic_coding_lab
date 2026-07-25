const FLOAT_NOISE_PRECISION = 1e6;

// Floating-point arithmetic can leave tiny noise (e.g. 350.49999999999994
// instead of 350.5) that would push a subsequent floor/ceil to the wrong
// side of a whole number. Rounding to a fixed precision first removes
// that noise before the caller applies its own directional rounding.
export const avoidFloatNoise = (amount: number): number =>
  Math.round(amount * FLOAT_NOISE_PRECISION) / FLOAT_NOISE_PRECISION;
