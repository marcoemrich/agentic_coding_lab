import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Base premium for components. Exactly three alike components form a building block priced at a
 * flat 60 G; any other count is billed per component at the regular rate.
 */
public final class ComponentBlocks {

    private static final int BLOCK_SIZE = 3;
    private static final int BLOCK_PREMIUM = 60;

    private ComponentBlocks() {
    }

    public static int basePremium(List<Item> components) {
        Map<String, Long> countsByType = components.stream()
                .collect(Collectors.groupingBy(Item::type, Collectors.counting()));
        return countsByType.entrySet().stream()
                .mapToInt(entry -> premiumFor(entry.getKey(), entry.getValue().intValue()))
                .sum();
    }

    private static int premiumFor(String type, int count) {
        if (count == BLOCK_SIZE) {
            return BLOCK_PREMIUM;
        }
        return count * PriceList.basePremium(type);
    }
}
