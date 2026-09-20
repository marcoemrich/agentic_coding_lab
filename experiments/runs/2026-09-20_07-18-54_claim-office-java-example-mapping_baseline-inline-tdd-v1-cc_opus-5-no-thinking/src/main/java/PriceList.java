import java.util.Map;

/** The MHPCO price list: insurance values and base premiums per item type. */
public final class PriceList {

    private static final Map<String, Integer> INSURANCE_VALUES = Map.of(
            "sword", 1000,
            "amulet", 600,
            "staff", 800,
            "potion", 400,
            "rune", 250,
            "moonstone", 250);

    private static final Map<String, Integer> BASE_PREMIUMS = Map.of(
            "sword", 100,
            "amulet", 60,
            "staff", 80,
            "potion", 40,
            "rune", 25,
            "moonstone", 25);

    private PriceList() {
    }

    public static boolean isKnown(String type) {
        return INSURANCE_VALUES.containsKey(type);
    }

    public static boolean isComponent(String type) {
        return "rune".equals(type) || "moonstone".equals(type);
    }

    public static int insuranceValue(String type) {
        return lookUp(INSURANCE_VALUES, type);
    }

    public static int basePremium(String type) {
        return lookUp(BASE_PREMIUMS, type);
    }

    private static int lookUp(Map<String, Integer> table, String type) {
        Integer value = table.get(type);
        if (value == null) {
            throw new ClaimOfficeException("unknown item type: " + type);
        }
        return value;
    }
}
