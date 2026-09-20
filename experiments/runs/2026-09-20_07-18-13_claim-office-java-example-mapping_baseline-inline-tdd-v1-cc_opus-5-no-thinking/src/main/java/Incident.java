import java.math.BigDecimal;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Settles the damages of one incident against a policy. */
public final class Incident {

    private static final BigDecimal DEDUCTIBLE = BigDecimal.valueOf(100);
    private static final BigDecimal HALF = new BigDecimal("0.50");
    private static final int HIGH_ENCHANTMENT = 8;

    private Incident() {
    }

    /** The desired payout for all damages, before the policy cap is applied. */
    public static BigDecimal desiredPayout(Policy policy, List<Damage> damages) {
        Map<String, Deque<Item>> insured = insuredByType(policy.items());
        BigDecimal total = BigDecimal.ZERO;
        for (Damage damage : damages) {
            total = total.add(reimbursementFor(claimedItem(insured, damage), damage));
        }
        return total.max(BigDecimal.ZERO);
    }

    private static Item claimedItem(Map<String, Deque<Item>> insured, Damage damage) {
        if (damage.amount() < 0) {
            throw new ScenarioException("negative damage amount: " + damage.amount());
        }
        Deque<Item> available = insured.get(damage.itemType());
        if (available == null || available.isEmpty()) {
            throw new ScenarioException("item not covered by the policy: " + damage.itemType());
        }
        return available.removeFirst();
    }

    /**
     * The reimbursement for one damaged item. Full reimbursement is the norm, so the
     * dragon-material clause needs no rule of its own; the high-enchantment clause
     * halves the damage and wins wherever both would apply. The deductible is taken
     * last, once per damaged item.
     */
    private static BigDecimal reimbursementFor(Item item, Damage damage) {
        BigDecimal amount = BigDecimal.valueOf(damage.amount());
        if (item.enchantment() != null && item.enchantment() >= HIGH_ENCHANTMENT) {
            amount = amount.multiply(HALF);
        }
        return amount.subtract(DEDUCTIBLE).max(BigDecimal.ZERO);
    }

    private static Map<String, Deque<Item>> insuredByType(List<Item> items) {
        Map<String, Deque<Item>> byType = new LinkedHashMap<>();
        for (Item item : items) {
            byType.computeIfAbsent(item.type(), type -> new ArrayDeque<>()).addLast(item);
        }
        return byType;
    }
}
