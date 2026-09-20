import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Prices the items of a single quote before any policy-wide modifier. */
public final class Quote {

    private static final int BLOCK_SIZE = 3;
    private static final BigDecimal BLOCK_PREMIUM = BigDecimal.valueOf(60);

    private static final BigDecimal CURSE_SURCHARGE = new BigDecimal("0.50");
    private static final BigDecimal HIGH_ENCHANTMENT_SURCHARGE = new BigDecimal("0.30");
    private static final int HIGH_ENCHANTMENT = 5;

    private Quote() {
    }

    /**
     * The policy base premium: the sum of all item base premiums, with the block
     * price applied wherever a component type appears exactly {@value #BLOCK_SIZE}
     * times.
     */
    public static BigDecimal basePremium(List<Item> items) {
        BigDecimal total = BigDecimal.ZERO;
        for (Map.Entry<String, Integer> group : componentCounts(items).entrySet()) {
            total = total.add(componentPremium(group.getKey(), group.getValue()));
        }
        for (Item item : items) {
            if (!PriceList.isComponent(item.type())) {
                total = total.add(PriceList.basePremium(item.type()));
            }
        }
        return total;
    }

    /**
     * The sum of the item-specific risk surcharges, each computed on the base
     * premium of the item it applies to rather than on the policy total.
     */
    public static BigDecimal riskSurcharges(List<Item> items) {
        BigDecimal total = BigDecimal.ZERO;
        for (Item item : items) {
            BigDecimal base = PriceList.basePremium(item.type());
            if (item.cursed()) {
                total = total.add(base.multiply(CURSE_SURCHARGE));
            }
            if (item.enchantment() != null && item.enchantment() >= HIGH_ENCHANTMENT) {
                total = total.add(base.multiply(HIGH_ENCHANTMENT_SURCHARGE));
            }
        }
        return total;
    }

    /** The insurance sum of the policy: the unmodified values of all its items. */
    public static BigDecimal insuranceSum(List<Item> items) {
        BigDecimal total = BigDecimal.ZERO;
        for (Item item : items) {
            total = total.add(PriceList.insuranceValue(item.type()));
        }
        return total;
    }

    private static BigDecimal componentPremium(String type, int count) {
        if (count == BLOCK_SIZE) {
            return BLOCK_PREMIUM;
        }
        return PriceList.basePremium(type).multiply(BigDecimal.valueOf(count));
    }

    private static Map<String, Integer> componentCounts(List<Item> items) {
        Map<String, Integer> counts = new LinkedHashMap<>();
        for (Item item : items) {
            if (PriceList.isComponent(item.type())) {
                counts.merge(item.type(), 1, Integer::sum);
            }
        }
        return counts;
    }
}
