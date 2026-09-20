import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The base premium the MHPCO tariffs a whole quote at.
 *
 * <p>Knows that the items of a quote are tariffed in groups of alike items and
 * that the policy base premium is the sum over those groups. Defers what a
 * group of alike items costs to the MHPCO's building block offer, and knows
 * nothing about the surcharges, discounts and the processing fee that turn a
 * base premium into a premium.
 *
 * <p>Holds the MHPCO's reading of "alike": items are alike when they are of
 * the same type, not merely of the same family. Two runes and a moonstone are
 * therefore two groups, not one group of gemstone-y things.
 */
final class PolicyBasePremium {

    private PolicyBasePremium() {
    }

    static BigDecimal of(List<Item> items) {
        return items.stream()
                .collect(Collectors.groupingBy(Item::type))
                .values().stream()
                .map(BuildingBlock::basePremiumFor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
