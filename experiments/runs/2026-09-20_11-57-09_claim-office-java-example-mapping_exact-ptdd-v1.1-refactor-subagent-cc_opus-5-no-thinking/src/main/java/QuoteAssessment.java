/**
 * The quote the office is assessing, as the policy-wide modifiers see it.
 *
 * A policy-wide modifier asks about the quote, not about the item list: who the customer
 * is, and how many contracts they had taken out with the office before this one. The
 * office keeps those facts together, because they are one question -- "what kind of quote
 * is this" -- rather than two independent parameters, and because recognising a modifier
 * that turns on a further fact about the quote is then a change to this record and the
 * one entry that reads it.
 */
public record QuoteAssessment(Customer customer, int earlierContracts) {

    public boolean isFollowUpContract() {
        return earlierContracts > 0;
    }
}
