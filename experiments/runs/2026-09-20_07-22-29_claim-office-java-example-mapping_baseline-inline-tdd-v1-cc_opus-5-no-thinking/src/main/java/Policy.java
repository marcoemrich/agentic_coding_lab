import java.math.BigDecimal;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** A policy created by a quote, settling claims against its remaining cap. */
final class Policy {

    private final List<Item> items;
    private final int insuranceSum;
    private BigDecimal remainingCap;

    Policy(List<Item> items) {
        this.items = List.copyOf(items);
        int sum = 0;
        for (Item item : this.items) {
            sum += item.insuranceValue();
        }
        this.insuranceSum = sum;
        this.remainingCap = BigDecimal.valueOf(2L * sum);
    }

    int insuranceSum() {
        return insuranceSum;
    }

    int remainingCap() {
        return Claims.roundPayout(remainingCap);
    }

    /** Settles one incident against this policy and returns the payout in whole G. */
    int settle(List<Damage> damages) {
        List<Item> damagedItems = matchDamagedItems(damages);
        BigDecimal desired = BigDecimal.ZERO;
        for (int i = 0; i < damages.size(); i++) {
            BigDecimal amount = BigDecimal.valueOf(damages.get(i).amount());
            desired = desired.add(Claims.itemPayout(damagedItems.get(i), amount));
        }
        BigDecimal granted = desired.min(remainingCap);
        remainingCap = remainingCap.subtract(granted);
        return Claims.roundPayout(granted);
    }

    private List<Item> matchDamagedItems(List<Damage> damages) {
        Map<String, Deque<Item>> available = new LinkedHashMap<>();
        for (Item item : items) {
            available.computeIfAbsent(item.type(), type -> new ArrayDeque<>()).add(item);
        }
        List<Item> matched = new ArrayList<>();
        for (Damage damage : damages) {
            if (damage.amount() < 0) {
                throw new ClaimOfficeException("negative damage amount: " + damage.amount());
            }
            Deque<Item> candidates = available.get(damage.itemType());
            if (candidates == null || candidates.isEmpty()) {
                throw new ClaimOfficeException("item not covered by the policy: " + damage.itemType());
            }
            matched.add(candidates.remove());
        }
        return matched;
    }
}
