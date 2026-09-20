import java.math.BigDecimal;

/**
 * The modifiers the MHPCO applies to a policy as a whole, as opposed to the risk it
 * rates on an individual item. Each is a share of the policy base premium: the office
 * charges for taking on a contract, not for the particular items in it.
 *
 * <p>The office knows three, and they stack additively on the same base:
 *
 * <ul>
 *   <li>a 10 % initial assessment surcharge, levied on every quote -- each item in a
 *       quote is a first insurance, whatever the customer's history;</li>
 *   <li>a 20 % loyalty discount for a long-standing customer;</li>
 *   <li>a 15 % discount on every contract after the customer's first.</li>
 * </ul>
 *
 * <p>Separate from {@link ItemRiskRating}: these change when the office revises the
 * terms it offers a customer, while an item surcharge changes when the office revises
 * the risk it sees in an item. The processing fee is neither -- it is a flat charge
 * added after every modifier, so it stays with the office's final reckoning.
 */
public final class PolicyModifiers {

    private static final BigDecimal FIRST_INSURANCE_SURCHARGE_RATE = Modifier.rate(10);
    private static final BigDecimal LOYALTY_DISCOUNT_RATE = Modifier.rate(20);
    private static final BigDecimal FOLLOW_UP_CONTRACT_DISCOUNT_RATE = Modifier.rate(15);

    private PolicyModifiers() {
    }

    /**
     * The policy base premium adjusted by every policy-wide modifier that applies to
     * this contract.
     */
    public static BigDecimal applyTo(
            BigDecimal policyBasePremium, boolean longStandingCustomer, boolean followUpContract) {
        BigDecimal adjusted = policyBasePremium
                .add(policyBasePremium.multiply(FIRST_INSURANCE_SURCHARGE_RATE));
        if (longStandingCustomer) {
            adjusted = adjusted.subtract(policyBasePremium.multiply(LOYALTY_DISCOUNT_RATE));
        }
        if (followUpContract) {
            adjusted = adjusted.subtract(
                    policyBasePremium.multiply(FOLLOW_UP_CONTRACT_DISCOUNT_RATE));
        }
        return adjusted;
    }
}
