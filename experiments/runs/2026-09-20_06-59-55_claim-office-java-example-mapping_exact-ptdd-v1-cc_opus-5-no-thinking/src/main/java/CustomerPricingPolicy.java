/**
 * MHPCO's policy-wide premium modifiers for one customer: the loyalty discount for long-standing
 * customers, the initial assessment surcharge on every new insurance, and the discount granted on
 * each contract after the customer's first.
 */
final class CustomerPricingPolicy {

    private static final double INITIAL_ASSESSMENT_SURCHARGE = 0.10;
    private static final double LOYALTY_DISCOUNT = 0.20;
    private static final int LOYALTY_YEARS = 2;
    private static final double FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

    private final int yearsWithMhpco;
    private int contractsSoFar;

    CustomerPricingPolicy(int yearsWithMhpco) {
        this.yearsWithMhpco = yearsWithMhpco;
    }

    /** The net rate applied to a policy base premium, positive for a surcharge. */
    double netRate() {
        double rate = INITIAL_ASSESSMENT_SURCHARGE;
        if (isLongStanding()) {
            rate -= LOYALTY_DISCOUNT;
        }
        if (hasEarlierContract()) {
            rate -= FOLLOW_UP_CONTRACT_DISCOUNT;
        }
        return rate;
    }

    void recordContract() {
        contractsSoFar++;
    }

    private boolean isLongStanding() {
        return yearsWithMhpco >= LOYALTY_YEARS;
    }

    private boolean hasEarlierContract() {
        return contractsSoFar > 0;
    }
}
