import java.math.BigDecimal;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * An issued policy. It covers a fixed list of items and tracks how much of its payout cap is
 * still available across successive claims.
 */
public final class Policy {

    private static final BigDecimal DEDUCTIBLE = new BigDecimal("100");
    private static final BigDecimal HIGH_ENCHANTMENT_SHARE = new BigDecimal("0.50");
    private static final int CAP_FACTOR = 2;

    private final List<Item> items;
    private int remainingCap;

    public Policy(List<Item> items) {
        this.items = List.copyOf(items);
        this.remainingCap = cap();
    }

    public int insuranceSum() {
        return items.stream().mapToInt(Item::insuranceValue).sum();
    }

    public int cap() {
        return insuranceSum() * CAP_FACTOR;
    }

    public int remainingCap() {
        return remainingCap;
    }

    /** Settles an incident, consuming cap. Rejects damages the policy does not cover. */
    public ClaimResult settle(Incident incident) {
        BigDecimal desired = desiredPayout(incident);
        int payout = Math.min(MhpcoRounding.payout(desired), remainingCap);
        remainingCap -= payout;
        return new ClaimResult(payout, remainingCap);
    }

    private BigDecimal desiredPayout(Incident incident) {
        Map<String, Deque<Item>> coverage = coverageByType();
        BigDecimal total = BigDecimal.ZERO;
        for (Damage damage : incident.damages()) {
            total = total.add(reimbursement(claimedItem(coverage, damage), damage));
        }
        return total.max(BigDecimal.ZERO);
    }

    /**
     * Matches a damage to a still-unclaimed insured item of the same type, so that a policy
     * covering two swords can absorb two sword damages but not three.
     */
    private Item claimedItem(Map<String, Deque<Item>> coverage, Damage damage) {
        Deque<Item> available = coverage.get(damage.itemType());
        if (available == null || available.isEmpty()) {
            throw new ClaimOfficeException(
                    "damage to an item not covered by the policy: " + damage.itemType());
        }
        return available.removeFirst();
    }

    private Map<String, Deque<Item>> coverageByType() {
        return items.stream().collect(Collectors.groupingBy(
                Item::type, HashMap::new, Collectors.toCollection(ArrayDeque::new)));
    }

    private BigDecimal reimbursement(Item item, Damage damage) {
        BigDecimal amount = BigDecimal.valueOf(damage.amount());
        if (item.hasClaimRelevantEnchantment()) {
            amount = amount.multiply(HIGH_ENCHANTMENT_SHARE);
        }
        return amount.subtract(DEDUCTIBLE).max(BigDecimal.ZERO);
    }
}
