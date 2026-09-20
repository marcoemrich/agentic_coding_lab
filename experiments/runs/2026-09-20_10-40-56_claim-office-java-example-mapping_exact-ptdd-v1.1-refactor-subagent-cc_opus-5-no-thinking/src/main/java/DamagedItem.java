import java.util.ArrayList;
import java.util.List;

/**
 * One damage entry of an incident together with the insured item it names.
 *
 * <p>A damage entry names its item by type, the way the report is written;
 * what the clauses need is the insured item itself, with its enchantment and
 * its material. Reading the one against the other is what this record carries:
 * the entry and the item it was matched to, so that no later step has to pair
 * them up again.
 *
 * <p>A policy may cover several items of the same type, so each entry is
 * matched to a separate insured item: the MHPCO will not settle the same item
 * twice on one report, and a report naming more items of a type than the
 * policy covers is refused outright.
 *
 * <p>Changes whenever the MHPCO revises how a report is read against a policy;
 * knows nothing about what is reimbursed for the items it finds.
 */
record DamagedItem(Item insured, Damage damage) {

    /**
     * The damage entries of a report, each paired with the insured item it
     * names, in the order they are reported.
     */
    static List<DamagedItem> of(List<Item> insured, List<Damage> damages) {
        List<Item> unclaimed = new ArrayList<>(insured);
        List<DamagedItem> damaged = new ArrayList<>();
        for (Damage damage : damages) {
            damaged.add(new DamagedItem(claim(unclaimed, damage), damage));
        }
        return damaged;
    }

    private static Item claim(List<Item> unclaimed, Damage damage) {
        for (int index = 0; index < unclaimed.size(); index++) {
            if (unclaimed.get(index).type().equals(damage.itemType())) {
                return unclaimed.remove(index);
            }
        }
        throw new RejectedScenario(
                "the policy does not cover a " + damage.itemType() + " for this damage");
    }
}
