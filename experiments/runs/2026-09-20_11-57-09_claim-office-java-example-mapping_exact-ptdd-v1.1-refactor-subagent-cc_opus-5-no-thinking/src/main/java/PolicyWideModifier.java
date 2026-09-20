/**
 * A modifier the MHPCO assesses against the policy base premium as a whole, and the
 * signed rate it carries.
 *
 * The office's catalogue of policy-wide modifiers: each entry names one, says when a
 * quote carries it, and at what rate. A surcharge carries a positive rate, a discount a
 * negative one. Revising a rate or an eligibility rule is a change to one entry;
 * recognising a new modifier is a new entry.
 *
 * Eligibility is asked of the quote being assessed, not of the customer: an entry reads
 * whatever of the quote it needs -- who the customer is, which contract this is -- and
 * an entry that needs none of it, such as the initial assessment, simply says so.
 *
 * Unlike a recognised risk, which attaches to the one item that carries it, these are
 * assessed against the sum of all item base premiums.
 */
public enum PolicyWideModifier {

    /**
     * Every quote is a first insurance of its items, so the office charges the initial
     * assessment on every quote, whatever the customer's history.
     */
    INITIAL_ASSESSMENT(0.10) {
        @Override
        boolean isCarriedBy(QuoteAssessment assessment) {
            return true;
        }
    },

    LOYALTY_DISCOUNT(-0.20) {
        @Override
        boolean isCarriedBy(QuoteAssessment assessment) {
            return assessment.customer().isLongStanding();
        }
    },

    /**
     * The office grants a discount on each contract the customer takes out after the
     * first one.
     */
    FOLLOW_UP_CONTRACT_DISCOUNT(-0.15) {
        @Override
        boolean isCarriedBy(QuoteAssessment assessment) {
            return assessment.isFollowUpContract();
        }
    };

    private final double rate;

    PolicyWideModifier(double rate) {
        this.rate = rate;
    }

    abstract boolean isCarriedBy(QuoteAssessment assessment);

    double rate() {
        return rate;
    }
}
