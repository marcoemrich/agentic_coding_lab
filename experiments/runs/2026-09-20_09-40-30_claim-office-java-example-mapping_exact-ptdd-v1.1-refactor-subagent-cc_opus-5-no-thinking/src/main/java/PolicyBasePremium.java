import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * What the office charges for a policy's items before any modifier: every main item
 * at its price-list premium, and each group of alike components priced together, so
 * that the MHPCO's building-block offer can be recognised.
 *
 * <p>The block is an offer on the premium alone. It deliberately says nothing about
 * what the office insures those components for.
 */
public final class PolicyBasePremium {

    /** A building block of exactly 3 alike components is offered at a special price. */
    private static final int COMPONENT_BLOCK_SIZE = 3;
    private static final int COMPONENT_BLOCK_BASE_PREMIUM = 60;

    private PolicyBasePremium() {
    }

    public static BigDecimal of(List<Item> items) {
        BigDecimal mainItems = items.stream()
                .filter(item -> !MhpcoPriceList.isComponent(item))
                .map(MhpcoPriceList::basePremiumOf)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal components = alikeComponentCounts(items).values().stream()
                .map(PolicyBasePremium::alikeComponentsBasePremiumOf)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return mainItems.add(components);
    }

    /** How many components of each type the policy covers, grouped by their type. */
    private static Map<String, Long> alikeComponentCounts(List<Item> items) {
        return items.stream()
                .filter(MhpcoPriceList::isComponent)
                .collect(Collectors.groupingBy(Item::type, Collectors.counting()));
    }

    /**
     * What the office charges for the alike components of one type: a building block
     * is offered at its special price, anything else is priced component by component.
     */
    private static BigDecimal alikeComponentsBasePremiumOf(long alikeCount) {
        if (formsBuildingBlock(alikeCount)) {
            return BigDecimal.valueOf(COMPONENT_BLOCK_BASE_PREMIUM);
        }
        return BigDecimal.valueOf(alikeCount * MhpcoPriceList.COMPONENT_BASE_PREMIUM);
    }

    /** The block price is offered for exactly 3 alike components -- no more, no less. */
    private static boolean formsBuildingBlock(long alikeCount) {
        return alikeCount == COMPONENT_BLOCK_SIZE;
    }
}
