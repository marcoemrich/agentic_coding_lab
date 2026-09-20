import java.math.BigDecimal;
import java.util.List;

/**
 * The MHPCO's special offer on alike components.
 *
 * <p>Knows what a group of alike items is tariffed at: a group that forms a
 * building block carries a special base premium; any other group is tariffed
 * item by item at the price list. Knows nothing about how the items of a quote
 * are grouped or added up.
 *
 * <p>Changes whenever the MHPCO revises the offer — which groups qualify as a
 * block, or the block's special base premium.
 */
final class BuildingBlock {

    private static final int BLOCK_SIZE = 3;
    private static final BigDecimal BLOCK_BASE_PREMIUM_IN_G = BigDecimal.valueOf(60);

    private BuildingBlock() {
    }

    static BigDecimal basePremiumFor(List<Item> alike) {
        if (formsABlock(alike)) {
            return BLOCK_BASE_PREMIUM_IN_G;
        }
        return alike.stream()
                .map(PriceList::basePremiumFor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static boolean formsABlock(List<Item> alike) {
        return alike.size() == BLOCK_SIZE;
    }
}
