import java.util.List;

/**
 * A policy the MHPCO has issued over a list of insured items: what the office
 * covers, and what the covered items are insured for.
 *
 * Each of those is a decision the policy holds together rather than makes.
 * What the covered items are worth is {@link InsuranceValues}; how far beyond
 * that sum the office will pay out, and what claims leave of it, is
 * {@link PayoutCap}; which covered item a reported damage was suffered by is
 * {@link CoveredItems}.
 */
public final class Policy {

    private final CoveredItems coveredItems;

    private final int insuranceSumInG;

    private final PayoutCap payoutCap;

    public Policy(List<Item> insuredItems) {
        this.coveredItems = new CoveredItems(insuredItems);
        this.insuranceSumInG = InsuranceValues.insuranceSumOf(insuredItems);
        this.payoutCap = PayoutCap.overInsuranceSum(insuranceSumInG);
    }

    /**
     * What the covered items are insured for, all together.
     */
    public int insuranceSum() {
        return insuranceSumInG;
    }

    /**
     * The most the MHPCO will pay out over the life of this policy, as it was
     * set when the policy was issued. Claims settled since have not moved it;
     * what they have left of it is {@link Claim#remainingCap()}.
     */
    public int cap() {
        return payoutCap.total();
    }

    /**
     * The MHPCO settles an incident against this policy: it reimburses the
     * incident as far as the policy's cap still reaches, and reports what the
     * settlement leaves of that cap.
     */
    public Claim claim(Incident incident) {
        int payout = payoutCap.drawDown(
                Reimbursement.forIncident(incident, coveredItems.forOneIncident()));
        return new Claim(payout, payoutCap.remaining());
    }
}
