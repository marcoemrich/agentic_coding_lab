import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * The MHPCO pricing policy for components: 25 G base premium each, with a
 * building block of exactly 3 alike components offered at 60 G.
 */
public final class ComponentPricing {

    private static final Set<String> COMPONENT_TYPES = Set.of("rune", "moonstone");

    private static final int COMPONENT_BASE_PREMIUM_IN_G = 25;

    private static final int COMPONENT_INSURANCE_VALUE_IN_G = 250;

    private static final int COMPONENTS_PER_BLOCK = 3;

    private static final int BLOCK_BASE_PREMIUM_IN_G = 60;

    private ComponentPricing() {
    }

    public static boolean isComponent(String itemType) {
        return COMPONENT_TYPES.contains(itemType);
    }

    /**
     * The base premium for every component in a policy: components are grouped
     * into sets of alike components, and each set is priced on its own.
     */
    public static int componentsBasePremium(List<Item> items) {
        Map<String, Long> alikeCounts = items.stream()
                .filter(item -> isComponent(item.type()))
                .collect(Collectors.groupingBy(ComponentPricing::alikeGroup, Collectors.counting()));
        return alikeCounts.values().stream()
                .mapToInt(count -> alikeComponentsBasePremium(count.intValue()))
                .sum();
    }

    /**
     * Components are alike when they are of the same item type: a rune and a
     * moonstone are never alike, however rune-y or gemstone-y they look. This
     * is the one place the MHPCO's reading of "alike" is decided.
     */
    private static String alikeGroup(Item item) {
        return item.type();
    }

    private static int alikeComponentsBasePremium(int count) {
        if (formsABlock(count)) {
            return BLOCK_BASE_PREMIUM_IN_G;
        }
        return count * COMPONENT_BASE_PREMIUM_IN_G;
    }

    /**
     * The MHPCO offers the block only for exactly 3 alike components: 4 alike
     * components are not a block plus a spare, and 7 are not two blocks plus a
     * spare -- each of those is charged at the full per-component premium.
     */
    private static boolean formsABlock(int alikeCount) {
        return alikeCount == COMPONENTS_PER_BLOCK;
    }

    /**
     * Every component is insured at 250 G, whatever the MHPCO charges for the
     * set it belongs to: the block offer reduces the premium, not the value.
     */
    public static int componentInsuranceValue(Item item) {
        return COMPONENT_INSURANCE_VALUE_IN_G;
    }
}
