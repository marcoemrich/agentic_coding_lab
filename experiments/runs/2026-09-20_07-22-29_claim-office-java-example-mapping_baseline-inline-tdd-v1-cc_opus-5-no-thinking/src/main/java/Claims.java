import java.math.BigDecimal;
import java.math.RoundingMode;

/** Computes payouts for damage reported against a policy. */
final class Claims {

    private static final BigDecimal DEDUCTIBLE = BigDecimal.valueOf(100);
    private static final BigDecimal HALF = new BigDecimal("0.5");
    private static final int HALF_REIMBURSEMENT_ENCHANTMENT = 8;

    private Claims() {
    }

    /**
     * The reimbursement for one damaged item, after its clause and the deductible.
     *
     * <p>Dragon material is fully reimbursed, which is also the default treatment, so it
     * needs no branch of its own; the 50 % clause for highly enchanted items wins over it.
     */
    static BigDecimal itemPayout(Item item, BigDecimal damage) {
        BigDecimal reimbursed = damage;
        if (item.enchantment() >= HALF_REIMBURSEMENT_ENCHANTMENT) {
            reimbursed = reimbursed.multiply(HALF);
        }
        BigDecimal afterDeductible = reimbursed.subtract(DEDUCTIBLE);
        return afterDeductible.max(BigDecimal.ZERO);
    }

    /** Payouts are rounded down — in the MHPCO's favour. */
    static int roundPayout(BigDecimal amount) {
        return amount.setScale(0, RoundingMode.FLOOR).intValueExact();
    }
}
