import java.math.BigDecimal;

/**
 * The policy-wide modifiers the MHPCO applies to a policy base premium.
 *
 * <p>Holds the MHPCO's reading of the scope question for the customer's side:
 * unlike the item-specific risk surcharges, these follow from the customer's
 * standing with the MHPCO rather than from any insured item, and they are
 * measured against the policy base premium, the sum of all item base premiums.
 * The modifiers of a quote are therefore the sum, over the facts of the
 * customer's standing, of each fact's rate of that one amount. Defers which
 * facts count and what each is worth to the MHPCO's list of customer standings.
 *
 * <p>Returns a signed amount: what the customer's standing adds to the policy
 * base premium. A discount is therefore negative.
 *
 * <p>Changes whenever the MHPCO revises how a policy-wide modifier is measured
 * or accumulated.
 */
final class PolicyModifiers {

    private PolicyModifiers() {
    }

    static BigDecimal of(Customer customer, int precedingContracts, BigDecimal policyBasePremium) {
        return CustomerStanding.of(customer, precedingContracts).stream()
                .map(standing -> standing.rate().ofAmount(policyBasePremium))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
