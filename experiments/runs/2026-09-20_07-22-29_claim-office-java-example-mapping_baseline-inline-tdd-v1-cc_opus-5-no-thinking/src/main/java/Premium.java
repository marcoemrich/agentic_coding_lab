import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Computes premiums according to the MHPCO's price list and modifiers. */
final class Premium {

    private static final int BLOCK_SIZE = 3;
    private static final BigDecimal BLOCK_PREMIUM = BigDecimal.valueOf(60);
    private static final BigDecimal CURSE_SURCHARGE = new BigDecimal("0.5");
    private static final BigDecimal HIGH_ENCHANTMENT_SURCHARGE = new BigDecimal("0.3");
    private static final int HIGH_ENCHANTMENT = 5;
    private static final BigDecimal LOYALTY_DISCOUNT = new BigDecimal("0.2");
    private static final BigDecimal FIRST_INSURANCE_SURCHARGE = new BigDecimal("0.1");
    private static final BigDecimal FOLLOW_UP_DISCOUNT = new BigDecimal("0.15");
    private static final BigDecimal PROCESSING_FEE = BigDecimal.valueOf(5);

    private Premium() {
    }

    /**
     * The premium for a quote, in whole G.
     *
     * @param previousContracts the number of quotes the customer already holds in this scenario
     */
    static int quote(Customer customer, int previousContracts, List<Item> items) {
        BigDecimal base = policyBasePremium(items);
        BigDecimal total = base.add(itemSurcharges(items));
        if (customer.isLongStanding()) {
            total = total.subtract(base.multiply(LOYALTY_DISCOUNT));
        }
        total = total.add(base.multiply(FIRST_INSURANCE_SURCHARGE));
        if (previousContracts > 0) {
            total = total.subtract(base.multiply(FOLLOW_UP_DISCOUNT));
        }
        return roundPremium(total.add(PROCESSING_FEE));
    }

    /** Premiums are rounded up — in the MHPCO's favour. */
    static int roundPremium(BigDecimal amount) {
        return amount.setScale(0, java.math.RoundingMode.CEILING).intValueExact();
    }

    /** The sum of all item base premiums, with the component block discount applied. */
    static BigDecimal policyBasePremium(List<Item> items) {
        BigDecimal total = BigDecimal.ZERO;
        Map<String, Integer> componentCounts = new LinkedHashMap<>();
        for (Item item : items) {
            if (item.isComponent()) {
                componentCounts.merge(item.type(), 1, Integer::sum);
            } else {
                total = total.add(BigDecimal.valueOf(item.basePremium()));
            }
        }
        for (Map.Entry<String, Integer> counted : componentCounts.entrySet()) {
            total = total.add(componentsPremium(counted.getKey(), counted.getValue()));
        }
        return total;
    }

    /** The surcharges the item-specific modifiers add to the policy base premium. */
    static BigDecimal itemSurcharges(List<Item> items) {
        BigDecimal total = BigDecimal.ZERO;
        for (Item item : items) {
            BigDecimal base = BigDecimal.valueOf(item.basePremium());
            if (item.cursed()) {
                total = total.add(base.multiply(CURSE_SURCHARGE));
            }
            if (item.enchantment() >= HIGH_ENCHANTMENT) {
                total = total.add(base.multiply(HIGH_ENCHANTMENT_SURCHARGE));
            }
        }
        return total;
    }

    private static BigDecimal componentsPremium(String type, int count) {
        if (count == BLOCK_SIZE) {
            return BLOCK_PREMIUM;
        }
        return BigDecimal.valueOf((long) count * PriceList.basePremium(type));
    }
}
