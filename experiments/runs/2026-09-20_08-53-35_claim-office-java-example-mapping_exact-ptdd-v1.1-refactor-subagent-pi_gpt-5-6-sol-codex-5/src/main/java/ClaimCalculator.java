final class ClaimCalculator {
    private ClaimCalculator() { }

    static int payout(Policy policy, Iterable<DamageEvent> damages) {
        int payout = 0;
        for (DamageEvent damage : damages) {
            payout += DamagePayout.forDamage(policy.coveredItemFor(damage), damage.amount());
        }
        return payout;
    }
}
