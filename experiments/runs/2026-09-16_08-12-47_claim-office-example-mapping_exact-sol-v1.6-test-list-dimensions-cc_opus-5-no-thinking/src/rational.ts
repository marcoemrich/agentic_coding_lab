/** Exact non-decimal arithmetic: MHPCO keeps intermediate amounts as fractions. */
export interface Rational {
  readonly numerator: bigint;
  readonly denominator: bigint;
}

export function rational(numerator: number | bigint, denominator: number | bigint = 1): Rational {
  return { numerator: BigInt(numerator), denominator: BigInt(denominator) };
}

export function add(left: Rational, right: Rational): Rational {
  return {
    numerator: left.numerator * right.denominator + right.numerator * left.denominator,
    denominator: left.denominator * right.denominator,
  };
}

export function multiply(left: Rational, right: Rational): Rational {
  return {
    numerator: left.numerator * right.numerator,
    denominator: left.denominator * right.denominator,
  };
}

export function subtract(left: Rational, right: Rational): Rational {
  return add(left, { numerator: -right.numerator, denominator: right.denominator });
}

/** Rounds down to a whole G -- the MHPCO's favor when it pays out. */
export function roundDown(value: Rational): number {
  const quotient = value.numerator / value.denominator;
  const hasRemainder = value.numerator % value.denominator !== 0n;
  return Number(hasRemainder && value.numerator < 0n ? quotient - 1n : quotient);
}

/** Rounds up to a whole G -- the MHPCO's favor when it charges a premium. */
export function roundUp(value: Rational): number {
  const quotient = value.numerator / value.denominator;
  const hasRemainder = value.numerator % value.denominator !== 0n;
  return Number(hasRemainder ? quotient + 1n : quotient);
}
