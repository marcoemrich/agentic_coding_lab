import java.math.BigDecimal;
import java.util.List;

/**
 * Computes the premium for a policy.
 *
 * <p>Item-specific modifiers (curse, high enchantment) apply to the base premium of the affected
 * item; policy-wide modifiers (loyalty, first insurance, follow-up contract) apply to the policy
 * base premium. The processing fee is added at the very end. Intermediate amounts stay fractional;
 * only the final premium is rounded.
 */
public final class PremiumCalculator {

    private static final BigDecimal CURSE_SURCHARGE = new BigDecimal("0.50");
    private static final BigDecimal HIGH_ENCHANTMENT_SURCHARGE = new BigDecimal("0.30");
    private static final BigDecimal LOYALTY_DISCOUNT = new BigDecimal("0.20");
    private static final BigDecimal FIRST_INSURANCE_SURCHARGE = new BigDecimal("0.10");
    private static final BigDecimal FOLLOW_UP_DISCOUNT = new BigDecimal("0.15");
    private static final BigDecimal PROCESSING_FEE = new BigDecimal("5");

    private PremiumCalculator() {
    }

    public static int premium(Customer customer, int previousContracts, List<Item> items) {
        BigDecimal base = policyBasePremium(items);
        BigDecimal total = base
                .add(itemSurcharges(items))
                .add(policyModifiers(customer, previousContracts, base))
                .add(PROCESSING_FEE);
        return MhpcoRounding.premium(total);
    }

    /** The sum of all item base premiums, with component building blocks already discounted. */
    public static BigDecimal policyBasePremium(List<Item> items) {
        int mainItems = items.stream()
                .filter(item -> !item.isComponent())
                .mapToInt(item -> PriceList.basePremium(item.type()))
                .sum();
        int components = ComponentBlocks.basePremium(
                items.stream().filter(Item::isComponent).toList());
        return BigDecimal.valueOf(mainItems + components);
    }

    private static BigDecimal itemSurcharges(List<Item> items) {
        return items.stream()
                .map(PremiumCalculator::surchargesFor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static BigDecimal surchargesFor(Item item) {
        BigDecimal itemBase = BigDecimal.valueOf(PriceList.basePremium(item.type()));
        BigDecimal surcharges = BigDecimal.ZERO;
        if (item.cursed()) {
            surcharges = surcharges.add(itemBase.multiply(CURSE_SURCHARGE));
        }
        if (item.isHighlyEnchanted()) {
            surcharges = surcharges.add(itemBase.multiply(HIGH_ENCHANTMENT_SURCHARGE));
        }
        return surcharges;
    }

    private static BigDecimal policyModifiers(
            Customer customer, int previousContracts, BigDecimal base) {
        BigDecimal modifiers = base.multiply(FIRST_INSURANCE_SURCHARGE);
        if (customer.isLongStanding()) {
            modifiers = modifiers.subtract(base.multiply(LOYALTY_DISCOUNT));
        }
        if (previousContracts > 0) {
            modifiers = modifiers.subtract(base.multiply(FOLLOW_UP_DISCOUNT));
        }
        return modifiers;
    }
}
