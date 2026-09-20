import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Prices the components of a policy, honouring the MHPCO's building block of
 * 3 alike components. "Alike" means components of exactly the same type.
 */
final class ComponentBlocks {

    private ComponentBlocks() {
    }

    static double basePremiumOf(List<Item> items) {
        Map<String, Integer> countsPerType = new LinkedHashMap<>();
        for (Item item : items) {
            if (PriceList.isComponent(item.type())) {
                countsPerType.merge(item.type(), 1, Integer::sum);
            }
        }
        double basePremium = 0;
        for (Map.Entry<String, Integer> alikeComponents : countsPerType.entrySet()) {
            basePremium += PriceList.basePremiumOfAlikeComponents(
                    alikeComponents.getKey(), alikeComponents.getValue());
        }
        return basePremium;
    }
}
