import java.util.List;

final class PolicyPayoutCap {
    private static final int INSURANCE_SUM_MULTIPLIER = 2;

    private int remaining;

    PolicyPayoutCap(List<String> itemTypes) {
        remaining = itemTypes.stream()
                .mapToInt(MhpcoPriceList::insuranceValue)
                .sum() * INSURANCE_SUM_MULTIPLIER;
    }

    int payUpTo(int desiredPayout) {
        int payout = Math.min(desiredPayout, remaining);
        remaining -= payout;
        return payout;
    }

    int remaining() {
        return remaining;
    }
}
