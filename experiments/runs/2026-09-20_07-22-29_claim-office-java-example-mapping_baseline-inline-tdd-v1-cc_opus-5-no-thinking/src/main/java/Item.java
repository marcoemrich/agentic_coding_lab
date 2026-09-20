/** A single insured item as described in a quote. */
record Item(String type, String material, int enchantment, boolean cursed) {

    boolean isComponent() {
        return "rune".equals(type) || "moonstone".equals(type);
    }

    int insuranceValue() {
        return PriceList.insuranceValue(type);
    }

    int basePremium() {
        return PriceList.basePremium(type);
    }
}
