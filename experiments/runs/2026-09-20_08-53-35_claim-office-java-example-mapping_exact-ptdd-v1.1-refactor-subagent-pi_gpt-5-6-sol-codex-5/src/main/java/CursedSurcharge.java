final class CursedSurcharge {
    private static final int SURCHARGE_PERCENT = 50;

    private CursedSurcharge() { }

    static int totalInHundredths(Iterable<InsuredItem> items) {
        int surcharge = 0;
        for (InsuredItem item : items) {
            if (item.cursed()) {
                surcharge += PriceList.itemBasePremium(item.type()) * SURCHARGE_PERCENT;
            }
        }
        return surcharge;
    }
}
