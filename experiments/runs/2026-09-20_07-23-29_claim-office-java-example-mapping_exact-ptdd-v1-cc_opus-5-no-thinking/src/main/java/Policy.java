import java.util.ArrayList;
import java.util.List;

/** An issued MHPCO policy: the items it covers and the payout cap still available. */
public final class Policy {

    private static final int CAP_MULTIPLIER = 2;

    private final List<Item> items;
    private int remainingCap;

    public Policy(List<Item> items) {
        this.items = List.copyOf(items);
        this.remainingCap = CAP_MULTIPLIER * insuranceSum();
    }

    public List<Item> items() {
        return items;
    }

    public int remainingCap() {
        return remainingCap;
    }

    /** Pays out as much of the desired amount as the remaining cap allows. */
    public int payOutAtMost(int desired) {
        int payout = Math.min(desired, remainingCap);
        remainingCap -= payout;
        return payout;
    }

    /**
     * The covered item each damage refers to, one distinct item per damage.
     * Rejects an incident that names an item this policy does not cover, or
     * more items of a type than it covers.
     */
    public List<Item> damagedItems(List<Damage> damages) {
        List<Item> uncovered = new ArrayList<>(items);
        List<Item> damaged = new ArrayList<>();
        for (Damage damage : damages) {
            damaged.add(claimFrom(uncovered, damage.itemType()));
        }
        return damaged;
    }

    private static Item claimFrom(List<Item> uncovered, String itemType) {
        for (int i = 0; i < uncovered.size(); i++) {
            if (uncovered.get(i).type().equals(itemType)) {
                return uncovered.remove(i);
            }
        }
        throw new IllegalArgumentException("Policy does not cover a further item of type: " + itemType);
    }

    private int insuranceSum() {
        int sum = 0;
        for (Item item : items) {
            sum += PriceList.insuranceValue(item.type());
        }
        return sum;
    }
}
