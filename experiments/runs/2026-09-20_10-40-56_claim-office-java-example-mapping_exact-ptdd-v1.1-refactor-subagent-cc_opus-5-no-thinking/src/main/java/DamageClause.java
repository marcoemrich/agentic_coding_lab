import java.math.BigDecimal;

/**
 * The MHPCO's clauses on how much of a damage it reimburses at all, before the
 * deductible is taken off.
 *
 * <p>Damage to a highly enchanted item is reimbursed at only half the damage
 * amount: enchantments are held to be part of the risk the customer brought.
 *
 * <p>The MHPCO also holds that damage to an item of dragon material is fully
 * reimbursed. That clause has no branch here, and deliberately so: full
 * reimbursement is already what this class does when no clause bears on a
 * damage, and wherever the MHPCO has said what happens when both clauses meet,
 * the high-enchantment clause wins. Dragon material therefore never moves a
 * payout, and an item's material is not carried into the domain at all. Should
 * the MHPCO ever let dragon material override the half reimbursement, or
 * recognise a clause that reimburses at less than the full amount, the material
 * would have to be read from the report and a clause added here.
 */
final class DamageClause {

    private static final int HALF_REIMBURSEMENT_FROM_ENCHANTMENT = 8;
    private static final Percentage HALF_REIMBURSEMENT = Percentage.of(50);

    private DamageClause() {
    }

    static BigDecimal reimbursedPartOf(Item damaged, BigDecimal damage) {
        if (isHighlyEnchanted(damaged)) {
            return HALF_REIMBURSEMENT.ofAmount(damage);
        }
        return damage;
    }

    private static boolean isHighlyEnchanted(Item damaged) {
        return damaged.enchantment() >= HALF_REIMBURSEMENT_FROM_ENCHANTMENT;
    }
}
