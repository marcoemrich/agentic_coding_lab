import java.math.BigDecimal;

/**
 * The MHPCO's clauses on how much of a reported damage it recognises at all, before
 * the deductible is withheld. A clause looks only at the damaged item and the amount
 * claimed: it is the office's statement about the risk the item carried, not about
 * the customer, the contract or the price list.
 *
 * <p>The office knows two clauses, and reads them in this order of precedence:
 *
 * <ol>
 *   <li>Damage to a highly enchanted item (enchantment level &gt;= 8) is recognised
 *       at half. This clause wins wherever it applies.</li>
 *   <li>Damage to an item of dragon material is recognised in full.</li>
 * </ol>
 *
 * <p>Only the first clause is encoded below, and deliberately so. Full recognition is
 * already the office's default for every damage no clause touches, so the dragon-material
 * clause prescribes exactly what would happen without it: it is stated by the tariff but
 * changes no amount. Encoding it would mean a branch returning the same figure as the
 * fall-through, which no claim could ever tell apart -- the office would be unable to
 * check the clause it had written down. The clause is therefore recorded here rather
 * than in code, and {@link Item#material()} accordingly bears on no payout today. Should
 * the office ever lower its default recognition below full, this clause becomes
 * observable and earns its branch, immediately above the default.
 *
 * <p>The recognised amount stays an exact fraction -- a halved damage of an odd amount is
 * genuinely a half-G, and the MHPCO's rounding belongs to the final payout alone.
 */
public final class ReimbursementClause {

    /** From this enchantment level on, the office recognises only half a damage. */
    private static final int HALVED_REIMBURSEMENT_ENCHANTMENT = 8;

    private static final BigDecimal HALF = BigDecimal.valueOf(5, 1);

    private ReimbursementClause() {
    }

    /** How much of this damage to this item the office recognises. */
    public static BigDecimal recognisedAmountOf(Damage damage, Item item) {
        BigDecimal claimed = BigDecimal.valueOf(damage.amount());
        if (isHighlyEnchanted(item)) {
            return claimed.multiply(HALF);
        }
        return claimed;
    }

    /** Whether the halving clause reaches this item at all. */
    private static boolean isHighlyEnchanted(Item item) {
        return item.enchantment() >= HALVED_REIMBURSEMENT_ENCHANTMENT;
    }
}
