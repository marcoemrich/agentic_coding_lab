/**
 * The MHPCO's policy-wide modifiers, which depend on the customer's history
 * with the office and apply to the policy base premium.
 */
final class CustomerModifiers {

    private static final double FIRST_INSURANCE_SURCHARGE = 0.10;
    private static final double LOYALTY_DISCOUNT = 0.20;
    private static final int LOYALTY_YEARS = 2;
    private static final double FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

    private final Customer customer;
    private int contractsIssued;

    CustomerModifiers(Customer customer) {
        this.customer = customer;
    }

    /** The net rate by which the customer's history adjusts a policy base premium. */
    double netRate() {
        double rate = FIRST_INSURANCE_SURCHARGE;
        if (isLongStanding()) {
            rate -= LOYALTY_DISCOUNT;
        }
        if (contractsIssued > 0) {
            rate -= FOLLOW_UP_CONTRACT_DISCOUNT;
        }
        return rate;
    }

    void recordContract() {
        contractsIssued++;
    }

    private boolean isLongStanding() {
        return customer.yearsWithMHPCO() >= LOYALTY_YEARS;
    }
}
