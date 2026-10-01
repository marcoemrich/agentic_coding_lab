//! Exact amounts in hundredths of a G.
//!
//! Every MHPCO modifier is a whole percentage of a whole-G amount, so
//! hundredths represent each intermediate amount exactly. Only the final
//! premium or payout is rounded, always in the MHPCO's favour.

/// One G, in hundredths.
const SCALE: i64 = 100;

/// An exact amount of money, held as hundredths of a G.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Amount(i64);

impl Amount {
    /// An amount of whole G.
    pub fn from_g(g: i64) -> Self {
        Amount(g * SCALE)
    }

    /// `percent` % of this amount, kept exact.
    pub fn percent(self, percent: i64) -> Self {
        Amount(self.0 * percent / SCALE)
    }

    /// Rounds up to whole G — the MHPCO's favour for a premium it collects.
    pub fn round_up_g(self) -> i64 {
        self.0.div_euclid(SCALE) + i64::from(self.0.rem_euclid(SCALE) != 0)
    }

    /// Rounds down to whole G — the MHPCO's favour for a payout it owes.
    pub fn round_down_g(self) -> i64 {
        self.0.div_euclid(SCALE)
    }
}

impl std::ops::Add for Amount {
    type Output = Self;
    fn add(self, other: Self) -> Self {
        Amount(self.0 + other.0)
    }
}

impl std::ops::Sub for Amount {
    type Output = Self;
    fn sub(self, other: Self) -> Self {
        Amount(self.0 - other.0)
    }
}

impl std::iter::Sum for Amount {
    fn sum<I: Iterator<Item = Self>>(iter: I) -> Self {
        Amount(iter.map(|a| a.0).sum())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_percentage_of_a_whole_amount_stays_exact() {
        assert_eq!(Amount::from_g(100).percent(50), Amount::from_g(50));
        assert_eq!(Amount::from_g(600).percent(30), Amount::from_g(180));
    }

    #[test]
    fn a_premium_is_rounded_up_in_the_offices_favour() {
        let half = Amount::from_g(395).percent(50);
        assert_eq!(half.round_up_g(), 198, "197.5 G becomes 198 G");
    }

    #[test]
    fn a_payout_is_rounded_down_in_the_offices_favour() {
        let half = Amount::from_g(701).percent(50);
        assert_eq!(half.round_down_g(), 350, "350.5 G becomes 350 G");
    }

    #[test]
    fn a_whole_amount_is_unchanged_by_rounding() {
        assert_eq!(Amount::from_g(165).round_up_g(), 165);
        assert_eq!(Amount::from_g(400).round_down_g(), 400);
    }

    #[test]
    fn amounts_add_and_subtract() {
        assert_eq!(Amount::from_g(100) + Amount::from_g(60), Amount::from_g(160));
        assert_eq!(Amount::from_g(160) - Amount::from_g(20), Amount::from_g(140));
    }
}
