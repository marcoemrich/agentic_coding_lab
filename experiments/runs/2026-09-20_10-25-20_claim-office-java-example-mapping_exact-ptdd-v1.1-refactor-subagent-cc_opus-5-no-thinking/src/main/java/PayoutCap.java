/**
 * The most the MHPCO will pay out over the life of one policy -- twice the
 * insurance sum of the items it covers -- and what is left of it as the office
 * settles claims against that policy.
 *
 * This is the one place that decides the office's payout ceiling and how
 * claims consume it. Both are separate decisions from what the covered items
 * are insured for: the MHPCO may revalue the items it covers without changing
 * how far it will go beyond that value, may change how far it will go without
 * revaluing anything, and may change how a settled claim draws the ceiling
 * down -- a shared balance today, a per-incident sub-limit or a yearly reset
 * tomorrow -- without touching either.
 *
 * A cap is spent as the policy it belongs to is claimed against, so an
 * instance is mutable and belongs to exactly one policy.
 */
public final class PayoutCap {

    private static final int CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

    private final int capInG;

    private int remainingInG;

    private PayoutCap(int capInG) {
        this.capInG = capInG;
        this.remainingInG = capInG;
    }

    /**
     * The cap the MHPCO sets over a policy insuring this sum: twice it,
     * entirely unspent.
     */
    public static PayoutCap overInsuranceSum(int insuranceSumInG) {
        return new PayoutCap(CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSumInG);
    }

    /**
     * The whole ceiling, as the MHPCO set it when it issued the policy.
     * Claims settled since do not move it.
     */
    public int total() {
        return capInG;
    }

    /**
     * What the ceiling has left for further claims.
     */
    public int remaining() {
        return remainingInG;
    }

    /**
     * The office draws a settlement against the ceiling: it pays what the
     * claimant is owed only as far as the ceiling still reaches, and what it
     * pays is gone from the ceiling for good.
     */
    public int drawDown(int desiredPayoutInG) {
        int paid = Math.min(desiredPayoutInG, remainingInG);
        remainingInG -= paid;
        return paid;
    }
}
