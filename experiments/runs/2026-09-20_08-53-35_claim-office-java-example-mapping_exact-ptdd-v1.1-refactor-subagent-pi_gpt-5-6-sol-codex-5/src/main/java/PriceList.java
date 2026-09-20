import java.util.HashMap;
import java.util.Map;
import java.util.Set;

final class PriceList {
    private static final Set<String> COMPONENT_TYPES = Set.of("rune", "moonstone");
    private PriceList() { }

    static boolean includesItemType(String itemType) {
        return COMPONENT_TYPES.contains(itemType) || itemBasePremium(itemType) > 0;
    }

    static int totalBasePremium(Iterable<InsuredItem> items) {
        int cataloguePremium = 0;
        Map<String, Integer> componentCounts = new HashMap<>();
        for (InsuredItem item : items) {
            if (COMPONENT_TYPES.contains(item.type())) {
                componentCounts.merge(item.type(), 1, Integer::sum);
            } else {
                cataloguePremium += itemBasePremium(item.type());
            }
        }
        int componentPremium = componentCounts.values().stream()
                .mapToInt(ComponentPremium::forAlikeCount)
                .sum();
        return cataloguePremium + componentPremium;
    }

    static int itemBasePremium(String itemType) {
        return switch (itemType) {
            case "sword" -> 100;
            case "amulet" -> 60;
            case "staff" -> 80;
            case "potion" -> 40;
            default -> 0;
        };
    }
}
