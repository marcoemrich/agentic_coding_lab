// The MHPCO keeps intermediate amounts as exact fractions and rounds only
// the final amount, always in its own favor. All spec rates are multiples of
// 1/20, so amounts travel as whole twentieths of a G.
export const RATE_UNIT = 20;

export function roundPremiumUp(twentieths: number): number {
  return Math.ceil(twentieths / RATE_UNIT);
}

export function roundPayoutDown(twentieths: number): number {
  return Math.floor(twentieths / RATE_UNIT);
}
