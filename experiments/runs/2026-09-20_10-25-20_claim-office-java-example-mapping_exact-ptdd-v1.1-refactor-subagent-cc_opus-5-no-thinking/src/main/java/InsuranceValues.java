import java.util.List;

/**
 * What the MHPCO insures an item for. Each family of insurable item is valued
 * by the pricing policy that owns it: a main item by the price list, a
 * component by the flat component value.
 *
 * This is the one place that decides which valuation an item falls under. It
 * is a separate decision from whether the MHPCO will cover the item at all:
 * the office may take on a new kind of item without changing what the items it
 * already covers are worth, and may revalue what it covers without widening
 * what it accepts.
 */
public final class InsuranceValues {

    private InsuranceValues() {
    }

    /**
     * What a list of items is insured for, all together: each at its own
     * insurance value, summed. What the MHPCO charged to insure them does not
     * enter into it -- neither a risk surcharge nor the component block offer
     * moves the insurance sum.
     */
    public static int insuranceSumOf(List<Item> items) {
        return items.stream()
                .mapToInt(InsuranceValues::insuranceValueOf)
                .sum();
    }

    public static int insuranceValueOf(Item item) {
        if (ComponentPricing.isComponent(item.type())) {
            return ComponentPricing.componentInsuranceValue(item);
        }
        return MainItemPricing.mainItemInsuranceValue(item);
    }
}
