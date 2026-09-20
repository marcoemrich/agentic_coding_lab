import java.math.BigDecimal;
import java.util.List;

/**
 * Assembles the MHPCO premium for the items of a quote.
 *
 * <p>Knows that a premium is the policy base premium plus the risk surcharges
 * the insured items carry plus the policy-wide modifiers the customer's
 * standing earns plus the processing fee charged on every premium, and that
 * the intermediate amounts are kept as fractions until the premium is
 * settled to whole G. Defers what settling in the MHPCO's favour means to the
 * MHPCO's settlement rule.
 */
final class PremiumCalculator {

    private static final BigDecimal PROCESSING_FEE_IN_G = BigDecimal.valueOf(5);

    private PremiumCalculator() {
    }

    static int premiumFor(Customer customer, int precedingContracts, List<Item> items) {
        BigDecimal policyBasePremium = PolicyBasePremium.of(items);
        BigDecimal premium = policyBasePremium
                .add(RiskSurcharges.of(items))
                .add(PolicyModifiers.of(customer, precedingContracts, policyBasePremium))
                .add(PROCESSING_FEE_IN_G);
        return WholeG.premium(premium);
    }
}
