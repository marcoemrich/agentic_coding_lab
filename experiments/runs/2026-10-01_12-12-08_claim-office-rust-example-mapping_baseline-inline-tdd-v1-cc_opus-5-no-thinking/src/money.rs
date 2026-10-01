/// All money is kept in hundredths of G during a calculation, so the whole-G
/// rounding happens exactly once, at the very end.
pub const CENTS: i64 = 100;

/// Rounding in the MHPCO's favour: premiums go up.
pub fn round_up(cents: i64) -> i64 {
    cents.div_euclid(CENTS) + i64::from(cents.rem_euclid(CENTS) != 0)
}

/// Rounding in the MHPCO's favour: payouts go down.
pub fn round_down(cents: i64) -> i64 {
    cents.div_euclid(CENTS)
}
