/**
 * An insured item. {@code enchantment} and {@code material} are {@code null} for components,
 * which carry neither.
 */
public record Item(String type, String material, Integer enchantment, boolean cursed) {

    public Item {
        if (!PriceList.isKnown(type)) {
            throw new ClaimOfficeException("unknown item type: " + type);
        }
    }

    public boolean isComponent() {
        return PriceList.isComponent(type);
    }

    public int insuranceValue() {
        return PriceList.insuranceValue(type);
    }

    public boolean isHighlyEnchanted() {
        return enchantment != null && enchantment >= 5;
    }

    public boolean hasClaimRelevantEnchantment() {
        return enchantment != null && enchantment >= 8;
    }

    public boolean isDragonMaterial() {
        return "dragon".equals(material);
    }
}
