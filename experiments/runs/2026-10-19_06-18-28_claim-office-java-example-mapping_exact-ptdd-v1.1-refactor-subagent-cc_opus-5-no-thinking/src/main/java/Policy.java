import java.math.BigDecimal;
import java.util.List;

/**
 * A policy the office has written: the {@link Coverage} it was written over, the
 * {@link PayoutCap} it was written under, and the {@link ClaimPolicy} whose
 * clauses it was written on. All three are terms of the policy, fixed when the
 * office wrote it, rather than facts of any one incident reported against it.
 *
 * Settling an incident against the policy is this policy's decision, not the
 * protocol's, and all it decides is how the three parties to a settlement meet:
 * the coverage says which covered item a reported damage is settled on, the
 * {@link ClaimPolicy} says what that one damage earns, and the cap says how much
 * of it is actually paid. So the deductible is borne once per damage reported
 * and the cap is consumed in the order the damages are reported.
 */
public class Policy {

    private final Coverage coverage;
    private final PayoutCap payoutCap;
    private final ClaimPolicy claimPolicy;

    /**
     * The office writes a policy over the items a customer brings: what it
     * insures them for is the {@link PriceList}'s to state, the cap that
     * insurance sum earns is the cap's own rule, and the claim clauses it is
     * written on are the office's. Premium modifiers are no part of it, which is
     * why the policy is written from the covered items and never from the
     * premium quoted for them.
     */
    public static Policy covering(List<InsuredItem> insuredItems, PriceList priceList,
            ClaimPolicy claimPolicy) {
        return new Policy(Coverage.of(insuredItems),
                PayoutCap.forInsuranceSum(priceList.insuranceSum(insuredItems)), claimPolicy);
    }

    private Policy(Coverage coverage, PayoutCap payoutCap, ClaimPolicy claimPolicy) {
        this.coverage = coverage;
        this.payoutCap = payoutCap;
        this.claimPolicy = claimPolicy;
    }

    /**
     * What the office pays for one reported incident: the sum of what each
     * damage reported is settled for, settled in the order reported so that the
     * cap is consumed in that order. An incident the coverage refuses is settled
     * not at all, so nothing is paid out of a claim the office rejects.
     */
    public BigDecimal settle(List<Damage> damages) {
        coverage.requireIncidentIsCovered(damages);
        BigDecimal paid = BigDecimal.ZERO;
        for (Damage damage : damages) {
            paid = paid.add(settleOne(damage));
        }
        return paid;
    }

    /**
     * What one reported damage is actually paid: the coverage says which covered
     * item it is settled on, the claim rules say what that damage earns on that
     * item's terms, and the cap pays what it still allows of it.
     *
     * Every damage reported is settled here on its own, which is why a second
     * damage of a kind already damaged bears the deductible again and draws on
     * the cap the first one has already reduced. Settling an incident as a whole
     * instead — one deductible for the incident, or the incident's total tested
     * against the cap in one go — would be a revision of this one sentence.
     */
    private BigDecimal settleOne(Damage damage) {
        InsuredItem damagedItem = coverage.itemDamagedBy(damage);
        return payoutCap.pay(claimPolicy.reimbursementFor(damage.amount(), damagedItem));
    }

    public BigDecimal remainingCap() {
        return payoutCap.remaining();
    }
}
