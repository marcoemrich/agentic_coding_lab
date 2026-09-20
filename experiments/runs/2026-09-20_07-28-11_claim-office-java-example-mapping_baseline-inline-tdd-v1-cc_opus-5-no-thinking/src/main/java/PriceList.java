import java.math.BigDecimal;
import java.util.Map;
import java.util.Set;

/** The MHPCO price list: insurance values and base premiums per item type. */
public final class PriceList {

    private static final Map<String, int[]> MAIN_ITEMS = Map.of(
            "sword", new int[] {1000, 100},
            "amulet", new int[] {600, 60},
            "staff", new int[] {800, 80},
            "potion", new int[] {400, 40});

    private static final Set<String> COMPONENTS = Set.of("rune", "moonstone");

    /** Base premium of a building block of three alike components. */
    public static final BigDecimal BLOCK_PREMIUM = new BigDecimal(60);

    /** Number of alike components that form a building block. */
    public static final int BLOCK_SIZE = 3;

    private PriceList() {
    }

    public static boolean isComponent(String type) {
        return COMPONENTS.contains(type);
    }

    public static boolean isKnown(String type) {
        return MAIN_ITEMS.containsKey(type) || isComponent(type);
    }

    public static BigDecimal insuranceValue(String type) {
        requireKnown(type);
        return new BigDecimal(isComponent(type) ? 250 : MAIN_ITEMS.get(type)[0]);
    }

    public static BigDecimal basePremium(String type) {
        requireKnown(type);
        return new BigDecimal(isComponent(type) ? 25 : MAIN_ITEMS.get(type)[1]);
    }

    private static void requireKnown(String type) {
        if (!isKnown(type)) {
            throw new ClaimOfficeException("unknown item type: " + type);
        }
    }
}
