/**
 * The clauses under which the office reimburses a reported damage, before the deductible.
 *
 * The office reimburses damage in full unless a special clause says otherwise. Damage to a
 * highly enchanted item is reimbursed at half, the magic having borne part of the harm.
 * Each clause fixes the share of a damage the office reimburses on the item that suffered
 * it; full reimbursement is what stands when no special clause speaks.
 *
 * The office states a second clause: damage to an item of dragon material is reimbursed in
 * full. It is deliberately absent here. Full reimbursement is already what stands when no
 * clause speaks, so where the dragon clause alone applies it asks for the amount the office
 * would pay anyway; and where it meets the half clause, the office rules that the half
 * clause wins. No damage the office can be shown is settled differently for knowing the
 * item is of dragon material, so naming it would add a distinction without a difference.
 * That precedence — the half clause prevailing over any clause of full reimbursement — is
 * what the single condition below quietly obeys, and is the rule to restate should a clause
 * ever arrive that does make a difference.
 */
public class ReimbursementClauses {

    private static final double HALF_REIMBURSEMENT_RATE = 0.50;

    private static final double FULL_REIMBURSEMENT_RATE = 1.00;

    /** The enchantment level from which the office reimburses a damage at half. */
    private static final int HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;

    public double reimbursedAmountFor(Damage damage, Item damagedItem) {
        return damage.amount() * reimbursedShareOf(damagedItem);
    }

    /** The share of a damage the office reimburses on the item that suffered it. */
    private double reimbursedShareOf(Item damagedItem) {
        if (isHighlyEnchanted(damagedItem)) {
            return HALF_REIMBURSEMENT_RATE;
        }
        return FULL_REIMBURSEMENT_RATE;
    }

    private boolean isHighlyEnchanted(Item item) {
        return item.enchantment() >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL;
    }
}
