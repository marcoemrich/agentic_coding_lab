import java.math.BigDecimal;

/**
 * The limit on everything a policy will ever pay out, and how much of it is
 * left. The office caps a policy at twice the insurance sum of the items it
 * covers.
 *
 * What the cap is worth and what it has left are one decision revised on its
 * own schedule: a revision to the multiple, or one that let the cap replenish,
 * is this cap's business and touches no claim rule. Premium modifiers are no
 * part of it, which is why a cap is opened from an insurance sum and never from
 * a premium.
 */
class PayoutCap {

    private static final BigDecimal CAP_MULTIPLE_OF_INSURANCE_SUM = new BigDecimal("2");

    private BigDecimal remaining;

    static PayoutCap forInsuranceSum(BigDecimal insuranceSum) {
        return new PayoutCap(insuranceSum.multiply(CAP_MULTIPLE_OF_INSURANCE_SUM));
    }

    private PayoutCap(BigDecimal remaining) {
        this.remaining = remaining;
    }

    /** Pays what the cap still allows of a desired payout and consumes that much of it. */
    BigDecimal pay(BigDecimal desiredPayout) {
        BigDecimal paid = desiredPayout.min(remaining);
        remaining = remaining.subtract(paid);
        return paid;
    }

    BigDecimal remaining() {
        return remaining;
    }
}
