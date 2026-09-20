/**
 * The policy-wide modifiers the office applies to a quote, as one signed adjustment.
 *
 * Unlike a risk surcharge, which attaches to the one item that carries the risk, a
 * policy-wide modifier is assessed against the policy base premium -- the sum of all
 * item base premiums. Each modifier the quote carries is assessed on its own, and the
 * policy carries the sum of their signed rates: surcharges raise the adjustment,
 * discounts lower it.
 */
public class PolicyModifiers {

    public double forPolicy(double policyBasePremium, QuoteAssessment assessment) {
        return policyBasePremium * totalRateFor(assessment);
    }

    private double totalRateFor(QuoteAssessment assessment) {
        double rate = 0;
        for (PolicyWideModifier modifier : PolicyWideModifier.values()) {
            if (modifier.isCarriedBy(assessment)) {
                rate += modifier.rate();
            }
        }
        return rate;
    }
}
