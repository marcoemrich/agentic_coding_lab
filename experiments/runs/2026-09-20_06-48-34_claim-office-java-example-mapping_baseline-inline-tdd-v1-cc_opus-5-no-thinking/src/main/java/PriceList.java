import java.util.Map;

/** The MHPCO price list: insurance values and base premiums per item type. */
public final class PriceList {

    /** Components such as runes and moonstones share one price. */
    public static final int COMPONENT_INSURANCE_VALUE = 250;
    public static final int COMPONENT_BASE_PREMIUM = 25;
    /** A building block of exactly three alike components. */
    public static final int BLOCK_SIZE = 3;
    public static final int BLOCK_BASE_PREMIUM = 60;

    private static final Map<String, int[]> MAIN_ITEMS = Map.of(
            "sword", new int[] {1000, 100},
            "amulet", new int[] {600, 60},
            "staff", new int[] {800, 80},
            "potion", new int[] {400, 40});

    private static final java.util.Set<String> COMPONENTS = java.util.Set.of("rune", "moonstone");

    private PriceList() {
    }

    public static boolean isComponent(String type) {
        return COMPONENTS.contains(type);
    }

    public static boolean isKnown(String type) {
        return MAIN_ITEMS.containsKey(type) || isComponent(type);
    }

    public static int insuranceValue(String type) {
        return isComponent(type) ? COMPONENT_INSURANCE_VALUE : entry(type)[0];
    }

    public static int basePremium(String type) {
        return isComponent(type) ? COMPONENT_BASE_PREMIUM : entry(type)[1];
    }

    private static int[] entry(String type) {
        int[] prices = MAIN_ITEMS.get(type);
        if (prices == null) {
            throw new ClaimOfficeException("unknown item type: " + type);
        }
        return prices;
    }
}
