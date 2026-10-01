//! Exact fractional amounts in G, rounded only at the very end.
//!
//! The MHPCO rounds in its own favour: premiums up, payouts down.

use std::ops::{Add, Mul, Sub};

/// An amount in G kept as an exact fraction with a fixed denominator.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Amount(i64);

/// Scaling factor. Surcharges and discounts are percentages, so hundredths suffice.
const SCALE: i64 = 100;

impl Amount {
    pub const ZERO: Amount = Amount(0);

    /// An amount of whole G.
    pub fn whole(g: i64) -> Amount {
        Amount(g * SCALE)
    }

    /// `percent` % of this amount.
    pub fn percent(self, percent: i64) -> Amount {
        Amount(self.0 * percent / SCALE)
    }

    /// Half of this amount — the high-enchantment reimbursement clause.
    pub fn half(self) -> Amount {
        Amount(self.0 / 2)
    }

    /// Rounds up, as the MHPCO does for premiums.
    pub fn round_up(self) -> i64 {
        self.0.div_euclid(SCALE) + i64::from(self.0.rem_euclid(SCALE) != 0)
    }

    /// Rounds down, as the MHPCO does for payouts.
    pub fn round_down(self) -> i64 {
        self.0.div_euclid(SCALE)
    }

    /// This amount, or zero if it is negative.
    pub fn clamp_to_zero(self) -> Amount {
        Amount(self.0.max(0))
    }
}

impl Add for Amount {
    type Output = Amount;
    fn add(self, other: Amount) -> Amount {
        Amount(self.0 + other.0)
    }
}

impl Sub for Amount {
    type Output = Amount;
    fn sub(self, other: Amount) -> Amount {
        Amount(self.0 - other.0)
    }
}

impl Mul<i64> for Amount {
    type Output = Amount;
    fn mul(self, factor: i64) -> Amount {
        Amount(self.0 * factor)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn whole_amounts_round_to_themselves() {
        assert_eq!(Amount::whole(160).round_up(), 160);
        assert_eq!(Amount::whole(160).round_down(), 160);
    }

    #[test]
    fn a_premium_of_197_point_5_g_rounds_up_to_198() {
        let premium = Amount::whole(395).half();
        assert_eq!(premium.round_up(), 198);
    }

    #[test]
    fn a_payout_of_350_point_5_g_rounds_down_to_350() {
        let payout = Amount::whole(701).half();
        assert_eq!(payout.round_down(), 350);
    }

    #[test]
    fn percentages_are_kept_as_fractions_until_rounded() {
        // 25 G at 50 % is 12.5 G; two of them are the whole 25 G back.
        let half_of_25 = Amount::whole(25).percent(50);
        assert_eq!((half_of_25 + half_of_25).round_up(), 25);
    }

    #[test]
    fn subtraction_can_go_negative_and_clamps_to_zero() {
        let remainder = Amount::whole(50) - Amount::whole(120);
        assert_eq!(remainder.clamp_to_zero(), Amount::ZERO);
    }
}
