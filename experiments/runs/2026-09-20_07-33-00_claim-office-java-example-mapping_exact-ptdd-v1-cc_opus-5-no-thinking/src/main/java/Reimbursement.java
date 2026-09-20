/**
 * The MHPCO's reimbursement clauses for a damaged item. A deductible of 100 G
 * applies per damage event.
 *
 * <p>Damage to items made of dragon material is fully reimbursed, which is
 * also the MHPCO's default; where both clauses apply, the reduced
 * reimbursement for highly enchanted items wins.
 */
final class Reimbursement {

    private static final int DEDUCTIBLE = 100;
    private static final double REDUCED_REIMBURSEMENT = 0.50;
    private static final int REDUCED_REIMBURSEMENT_LEVEL = 8;

    private Reimbursement() {
    }

    static double forDamage(Item item, int damageAmount) {
        double reimbursement = damageAmount;
        if (isHighlyEnchanted(item)) {
            reimbursement *= REDUCED_REIMBURSEMENT;
        }
        return Math.max(0, reimbursement - DEDUCTIBLE);
    }

    private static boolean isHighlyEnchanted(Item item) {
        return item.enchantment() >= REDUCED_REIMBURSEMENT_LEVEL;
    }
}
