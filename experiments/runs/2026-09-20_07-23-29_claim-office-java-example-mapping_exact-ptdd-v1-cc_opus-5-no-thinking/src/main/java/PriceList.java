import java.util.Map;

/** The MHPCO price list: what each insurable item type is worth and costs. */
public final class PriceList {

    private static final Map<String, Integer> BASE_PREMIUMS = Map.of(
            "sword", 100,
            "amulet", 60,
            "staff", 80,
            "potion", 40,
            "rune", 25,
            "moonstone", 25);

    private static final Map<String, Integer> INSURANCE_VALUES = Map.of(
            "sword", 1000,
            "amulet", 600,
            "staff", 800,
            "potion", 400,
            "rune", 250,
            "moonstone", 250);

    private PriceList() {
    }

    public static int basePremium(String itemType) {
        return listed(BASE_PREMIUMS, itemType);
    }

    public static int insuranceValue(String itemType) {
        return listed(INSURANCE_VALUES, itemType);
    }

    private static int listed(Map<String, Integer> column, String itemType) {
        Integer amount = column.get(itemType);
        if (amount == null) {
            throw new IllegalArgumentException("MHPCO does not insure items of type: " + itemType);
        }
        return amount;
    }
}
