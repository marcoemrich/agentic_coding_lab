import java.util.Map;
import java.util.Set;

/**
 * The MHPCO price list: the insurance value and base premium of every item
 * type the office covers. Components are insured at a uniform value, with a
 * special base premium for a building block of 3 alike components.
 */
final class PriceList {

    private static final Set<String> COMPONENT_TYPES = Set.of("rune", "moonstone");
    private static final double COMPONENT_BASE_PREMIUM = 25;
    private static final int COMPONENT_INSURANCE_VALUE = 250;
    private static final int BLOCK_SIZE = 3;
    private static final double BLOCK_BASE_PREMIUM = 60;

    private static final Map<String, Integer> MAIN_ITEM_INSURANCE_VALUES = Map.of(
            "sword", 1000,
            "amulet", 600,
            "staff", 800,
            "potion", 400);

    private static final Map<String, Double> MAIN_ITEM_BASE_PREMIUMS = Map.of(
            "sword", 100.0,
            "amulet", 60.0,
            "staff", 80.0,
            "potion", 40.0);

    private PriceList() {
    }

    static boolean isComponent(String type) {
        return COMPONENT_TYPES.contains(type);
    }

    static double basePremiumOf(Item item) {
        if (isComponent(item.type())) {
            return COMPONENT_BASE_PREMIUM;
        }
        return requireCovered(MAIN_ITEM_BASE_PREMIUMS.get(item.type()), item.type());
    }

    static int insuranceValueOf(Item item) {
        if (isComponent(item.type())) {
            return COMPONENT_INSURANCE_VALUE;
        }
        return requireCovered(MAIN_ITEM_INSURANCE_VALUES.get(item.type()), item.type());
    }

    /** A building block of exactly 3 alike components is offered at a special premium. */
    static double basePremiumOfAlikeComponents(String type, int count) {
        if (count == BLOCK_SIZE) {
            return BLOCK_BASE_PREMIUM;
        }
        return count * COMPONENT_BASE_PREMIUM;
    }

    private static <T> T requireCovered(T price, String type) {
        if (price == null) {
            throw new IllegalArgumentException("the MHPCO does not cover items of type: " + type);
        }
        return price;
    }
}
