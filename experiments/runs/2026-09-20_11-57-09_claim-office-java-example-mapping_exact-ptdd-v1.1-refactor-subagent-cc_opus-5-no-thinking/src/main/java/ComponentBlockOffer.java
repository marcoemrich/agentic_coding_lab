import java.util.List;

/**
 * The office's building-block offer: a group of exactly three alike components is
 * charged one special block premium instead of the sum of its components.
 *
 * A group that does not match the offer -- too few or too many components, or main
 * items rather than components -- is charged item by item at the listed price.
 */
public class ComponentBlockOffer {

    private static final int BLOCK_SIZE = 3;
    private static final int BLOCK_BASE_PREMIUM = 60;

    private final PriceList priceList = new PriceList();

    public double basePremiumFor(List<Item> alikeItems) {
        if (formsABlock(alikeItems)) {
            return BLOCK_BASE_PREMIUM;
        }
        return listedPriceOf(alikeItems);
    }

    /**
     * The group is alike by type, so its first item speaks for all of them when the office
     * asks whether it is looking at components.
     */
    private boolean formsABlock(List<Item> alikeItems) {
        return alikeItems.size() == BLOCK_SIZE && priceList.isComponent(alikeItems.get(0));
    }

    private double listedPriceOf(List<Item> items) {
        double total = 0;
        for (Item item : items) {
            total += priceList.basePremiumFor(item);
        }
        return total;
    }
}
