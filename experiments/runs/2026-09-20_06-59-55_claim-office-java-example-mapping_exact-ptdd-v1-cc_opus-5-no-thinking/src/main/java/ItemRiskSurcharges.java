import java.util.Map;
import java.util.function.ToDoubleFunction;

/** MHPCO's item-scoped risk surcharges, each charged on the affected item's own base premium. */
final class ItemRiskSurcharges {

    private static final double CURSE_RATE = 0.50;
    private static final double HIGH_ENCHANTMENT_RATE = 0.30;
    private static final int HIGH_ENCHANTMENT_LEVEL = 5;

    private ItemRiskSurcharges() {
    }

    static double forItem(Map<String, Object> item, ToDoubleFunction<Map<String, Object>> basePremium) {
        double surcharges = 0;
        if (isCursed(item)) {
            surcharges += basePremium.applyAsDouble(item) * CURSE_RATE;
        }
        if (isHighlyEnchanted(item)) {
            surcharges += basePremium.applyAsDouble(item) * HIGH_ENCHANTMENT_RATE;
        }
        return surcharges;
    }

    private static boolean isCursed(Map<String, Object> item) {
        return Boolean.TRUE.equals(item.get("cursed"));
    }

    private static boolean isHighlyEnchanted(Map<String, Object> item) {
        return enchantmentOf(item) >= HIGH_ENCHANTMENT_LEVEL;
    }

    private static int enchantmentOf(Map<String, Object> item) {
        Object enchantment = item.get("enchantment");
        return enchantment instanceof Integer level ? level : 0;
    }
}
