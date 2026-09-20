/**
 * The MHPCO's risk surcharges. An item-specific modifier applies to the base
 * premium of the affected item, never to the policy total.
 */
final class RiskSurcharges {

    private static final double CURSE_SURCHARGE = 0.50;
    private static final double HIGH_ENCHANTMENT_SURCHARGE = 0.30;
    private static final int HIGH_ENCHANTMENT_LEVEL = 5;

    private RiskSurcharges() {
    }

    static double forItem(Item item) {
        double rate = 0;
        if (item.cursed()) {
            rate += CURSE_SURCHARGE;
        }
        if (isHighlyEnchanted(item)) {
            rate += HIGH_ENCHANTMENT_SURCHARGE;
        }
        return PriceList.basePremiumOf(item) * rate;
    }

    private static boolean isHighlyEnchanted(Item item) {
        return item.enchantment() >= HIGH_ENCHANTMENT_LEVEL;
    }
}
