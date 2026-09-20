/**
 * What the office pays out for an incident, settled against the cover a policy has left.
 *
 * The office settles an incident one damaged item at a time, and the incident's payout is
 * what those settlements come to. The deductible is withheld per damage event, which is why
 * it belongs to the single settlement and not to the tally.
 *
 * Whether a reported damage is one the office will settle at all is not this tally's
 * business: the cover is asked, and it either names the item that answers for the damage or
 * objects to the report. This tally only settles the reports that survive that asking.
 */
public class PayoutCalculator {

    private static final int DEDUCTIBLE = 100;

    private final ReimbursementClauses reimbursementClauses = new ReimbursementClauses();

    public int payoutFor(Incident incident, UnclaimedCover unclaimedCover) {
        double payout = 0;
        for (Damage damage : incident.damages()) {
            payout += settlementFor(damage, unclaimedCover);
        }
        return OfficesFavour.onAmountPaidOut(payout);
    }

    /**
     * What one damaged item is settled at: the damage the office reimburses under the
     * clauses that cover it, less the deductible it withholds for every damage event.
     */
    private double settlementFor(Damage damage, UnclaimedCover unclaimedCover) {
        return reimbursementClauses.reimbursedAmountFor(damage, unclaimedCover.claimAgainst(damage))
                - DEDUCTIBLE;
    }
}
