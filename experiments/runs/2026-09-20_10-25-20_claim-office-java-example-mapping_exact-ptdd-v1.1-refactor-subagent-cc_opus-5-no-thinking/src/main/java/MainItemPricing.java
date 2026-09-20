import java.util.List;
import java.util.Map;

/**
 * The MHPCO price list for main items. Each main item type has one entry on
 * the list, stating both what the office charges to insure such an item and
 * what it insures it for; the entry is independent of how many such items a
 * policy covers.
 */
public final class MainItemPricing {

    /**
     * One line of the MHPCO price list: what insuring such an item costs, and
     * what it is insured for.
     */
    private record PriceListEntry(int basePremiumInG, int insuranceValueInG) {
    }

    private static final Map<String, PriceListEntry> PRICE_LIST = Map.of(
            "sword", new PriceListEntry(100, 1000),
            "amulet", new PriceListEntry(60, 600),
            "staff", new PriceListEntry(80, 800),
            "potion", new PriceListEntry(40, 400));

    private MainItemPricing() {
    }

    public static boolean isMainItem(String itemType) {
        return PRICE_LIST.containsKey(itemType);
    }

    /**
     * The price-list premium the MHPCO charges for one main item. Only main
     * items appear on the price list, so this is defined for main items alone;
     * components are priced by their own MHPCO policy, by the set they belong
     * to rather than one by one.
     */
    public static int mainItemBasePremium(Item item) {
        return entryFor(item).basePremiumInG();
    }

    /**
     * The base premium for every main item in a policy: the MHPCO charges each
     * main item at its price-list premium, with no offer for quantity.
     */
    public static int mainItemsBasePremium(List<Item> items) {
        return items.stream()
                .filter(item -> isMainItem(item.type()))
                .mapToInt(MainItemPricing::mainItemBasePremium)
                .sum();
    }

    /**
     * The insurance value the MHPCO's price list puts on one main item: what
     * the item is insured for, as opposed to what insuring it costs.
     */
    public static int mainItemInsuranceValue(Item item) {
        return entryFor(item).insuranceValueInG();
    }

    private static PriceListEntry entryFor(Item item) {
        return PRICE_LIST.get(item.type());
    }
}
