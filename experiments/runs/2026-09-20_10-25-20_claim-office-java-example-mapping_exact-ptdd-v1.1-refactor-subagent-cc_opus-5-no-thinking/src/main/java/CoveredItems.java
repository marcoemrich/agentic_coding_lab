import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * The items one issued policy covers, as the office reads them when settling
 * an incident: which covered item a reported damage was suffered by, and the
 * refusal when none is.
 *
 * These are one decision. The matching rule says which covered item answers to
 * a reported damage -- by type today, by an item the damage names outright
 * tomorrow -- and the refusal is that rule's other outcome, not a rule beside
 * it: the office declines the whole claim rather than settling the rest of the
 * incident around a damage it covers no item for. It refuses a damage naming
 * an item type the office does not insure at all on the same ground and in the
 * same words, because such a policy covers no such item either; the MHPCO's
 * price list is not consulted at claim time.
 *
 * These are the items the policy covers standing, not the {@link Coverage} of
 * one incident: an insured item answers at most one reported damage per
 * incident, so the office reads this record afresh for each incident it
 * settles.
 *
 * What the covered items are insured for is a separate decision, made by
 * {@link InsuranceValues}: the office may revalue what it covers without
 * changing how it matches a damage to an item.
 *
 * Not to be confused with {@link InsurableItems}, which decides what the
 * office will take on at all; this says what one issued policy already covers.
 */
public final class CoveredItems {

    private final List<Item> insuredItems;

    public CoveredItems(List<Item> insuredItems) {
        this.insuredItems = List.copyOf(insuredItems);
    }

    /**
     * The coverage this policy offers one incident: each reported damage is
     * answered by a covered item of its own, so the office settles a damage
     * per insured item and no more.
     */
    public Coverage forOneIncident() {
        List<Item> unclaimed = new ArrayList<>(insuredItems);
        return damage -> {
            Item damagedItem = matching(unclaimed, damage).orElseThrow(() -> notCovered(damage));
            unclaimed.remove(damagedItem);
            return damagedItem;
        };
    }

    /**
     * Which covered item answers to a reported damage: the first one of the
     * damaged type that no earlier damage in the same incident has claimed.
     */
    private static Optional<Item> matching(List<Item> unclaimed, Damage damage) {
        return unclaimed.stream()
                .filter(item -> item.type().equals(damage.itemType()))
                .findFirst();
    }

    /**
     * The office declines a damage it covers no item for.
     */
    private static IllegalArgumentException notCovered(Damage damage) {
        return new IllegalArgumentException(
                "This policy does not cover an item of type " + damage.itemType());
    }
}
