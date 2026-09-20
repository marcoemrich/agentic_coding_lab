import java.util.List;

/**
 * Computes the premium for a quote, in the order the office assesses it.
 *
 * The policy base premium from the MHPCO price list comes first. The item-specific risk
 * surcharges are then added on top of it, while the policy-wide modifiers are assessed
 * against the base premium itself rather than against the surcharged amount. The
 * processing fee is added at the very end, and only the final premium is rounded.
 */
public class PremiumCalculator {

    private static final int PROCESSING_FEE = 5;

    private final PolicyBasePremium policyBasePremiumRule = new PolicyBasePremium();
    private final PolicyRiskSurcharges policyRiskSurcharges = new PolicyRiskSurcharges();
    private final PolicyModifiers policyModifiers = new PolicyModifiers();

    public int premiumFor(QuoteStep quoteStep, QuoteAssessment assessment) {
        List<Item> items = quoteStep.items();
        double policyBasePremium = policyBasePremiumRule.forItems(items);
        double assessedPremium = policyBasePremium
                + policyRiskSurcharges.forItems(items)
                + policyModifiers.forPolicy(policyBasePremium, assessment);
        return OfficesFavour.onAmountReceived(assessedPremium + PROCESSING_FEE);
    }
}
