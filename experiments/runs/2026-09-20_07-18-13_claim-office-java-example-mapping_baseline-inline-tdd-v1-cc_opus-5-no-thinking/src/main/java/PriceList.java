import java.math.BigDecimal;
import java.util.Map;

/** The MHPCO's venerable price list of insurance values and base premiums. */
public final class PriceList {

    private static final Map<String, BigDecimal> MAIN_ITEMS = Map.of(
            "sword", BigDecimal.valueOf(1000),
            "amulet", BigDecimal.valueOf(600),
            "staff", BigDecimal.valueOf(800),
            "potion", BigDecimal.valueOf(400));

    private static final BigDecimal COMPONENT_VALUE = BigDecimal.valueOf(250);

    private static final Map<String, BigDecimal> COMPONENTS = Map.of(
            "rune", COMPONENT_VALUE,
            "moonstone", COMPONENT_VALUE);

    /** Base premium is always a tenth of the insurance value. */
    private static final BigDecimal PREMIUM_RATE = BigDecimal.valueOf(10);

    private PriceList() {
    }

    public static boolean isComponent(String type) {
        return COMPONENTS.containsKey(type);
    }

    public static boolean isKnown(String type) {
        return MAIN_ITEMS.containsKey(type) || COMPONENTS.containsKey(type);
    }

    public static BigDecimal insuranceValue(String type) {
        BigDecimal value = MAIN_ITEMS.get(type);
        if (value == null) {
            value = COMPONENTS.get(type);
        }
        if (value == null) {
            throw new ScenarioException("unknown item type: " + type);
        }
        return value;
    }

    public static BigDecimal basePremium(String type) {
        return insuranceValue(type).divide(PREMIUM_RATE);
    }
}
