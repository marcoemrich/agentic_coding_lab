import java.math.BigDecimal;

/**
 * The MHPCO claim rules: what the office reimburses for a damage report against
 * a policy, after the deductible and within the policy's payout cap.
 *
 * Two decisions the office revises on their own schedules meet here, in the
 * order the specification fixes: its clause book states how much of a damage
 * counts as reimbursable at all, and only then is the deductible borne. A new
 * clause or a revised threshold is the clause book's business; repricing the
 * deductible is this rule's.
 *
 * A payout is a payment out of the office, so its fraction of a G is rounded in
 * the office's favor by {@link InOfficesFavor}.
 */
public class ClaimPolicy {

    private static final BigDecimal DEDUCTIBLE_PER_DAMAGE = new BigDecimal("100");
    private static final BigDecimal UNRULY_ITEM_REIMBURSEMENT_RATE = new BigDecimal("0.5");

    /**
     * The office reimburses the reimbursable part of a damage less the
     * deductible, never below nothing.
     *
     * A damage smaller than the deductible earns nothing rather than owing the
     * office the difference, which is what the floor at nothing states. It is
     * load-bearing and not merely defensive: a 50 G damage would otherwise
     * reimburse -50 G, and the cap pays the lesser of a desired payout and what
     * it has left, so a negative payout would be paid out and would hand the
     * policy's cap 50 G back. A refused report is a separate matter, settled
     * before a reimbursement is ever computed in {@link Damage}.
     */
    public BigDecimal reimbursementFor(BigDecimal damageAmount, InsuredItem damagedItem) {
        return InOfficesFavor.payment(reimbursableDamageUnderClauses(damageAmount, damagedItem)
                .subtract(DEDUCTIBLE_PER_DAMAGE)
                .max(BigDecimal.ZERO));
    }

    /**
     * How much of a damage the office's clause book lets it count as
     * reimbursable, read from the damaged item and settled before the
     * deductible. The high-enchantment clause reimburses an unruly item's damage
     * at a reduced rate; a damage no clause speaks to counts in full.
     *
     * The office's second clause, that damage to an item of dragon material is
     * fully reimbursed, is absent here deliberately rather than by oversight: in
     * every case the specification states it grants exactly what a damage no
     * clause speaks to already earns. Below the unruly threshold it reimburses in
     * full, which is the default; at or above it the specification gives the
     * reduced rate precedence. So the clause never changes a reimbursement, and
     * the office does not record an item's material at all. A revision that gave
     * dragon material its own rate, or precedence over the high-enchantment
     * clause, would be the first to make the material worth recording.
     */
    private static BigDecimal reimbursableDamageUnderClauses(BigDecimal damageAmount,
            InsuredItem damagedItem) {
        if (damagedItem.isTooUnrulyToReimburseInFull()) {
            return damageAmount.multiply(UNRULY_ITEM_REIMBURSEMENT_RATE);
        }
        return damageAmount;
    }
}
