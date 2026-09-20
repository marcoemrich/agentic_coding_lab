import java.math.BigDecimal;
import java.util.Map;
import java.util.Set;

/**
 * The MHPCO price list: what the office charges as a base premium for each item type
 * it covers, and what it insures that type for, before any modifier that depends on
 * the item, the customer or the contract. A lookup only -- the offers the office makes
 * on top of these prices, such as the component building block, live with the pricing
 * that grants them.
 *
 * <p>The list is also the office's roster of insurable types, and deliberately so: a
 * type the list does not name has neither a premium nor an insurance value, so there
 * is no state in which the office could price a type it does not cover, or cover a
 * type it cannot price. Naming a type and pricing it are one entry, revised in one
 * edit.
 */
public final class MhpcoPriceList {

    /**
     * One row of the price list: the two figures the list states side by side for an
     * item type. They are quoted together and revised together, so the list records
     * them together.
     */
    private record Entry(int basePremium, int insuranceValue) {
    }

    /** The main item types the office covers, each with its row of the price list. */
    private static final Map<String, Entry> MAIN_ITEMS = Map.of(
            "sword", new Entry(100, 1000),
            "amulet", new Entry(60, 600),
            "staff", new Entry(80, 800),
            "potion", new Entry(40, 400));

    /**
     * Components are a family of small item types the MHPCO prices alike, so the list
     * states one row for the whole family rather than repeating it per type.
     */
    private static final Entry COMPONENT_ENTRY = new Entry(25, 250);

    /** The component types the office covers. All are priced at {@link #COMPONENT_ENTRY}. */
    private static final Set<String> COMPONENT_TYPES = Set.of("rune", "moonstone");

    static final int COMPONENT_BASE_PREMIUM = COMPONENT_ENTRY.basePremium();

    private MhpcoPriceList() {
    }

    /**
     * What a single item costs on its own, ignoring any building block it belongs to.
     * Item risk surcharges are shares of this amount.
     */
    public static BigDecimal basePremiumOf(Item item) {
        return BigDecimal.valueOf(entryFor(item).basePremium());
    }

    /**
     * What the office insures a single item for. Unlike the base premium, this is
     * never reduced by an offer: a building block is cheaper to insure, not worth less.
     */
    public static int insuranceValueOf(Item item) {
        return entryFor(item).insuranceValue();
    }

    /** Whether the office prices this item as a component rather than a main item. */
    public static boolean isComponent(Item item) {
        return COMPONENT_TYPES.contains(item.type());
    }

    /**
     * The row the office reads for this item. The MHPCO covers only what its price
     * list names: an item of any other type is not insurable here.
     */
    private static Entry entryFor(Item item) {
        if (isComponent(item)) {
            return COMPONENT_ENTRY;
        }
        Entry mainItem = MAIN_ITEMS.get(item.type());
        if (mainItem == null) {
            throw new IllegalArgumentException(
                    "the MHPCO does not cover items of type: " + item.type());
        }
        return mainItem;
    }
}
