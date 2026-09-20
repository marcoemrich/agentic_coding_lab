import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/** A policy created by a quote step; it tracks the cap consumed by earlier claims. */
public class Policy {

    private static final BigDecimal DEDUCTIBLE = BigDecimal.valueOf(100);
    private static final BigDecimal HALF = new BigDecimal("0.5");
    private static final int HALVING_ENCHANTMENT_LEVEL = 8;
    private static final int CAP_FACTOR = 2;

    private final List<Item> items;
    private BigDecimal remainingCap;

    public Policy(List<Item> items) {
        this.items = List.copyOf(items);
        this.remainingCap = BigDecimal.valueOf(CAP_FACTOR * insuranceSum());
    }

    /** The sum of the items' unmodified insurance values; discounts and surcharges do not affect it. */
    private long insuranceSum() {
        return items.stream().mapToLong(item -> PriceList.insuranceValue(item.type())).sum();
    }

    public int remainingCap() {
        return remainingCap.setScale(0, RoundingMode.FLOOR).intValueExact();
    }

    public ClaimResult claim(List<Damage> damages) {
        List<Item> available = new ArrayList<>(items);
        BigDecimal desired = BigDecimal.ZERO;
        for (Damage damage : damages) {
            desired = desired.add(reimbursement(damage, take(available, damage.itemType())));
        }
        BigDecimal payout = desired.min(remainingCap);
        remainingCap = remainingCap.subtract(payout);
        return new ClaimResult(payout.setScale(0, RoundingMode.FLOOR).intValueExact(), remainingCap());
    }

    /**
     * The reimbursement for a single damage entry: the special clauses reduce the damage
     * amount first, then the entry's own deductible applies.
     */
    private BigDecimal reimbursement(Damage damage, Item item) {
        if (damage.amount() < 0) {
            throw new ClaimOfficeException("damage amount must not be negative: " + damage.amount());
        }
        BigDecimal amount = BigDecimal.valueOf(damage.amount());
        if (item.enchantment() >= HALVING_ENCHANTMENT_LEVEL) {
            amount = amount.multiply(HALF);
        }
        return amount.subtract(DEDUCTIBLE).max(BigDecimal.ZERO);
    }

    /**
     * Consumes one insured item of the given type, so that a policy covering two swords can
     * absorb two sword damages while a single sword cannot.
     */
    private Item take(List<Item> available, String itemType) {
        for (int i = 0; i < available.size(); i++) {
            if (available.get(i).type().equals(itemType)) {
                return available.remove(i);
            }
        }
        throw new ClaimOfficeException("item not covered by the policy: " + itemType);
    }
}
