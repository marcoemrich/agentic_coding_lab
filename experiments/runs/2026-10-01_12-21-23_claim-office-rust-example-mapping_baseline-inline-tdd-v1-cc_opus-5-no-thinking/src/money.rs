//! Amounts during a calculation are kept as exact fractions; only the final
//! premium or payout is rounded, always in the MHPCO's favour.

/// An exact amount in G, represented as hundredths to keep the percentage
/// modifiers (50 %, 30 %, 20 %, 15 %, 10 %, 50 % payout) exact.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Money(i64);

const SCALE: i64 = 100;

impl Money {
    pub fn from_g(whole: i64) -> Self {
        Self(whole * SCALE)
    }

    pub const ZERO: Self = Self(0);

    /// `percent` % of this amount, exact.
    pub fn percent(self, percent: i64) -> Self {
        Self(self.0 * percent / 100)
    }

    /// Rounds up: the MHPCO's favour for a premium it collects.
    pub fn round_up(self) -> i64 {
        self.0.div_euclid(SCALE) + i64::from(self.0.rem_euclid(SCALE) != 0)
    }

    /// Rounds down: the MHPCO's favour for a payout it owes.
    pub fn round_down(self) -> i64 {
        self.0.div_euclid(SCALE)
    }

    pub fn min(self, other: Self) -> Self {
        Self(self.0.min(other.0))
    }

    pub fn is_positive(self) -> bool {
        self.0 > 0
    }
}

impl std::ops::Add for Money {
    type Output = Self;
    fn add(self, other: Self) -> Self {
        Self(self.0 + other.0)
    }
}

impl std::ops::Sub for Money {
    type Output = Self;
    fn sub(self, other: Self) -> Self {
        Self(self.0 - other.0)
    }
}

impl std::iter::Sum for Money {
    fn sum<I: Iterator<Item = Self>>(iter: I) -> Self {
        iter.fold(Self::ZERO, |acc, m| acc + m)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// 197.5 G premium → 198 G.
    #[test]
    fn premium_rounds_up() {
        let amount = Money::from_g(395).percent(50);
        assert_eq!(amount.round_up(), 198);
    }

    /// 350.5 G payout → 350 G.
    #[test]
    fn payout_rounds_down() {
        let amount = Money::from_g(701).percent(50);
        assert_eq!(amount.round_down(), 350);
    }

    #[test]
    fn whole_amounts_are_unchanged_by_rounding() {
        assert_eq!(Money::from_g(165).round_up(), 165);
        assert_eq!(Money::from_g(400).round_down(), 400);
    }

    #[test]
    fn fractions_survive_intermediate_steps() {
        // 50 % of 165 G is 82.5 G; adding it back must give exactly 247.5 G,
        // which rounds up to 248 rather than from a prematurely rounded 83.
        let half = Money::from_g(165).percent(50);
        assert_eq!((Money::from_g(165) + half).round_up(), 248);
    }
}
