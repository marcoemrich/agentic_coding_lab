import java.math.BigDecimal;
import java.util.List;

/**
 * How the MHPCO rates the risk an individual item carries. A risky trait costs a
 * surcharge on that item's own base premium, never on the policy total -- the office
 * charges for the risk it takes on the item, not for the company the item keeps.
 */
public final class ItemRiskRating {

    private static final BigDecimal CURSE_SURCHARGE_RATE = Modifier.rate(50);
    private static final BigDecimal HIGH_ENCHANTMENT_SURCHARGE_RATE = Modifier.rate(30);

    /** From this enchantment level on, the MHPCO considers an item highly enchanted. */
    private static final int HIGH_ENCHANTMENT_LEVEL = 5;

    private ItemRiskRating() {
    }

    /** The risk surcharges every item in the policy contributes, added up. */
    public static BigDecimal surchargesFor(List<Item> items) {
        return items.stream()
                .map(ItemRiskRating::surchargeFor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /** What this item's own risky traits add to the premium. */
    private static BigDecimal surchargeFor(Item item) {
        BigDecimal itemBasePremium = MhpcoPriceList.basePremiumOf(item);
        BigDecimal surcharge = BigDecimal.ZERO;
        if (item.cursed()) {
            surcharge = surcharge.add(itemBasePremium.multiply(CURSE_SURCHARGE_RATE));
        }
        if (isHighlyEnchanted(item)) {
            surcharge = surcharge.add(
                    itemBasePremium.multiply(HIGH_ENCHANTMENT_SURCHARGE_RATE));
        }
        return surcharge;
    }

    private static boolean isHighlyEnchanted(Item item) {
        return item.enchantment() >= HIGH_ENCHANTMENT_LEVEL;
    }
}
