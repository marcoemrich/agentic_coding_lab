import java.util.List;

/**
 * The item types the MHPCO insures at all: the main items of its price list
 * and the components it offers. An item of any other type cannot be covered,
 * and the MHPCO declines the whole request rather than quoting around it.
 *
 * This is the one place that decides what the office will take on. What an
 * accepted item is insured for is a separate decision, made by
 * {@link InsuranceValues}.
 */
public final class InsurableItems {

    private InsurableItems() {
    }

    public static boolean isInsurable(String itemType) {
        return MainItemPricing.isMainItem(itemType) || ComponentPricing.isComponent(itemType);
    }

    public static void requireAllInsurable(List<Item> items) {
        items.stream()
                .map(Item::type)
                .filter(itemType -> !isInsurable(itemType))
                .findFirst()
                .ifPresent(itemType -> {
                    throw new IllegalArgumentException(
                            "The MHPCO does not insure items of type " + itemType);
                });
    }
}
