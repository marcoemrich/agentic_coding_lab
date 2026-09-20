import java.math.BigDecimal;
import java.util.List;
import java.util.function.Predicate;

/**
 * The MHPCO's item-specific risk surcharges. A surcharge is charged only for
 * the items that carry the risk, and is measured against that item's own base
 * premium -- never against the policy total.
 */
public final class ItemRiskSurcharges {

    private static final int CURSE_SURCHARGE_PERCENT = 50;

    private static final int HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

    private static final int HIGH_ENCHANTMENT_LEVEL = 5;

    private ItemRiskSurcharges() {
    }

    /**
     * Every item-specific risk surcharge the MHPCO charges, summed. This is the
     * one place that says which risks are item-specific: a new item risk is
     * added here and nowhere else.
     */
    public static BigDecimal totalItemSurcharges(List<Item> items) {
        return curseSurcharge(items).add(highEnchantmentSurcharge(items));
    }

    /**
     * Cursed items add a 50 % risk surcharge on their own base premium.
     */
    private static BigDecimal curseSurcharge(List<Item> items) {
        return surchargeOnItemsAtRisk(items, Item::cursed, CURSE_SURCHARGE_PERCENT);
    }

    /**
     * Highly enchanted items -- enchantment level 5 or more -- add a 30 % risk
     * surcharge on their own base premium.
     */
    private static BigDecimal highEnchantmentSurcharge(List<Item> items) {
        return surchargeOnItemsAtRisk(
                items, ItemRiskSurcharges::isHighlyEnchanted, HIGH_ENCHANTMENT_SURCHARGE_PERCENT);
    }

    private static boolean isHighlyEnchanted(Item item) {
        return item.enchantment() >= HIGH_ENCHANTMENT_LEVEL;
    }

    /**
     * The MHPCO's scope rule for every item-specific surcharge, decided in one
     * place: only the items carrying the risk are charged, each against its own
     * base premium, and the amounts are summed into the policy premium.
     *
     * Every risk the MHPCO recognises is a property of a main item -- a curse
     * or an enchantment -- so only main items can carry one, and the base
     * premium measured against is the price-list premium of that main item.
     */
    private static BigDecimal surchargeOnItemsAtRisk(
            List<Item> items, Predicate<Item> carriesTheRisk, int surchargePercent) {
        return items.stream()
                .filter(carriesTheRisk)
                .map(item -> Percentage.of(MainItemPricing.mainItemBasePremium(item), surchargePercent))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
