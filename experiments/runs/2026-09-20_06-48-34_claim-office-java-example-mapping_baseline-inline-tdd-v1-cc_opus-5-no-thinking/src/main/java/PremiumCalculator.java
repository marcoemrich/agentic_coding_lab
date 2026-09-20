import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Computes the premium of a policy according to the MHPCO price list. */
public class PremiumCalculator {

    private static final BigDecimal PROCESSING_FEE = BigDecimal.valueOf(5);
    private static final BigDecimal CURSE_SURCHARGE = new BigDecimal("0.5");
    private static final BigDecimal HIGH_ENCHANTMENT_SURCHARGE = new BigDecimal("0.3");
    private static final int HIGH_ENCHANTMENT_LEVEL = 5;
    private static final BigDecimal LOYALTY_DISCOUNT = new BigDecimal("0.2");
    private static final int LOYALTY_YEARS = 2;
    private static final BigDecimal FIRST_INSURANCE_SURCHARGE = new BigDecimal("0.1");
    private static final BigDecimal FOLLOW_UP_DISCOUNT = new BigDecimal("0.15");

    /**
     * The premium of one contract: item base premiums plus the item-specific risk surcharges,
     * plus the policy-wide modifiers on the policy base premium, plus the processing fee.
     * Only the final amount is rounded, upwards in the office's favour.
     */
    public int quote(List<Item> items, Customer customer, int previousContracts) {
        BigDecimal policyBase = BigDecimal.ZERO;
        BigDecimal itemSurcharges = BigDecimal.ZERO;
        for (Map.Entry<Item, BigDecimal> priced : basePremiums(items)) {
            policyBase = policyBase.add(priced.getValue());
            itemSurcharges = itemSurcharges.add(priced.getValue().multiply(itemSurcharge(priced.getKey())));
        }
        BigDecimal premium = policyBase
                .add(itemSurcharges)
                .add(policyBase.multiply(policyModifier(customer, previousContracts)))
                .add(PROCESSING_FEE);
        return premium.setScale(0, RoundingMode.CEILING).intValueExact();
    }

    /**
     * The base premium of each item. Components of one type are priced as a block if there are
     * exactly {@link PriceList#BLOCK_SIZE} of them; the block price is then shared equally
     * among them so that item-specific surcharges still apply per component.
     */
    private List<Map.Entry<Item, BigDecimal>> basePremiums(List<Item> items) {
        List<Map.Entry<Item, BigDecimal>> priced = new ArrayList<>();
        Map<String, List<Item>> componentsByType = new LinkedHashMap<>();
        for (Item item : items) {
            if (PriceList.isComponent(item.type())) {
                componentsByType.computeIfAbsent(item.type(), type -> new ArrayList<>()).add(item);
            } else {
                priced.add(Map.entry(item, BigDecimal.valueOf(PriceList.basePremium(item.type()))));
            }
        }
        for (List<Item> alike : componentsByType.values()) {
            BigDecimal each = alike.size() == PriceList.BLOCK_SIZE
                    ? BigDecimal.valueOf(PriceList.BLOCK_BASE_PREMIUM)
                            .divide(BigDecimal.valueOf(PriceList.BLOCK_SIZE))
                    : BigDecimal.valueOf(PriceList.basePremium(alike.get(0).type()));
            alike.forEach(component -> priced.add(Map.entry(component, each)));
        }
        return priced;
    }

    /** Item-specific modifiers apply to the base premium of the affected item only. */
    private BigDecimal itemSurcharge(Item item) {
        BigDecimal surcharge = BigDecimal.ZERO;
        if (item.cursed()) {
            surcharge = surcharge.add(CURSE_SURCHARGE);
        }
        if (item.enchantment() >= HIGH_ENCHANTMENT_LEVEL) {
            surcharge = surcharge.add(HIGH_ENCHANTMENT_SURCHARGE);
        }
        return surcharge;
    }

    /** Policy-wide modifiers apply to the policy base premium, before the item surcharges. */
    private BigDecimal policyModifier(Customer customer, int previousContracts) {
        BigDecimal modifier = FIRST_INSURANCE_SURCHARGE;
        if (customer.yearsWithMHPCO() >= LOYALTY_YEARS) {
            modifier = modifier.subtract(LOYALTY_DISCOUNT);
        }
        if (previousContracts > 0) {
            modifier = modifier.subtract(FOLLOW_UP_DISCOUNT);
        }
        return modifier;
    }
}
