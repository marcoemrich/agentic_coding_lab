import java.util.Map;

/**
 * MHPCO's clauses for reimbursing one damage event: how much of the damage amount is reimbursed
 * for the damaged item, less the deductible that applies per damage event.
 */
final class ReimbursementClauses {

    private static final int DEDUCTIBLE_PER_DAMAGE = 100;
    private static final double HIGH_ENCHANTMENT_SHARE = 0.50;
    private static final int HIGH_ENCHANTMENT_LEVEL = 8;
    private static final double FULL_REIMBURSEMENT = 1;

    private ReimbursementClauses() {
    }

    static double reimbursementFor(int damageAmount, Map<String, Object> damagedItem) {
        if (damageAmount < 0) {
            throw new IllegalArgumentException("A damage amount cannot be negative: " + damageAmount);
        }
        return Math.max(0, damageAmount * reimbursedShareFor(damagedItem) - DEDUCTIBLE_PER_DAMAGE);
    }

    private static double reimbursedShareFor(Map<String, Object> item) {
        if (isHighlyEnchanted(item)) {
            return HIGH_ENCHANTMENT_SHARE;
        }
        return FULL_REIMBURSEMENT;
    }

    private static boolean isHighlyEnchanted(Map<String, Object> item) {
        Object enchantment = item.get("enchantment");
        return enchantment instanceof Integer level && level >= HIGH_ENCHANTMENT_LEVEL;
    }
}
