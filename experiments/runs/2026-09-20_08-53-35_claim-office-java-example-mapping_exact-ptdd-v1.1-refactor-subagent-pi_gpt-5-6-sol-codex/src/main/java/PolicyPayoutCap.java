final class PolicyPayoutCap {
    private static final int CAP_MULTIPLIER = 2;

    private int remaining;

    PolicyPayoutCap(int insuranceSum) {
        remaining = insuranceSum * CAP_MULTIPLIER;
    }

    int limitAndConsume(int desiredPayout) {
        int payout = Math.min(desiredPayout, remaining);
        remaining -= payout;
        return payout;
    }

    int remaining() {
        return remaining;
    }
}
