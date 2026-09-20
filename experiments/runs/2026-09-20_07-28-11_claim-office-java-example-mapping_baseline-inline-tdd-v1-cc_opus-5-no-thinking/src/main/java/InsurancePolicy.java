import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** A policy created by a quote step, against which claims are settled. */
public final class InsurancePolicy {

    private static final BigDecimal DEDUCTIBLE = new BigDecimal(100);
    private static final BigDecimal HALF = new BigDecimal("0.50");
    private static final int HALF_REIMBURSEMENT_LEVEL = 8;

    private final List<Item> items;
    private final BigDecimal insuranceSum;
    private BigDecimal remainingCap;

    public InsurancePolicy(List<Item> items) {
        this.items = List.copyOf(items);
        BigDecimal sum = BigDecimal.ZERO;
        for (Item item : this.items) {
            sum = sum.add(PriceList.insuranceValue(item.type()));
        }
        this.insuranceSum = sum;
        this.remainingCap = sum.multiply(new BigDecimal(2));
    }

    public BigDecimal insuranceSum() {
        return insuranceSum;
    }

    public BigDecimal remainingCap() {
        return remainingCap;
    }

    /**
     * Settles one incident and returns the payout in G, rounded down (in the
     * MHPCO's favor). The payout is limited by the cap remaining on the policy.
     */
    public int claim(List<Damage> damages) {
        List<Item> covering = matchDamagesToItems(damages);

        BigDecimal desired = BigDecimal.ZERO;
        for (int i = 0; i < damages.size(); i++) {
            desired = desired.add(reimbursement(covering.get(i), damages.get(i)));
        }

        BigDecimal payout = desired.min(remainingCap).max(BigDecimal.ZERO);
        int rounded = payout.setScale(0, RoundingMode.FLOOR).intValueExact();
        remainingCap = remainingCap.subtract(new BigDecimal(rounded));
        return rounded;
    }

    /**
     * Assigns each damage to a distinct insured item of the same type, so that two
     * damages of one type require two insured items of that type.
     */
    private List<Item> matchDamagesToItems(List<Damage> damages) {
        Map<String, Integer> used = new LinkedHashMap<>();
        List<Item> covering = new ArrayList<>();

        for (Damage damage : damages) {
            if (damage.amount() < 0) {
                throw new ClaimOfficeException("negative damage amount: " + damage.amount());
            }
            int alreadyUsed = used.getOrDefault(damage.itemType(), 0);
            Item item = nthItemOfType(damage.itemType(), alreadyUsed);
            used.put(damage.itemType(), alreadyUsed + 1);
            covering.add(item);
        }
        return covering;
    }

    private Item nthItemOfType(String type, int index) {
        int seen = 0;
        for (Item item : items) {
            if (item.type().equals(type)) {
                if (seen == index) {
                    return item;
                }
                seen++;
            }
        }
        if (seen == 0) {
            throw new ClaimOfficeException("item not covered by the policy: " + type);
        }
        throw new ClaimOfficeException(
                "more damages of type " + type + " than the policy covers: insured " + seen);
    }

    /**
     * Applies the reimbursement clauses, then the per-event deductible. Dragon
     * material means full reimbursement, which is also the default, and the 50 %
     * high-enchantment rule wins when both clauses apply -- so the material never
     * changes the outcome and needs no branch of its own.
     */
    private BigDecimal reimbursement(Item item, Damage damage) {
        BigDecimal amount = new BigDecimal(damage.amount());
        if (item.enchantment() >= HALF_REIMBURSEMENT_LEVEL) {
            amount = amount.multiply(HALF);
        }
        return amount.subtract(DEDUCTIBLE).max(BigDecimal.ZERO);
    }
}
