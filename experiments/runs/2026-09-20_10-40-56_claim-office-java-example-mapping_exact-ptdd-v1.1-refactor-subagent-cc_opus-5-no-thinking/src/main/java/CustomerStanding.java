import java.util.Arrays;
import java.util.List;

/**
 * The facts about a customer's standing with the MHPCO that bear on a premium,
 * and what each is worth.
 *
 * <p>Each constant knows one fact: how to tell whether it holds of a customer
 * at a given point in their dealings, and the percentage of the policy base
 * premium the MHPCO levies or grants for it. A surcharge is a positive rate, a
 * discount a negative one, so a standing's worth is always signed the way it
 * moves the premium.
 *
 * <p>Knows nothing about how the facts of a quote are added up, nor about the
 * item-specific risk surcharges, which are measured against the base premium of
 * a single item rather than of the whole policy.
 *
 * <p>Grows whenever the MHPCO recognises a new fact about a customer's
 * standing; a constant changes whenever the MHPCO revises that fact's rate or
 * the condition under which it holds.
 */
enum CustomerStanding {

    /**
     * Every quote is an initial assessment: each item of a quote is treated as
     * a first insurance, whatever the customer's history.
     */
    FIRST_INSURANCE(10) {
        @Override
        boolean holdsOf(Customer customer, int precedingContracts) {
            return true;
        }
    },

    /**
     * The MHPCO reads "long-standing" inclusively: a customer at exactly the
     * threshold already qualifies.
     */
    LOYALTY(-20) {
        private static final int LOYALTY_FROM_YEARS = 2;

        @Override
        boolean holdsOf(Customer customer, int precedingContracts) {
            return customer.yearsWithMHPCO() >= LOYALTY_FROM_YEARS;
        }
    },

    /**
     * Every contract after the customer's first is a follow-up contract.
     */
    FOLLOW_UP_CONTRACT(-15) {
        @Override
        boolean holdsOf(Customer customer, int precedingContracts) {
            return precedingContracts > 0;
        }
    };

    private final int ratePercent;

    CustomerStanding(int ratePercent) {
        this.ratePercent = ratePercent;
    }

    static List<CustomerStanding> of(Customer customer, int precedingContracts) {
        return Arrays.stream(values())
                .filter(standing -> standing.holdsOf(customer, precedingContracts))
                .toList();
    }

    abstract boolean holdsOf(Customer customer, int precedingContracts);

    Percentage rate() {
        return Percentage.of(ratePercent);
    }
}
