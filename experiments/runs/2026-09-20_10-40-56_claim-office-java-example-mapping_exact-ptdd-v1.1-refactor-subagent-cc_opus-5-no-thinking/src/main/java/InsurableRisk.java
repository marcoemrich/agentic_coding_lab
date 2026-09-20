import java.util.Arrays;
import java.util.List;

/**
 * The risks the MHPCO recognises as insurable on a single item, and what each
 * is surcharged at.
 *
 * <p>Each constant knows one risk: how to tell whether an item carries it, and
 * the percentage of that item's base premium the MHPCO levies for it. Knows
 * nothing about how the surcharges of a quote are added up, nor about the
 * policy-wide modifiers (loyalty, first insurance, follow-up contract).
 *
 * <p>Grows whenever the MHPCO recognises a new insurable risk; a constant
 * changes whenever the MHPCO revises that risk's rate or the condition under
 * which it is levied.
 */
enum InsurableRisk {

    CURSE(50) {
        @Override
        boolean isCarriedBy(Item item) {
            return item.cursed();
        }
    },

    /**
     * The MHPCO reads "highly enchanted" inclusively: an item at exactly the
     * threshold already carries the risk.
     */
    HIGH_ENCHANTMENT(30) {
        private static final int HIGH_ENCHANTMENT_FROM = 5;

        @Override
        boolean isCarriedBy(Item item) {
            return item.enchantment() >= HIGH_ENCHANTMENT_FROM;
        }
    };

    private final int surchargePercent;

    InsurableRisk(int surchargePercent) {
        this.surchargePercent = surchargePercent;
    }

    static List<InsurableRisk> carriedBy(Item item) {
        return Arrays.stream(values()).filter(risk -> risk.isCarriedBy(item)).toList();
    }

    abstract boolean isCarriedBy(Item item);

    Percentage surchargeRate() {
        return Percentage.of(surchargePercent);
    }
}
