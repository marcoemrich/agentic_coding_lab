final class PolicyPayoutCap {
    private static final int INSURANCE_SUM_MULTIPLIER = 2;
    private int remaining;

    PolicyPayoutCap(Iterable<InsuredItem> items) {
        remaining = InsuranceSum.forItems(items) * INSURANCE_SUM_MULTIPLIER;
    }

    int remaining() {
        return remaining;
    }

    int settle(int desiredPayout) {
        int payout = Math.min(desiredPayout, remaining);
        remaining -= payout;
        return payout;
    }
}
