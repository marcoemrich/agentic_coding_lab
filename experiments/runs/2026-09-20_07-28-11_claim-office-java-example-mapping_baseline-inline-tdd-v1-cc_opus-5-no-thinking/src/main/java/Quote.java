import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/** Premium calculation for a quote step. */
public final class Quote {

    private static final BigDecimal CURSE_SURCHARGE = new BigDecimal("0.50");
    private static final BigDecimal HIGH_ENCHANTMENT_SURCHARGE = new BigDecimal("0.30");
    private static final BigDecimal LOYALTY_DISCOUNT = new BigDecimal("0.20");
    private static final BigDecimal FIRST_INSURANCE_SURCHARGE = new BigDecimal("0.10");
    private static final BigDecimal FOLLOW_UP_DISCOUNT = new BigDecimal("0.15");
    private static final BigDecimal PROCESSING_FEE = new BigDecimal(5);

    private static final int HIGH_ENCHANTMENT_LEVEL = 5;
    private static final int LOYALTY_YEARS = 2;

    private Quote() {
    }

    /**
     * Total premium in G, rounded up (in the MHPCO's favor).
     *
     * @param contractNumber one-based position of this quote among the customer's contracts
     */
    public static int premium(Customer customer, int contractNumber, List<Item> items) {
        BigDecimal base = Policy.basePremium(items);
        BigDecimal total = base.add(itemSurcharges(items)).add(policyModifiers(customer, contractNumber, base));
        return total.add(PROCESSING_FEE).setScale(0, RoundingMode.CEILING).intValueExact();
    }

    /** Curse and high-enchantment surcharges, each on the affected item's own base premium. */
    private static BigDecimal itemSurcharges(List<Item> items) {
        BigDecimal surcharges = BigDecimal.ZERO;
        for (Item item : items) {
            BigDecimal itemBase = PriceList.basePremium(item.type());
            if (item.cursed()) {
                surcharges = surcharges.add(itemBase.multiply(CURSE_SURCHARGE));
            }
            if (item.enchantment() >= HIGH_ENCHANTMENT_LEVEL) {
                surcharges = surcharges.add(itemBase.multiply(HIGH_ENCHANTMENT_SURCHARGE));
            }
        }
        return surcharges;
    }

    /**
     * Loyalty, first-insurance and follow-up-contract modifiers, all on the policy
     * base premium. Every item in a quote counts as a first insurance regardless of
     * customer history, so the surcharge always applies.
     */
    private static BigDecimal policyModifiers(Customer customer, int contractNumber, BigDecimal base) {
        BigDecimal modifiers = base.multiply(FIRST_INSURANCE_SURCHARGE);
        if (customer.yearsWithMHPCO() >= LOYALTY_YEARS) {
            modifiers = modifiers.subtract(base.multiply(LOYALTY_DISCOUNT));
        }
        if (contractNumber > 1) {
            modifiers = modifiers.subtract(base.multiply(FOLLOW_UP_DISCOUNT));
        }
        return modifiers;
    }
}
