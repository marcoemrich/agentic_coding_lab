//! Exact money amounts in G.
//!
//! Intermediate amounts during a calculation are kept as fractions; only the
//! final premium or payout is rounded, and always in the MHPCO's favor. Every
//! amount in this kata is a whole number of G scaled by whole percentages, so
//! a fixed denominator of hundredths represents all of them exactly.

use std::ops::{Add, Sub};

const SCALE: i128 = 100;

/// An amount of G held as an exact number of hundredths.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Amount {
    hundredths: i128,
}

impl Amount {
    /// The amount of exactly `g` whole G.
    pub fn whole(g: i128) -> Self {
        Self {
            hundredths: g * SCALE,
        }
    }

    /// Zero G.
    pub fn zero() -> Self {
        Self { hundredths: 0 }
    }

    /// `percent` % of this amount, exactly.
    pub fn percent(self, percent: i128) -> Self {
        Self {
            hundredths: self.hundredths * percent / SCALE,
        }
    }

    /// Rounded up to whole G — the MHPCO's favor for a premium.
    pub fn round_up(self) -> i128 {
        self.hundredths.div_euclid(SCALE)
            + i128::from(self.hundredths.rem_euclid(SCALE) != 0)
    }

    /// Rounded down to whole G — the MHPCO's favor for a payout.
    pub fn round_down(self) -> i128 {
        self.hundredths.div_euclid(SCALE)
    }

    /// The smaller of two amounts.
    pub fn min(self, other: Self) -> Self {
        if self <= other { self } else { other }
    }

    /// This amount, or zero if it is negative.
    pub fn clamp_to_zero(self) -> Self {
        if self.hundredths < 0 {
            Self::zero()
        } else {
            self
        }
    }
}

impl Add for Amount {
    type Output = Self;

    fn add(self, rhs: Self) -> Self {
        Self {
            hundredths: self.hundredths + rhs.hundredths,
        }
    }
}

impl Sub for Amount {
    type Output = Self;

    fn sub(self, rhs: Self) -> Self {
        Self {
            hundredths: self.hundredths - rhs.hundredths,
        }
    }
}
