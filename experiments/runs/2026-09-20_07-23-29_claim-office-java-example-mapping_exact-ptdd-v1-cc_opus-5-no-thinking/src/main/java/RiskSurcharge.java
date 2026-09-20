/** The MHPCO's risk assessment: what makes an insured item risky, and at what rate. */
public final class RiskSurcharge {

    private static final double CURSE_SURCHARGE = 0.50;
    private static final double HIGH_ENCHANTMENT_SURCHARGE = 0.30;
    private static final int HIGH_ENCHANTMENT_THRESHOLD = 5;

    private RiskSurcharge() {
    }

    public static double forItem(Item item) {
        double rate = 0;
        if (item.cursed()) {
            rate += CURSE_SURCHARGE;
        }
        if (isHighlyEnchanted(item)) {
            rate += HIGH_ENCHANTMENT_SURCHARGE;
        }
        return PriceList.basePremium(item.type()) * rate;
    }

    private static boolean isHighlyEnchanted(Item item) {
        return item.enchantment() >= HIGH_ENCHANTMENT_THRESHOLD;
    }
}
