/**
 * The MHPCO's reimbursement clauses: what share of a damage it pays for an
 * item, before the deductible. Damage to a severely enchanted item is
 * reimbursed at half; dragon material is fully reimbursed, as is any item no
 * clause singles out. Where both clauses apply, the severe-enchantment clause
 * wins.
 */
public final class Reimbursement {

    private static final double FULL = 1.0;
    private static final double SEVERE_ENCHANTMENT_SHARE = 0.50;
    private static final int SEVERE_ENCHANTMENT_THRESHOLD = 8;

    private Reimbursement() {
    }

    public static double shareFor(Item item) {
        if (isSeverelyEnchanted(item)) {
            return SEVERE_ENCHANTMENT_SHARE;
        }
        return FULL;
    }

    private static boolean isSeverelyEnchanted(Item item) {
        return item.enchantment() >= SEVERE_ENCHANTMENT_THRESHOLD;
    }
}
