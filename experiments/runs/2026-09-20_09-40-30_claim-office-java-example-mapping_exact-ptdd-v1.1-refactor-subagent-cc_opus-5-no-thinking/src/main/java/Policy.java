import java.util.ArrayList;
import java.util.List;

/**
 * A contract the MHPCO has written: the items it covers, the premium charged, and
 * how much of its payout cap is still available.
 */
public final class Policy {

    /** The office never pays out more than this multiple of the insurance sum. */
    private static final int CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

    private final List<Item> items;
    private final int premium;
    private int remainingCap;

    public Policy(List<Item> items, int premium) {
        this.items = List.copyOf(items);
        this.premium = premium;
        this.remainingCap = CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSum();
    }

    /**
     * The insured items the damages of one incident struck, each paired with its damage,
     * in the order reported. Each
     * damage claims a covered item of its own: a policy covering two swords can suffer
     * two sword damages, but a claim naming more items of a type than the policy
     * covers -- or a type it does not cover at all -- is not a claim on this policy.
     *
     * <p>What the policy covers is the policy's own knowledge, so the policy answers
     * the question rather than handing out its items.
     */
    List<DamagedItem> damagedItemsFor(List<Damage> damages) {
        List<Item> stillUnclaimed = new ArrayList<>(items);
        List<DamagedItem> damagedItems = new ArrayList<>();
        for (Damage damage : damages) {
            damagedItems.add(new DamagedItem(damage, claimOne(stillUnclaimed, damage)));
        }
        return List.copyOf(damagedItems);
    }

    /** Takes one covered item of the damaged type out of those not yet claimed. */
    private static Item claimOne(List<Item> stillUnclaimed, Damage damage) {
        for (int i = 0; i < stillUnclaimed.size(); i++) {
            if (stillUnclaimed.get(i).type().equals(damage.itemType())) {
                return stillUnclaimed.remove(i);
            }
        }
        throw new IllegalArgumentException(
                "the policy does not cover a further item of type: " + damage.itemType());
    }

    public int premium() {
        return premium;
    }

    /** What remains of the total the office will pay out over this policy's life. */
    public int remainingCap() {
        return remainingCap;
    }

    /**
     * The office draws a settled payout against the policy's cap and pays out what
     * the cap still allows: a desired payout beyond the remaining cap is reduced to
     * it. The cap is the policy's own ledger -- only the policy knows how much of it
     * earlier claims have already spent.
     */
    int drawAgainstCap(int desiredPayout) {
        int paid = Math.min(desiredPayout, remainingCap);
        remainingCap -= paid;
        return paid;
    }

    /** What the policy insures in total: the sum of its items' insurance values. */
    private int insuranceSum() {
        return items.stream().mapToInt(MhpcoPriceList::insuranceValueOf).sum();
    }
}
