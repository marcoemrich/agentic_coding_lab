final class EnchantmentSurcharge {
    private static final int HIGH_ENCHANTMENT_LEVEL = 5;
    private static final int SURCHARGE_PERCENT = 30;

    private EnchantmentSurcharge() { }

    static int totalInHundredths(Iterable<InsuredItem> items) {
        int total = 0;
        for (InsuredItem item : items) {
            if (isHighlyEnchanted(item)) {
                total += PriceList.itemBasePremium(item.type()) * SURCHARGE_PERCENT;
            }
        }
        return total;
    }

    private static boolean isHighlyEnchanted(InsuredItem item) {
        return item.enchantment() >= HIGH_ENCHANTMENT_LEVEL;
    }
}
