import java.util.ArrayList;
import java.util.List;

/** An insurance policy covering a list of items. */
final class Policy {

    private static final int CAP_FACTOR = 2;

    private final List<Item> items;
    private final int premium;
    private int remainingCap;

    Policy(List<Item> items, int premium) {
        this.items = List.copyOf(items);
        this.premium = premium;
        this.remainingCap = CAP_FACTOR * insuranceSum();
    }

    int premium() {
        return premium;
    }

    /**
     * Matches each reported damage to a distinct insured item. A damage whose
     * item is not covered by the policy is rejected, as is a second damage to
     * a type the policy insures only once.
     */
    List<DamagedItem> damagedItems(List<Damage> damages) {
        List<Item> unclaimed = new ArrayList<>(items);
        List<DamagedItem> damaged = new ArrayList<>();
        for (Damage damage : damages) {
            damaged.add(new DamagedItem(claimOne(unclaimed, damage), requireReportable(damage)));
        }
        return damaged;
    }

    private int requireReportable(Damage damage) {
        if (damage.amount() < 0) {
            throw new IllegalArgumentException(
                    "a damage amount cannot be negative: " + damage.amount());
        }
        return damage.amount();
    }

    private Item claimOne(List<Item> unclaimed, Damage damage) {
        for (int i = 0; i < unclaimed.size(); i++) {
            if (unclaimed.get(i).type().equals(damage.itemType())) {
                return unclaimed.remove(i);
            }
        }
        throw new IllegalArgumentException(
                "damaged item is not covered by the policy: " + damage.itemType());
    }

    int remainingCap() {
        return remainingCap;
    }

    /** The total payout per policy is capped at twice the insurance sum. */
    int payOutUpToCap(int desiredPayout) {
        int payout = Math.min(desiredPayout, remainingCap);
        remainingCap -= payout;
        return payout;
    }

    /** The insurance sum is the sum of the insured items' insurance values. */
    private int insuranceSum() {
        int sum = 0;
        for (Item item : items) {
            sum += PriceList.insuranceValueOf(item);
        }
        return sum;
    }
}
