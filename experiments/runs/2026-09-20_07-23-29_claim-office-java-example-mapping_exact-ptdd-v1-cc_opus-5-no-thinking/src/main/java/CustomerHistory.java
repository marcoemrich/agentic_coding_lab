/**
 * A customer's standing with the MHPCO, and the modifiers it earns: the
 * loyalty discount, the initial assessment surcharge, and the discount on
 * every contract after the first.
 */
public final class CustomerHistory {

    private static final double FIRST_INSURANCE_SURCHARGE = 0.10;
    private static final double LOYALTY_DISCOUNT = 0.20;
    private static final int LOYALTY_YEARS = 2;
    private static final double FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

    private final int yearsWithMhpco;
    private int contractsSoFar;

    public CustomerHistory(int yearsWithMhpco) {
        this.yearsWithMhpco = yearsWithMhpco;
    }

    /** The net rate applied to a policy's base premium, and records the contract. */
    public double modifierRateForNextContract() {
        double rate = FIRST_INSURANCE_SURCHARGE;
        if (isLongStanding()) {
            rate -= LOYALTY_DISCOUNT;
        }
        if (contractsSoFar > 0) {
            rate -= FOLLOW_UP_CONTRACT_DISCOUNT;
        }
        contractsSoFar++;
        return rate;
    }

    private boolean isLongStanding() {
        return yearsWithMhpco >= LOYALTY_YEARS;
    }
}
