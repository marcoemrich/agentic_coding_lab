import java.util.HashMap;
import java.util.List;
import java.util.Map;

final class MhpcoPriceList {
    private static final int COMPONENT_UNIT_BASE_PREMIUM = 25;
    private static final int COMPONENT_BLOCK_SIZE = 3;
    private static final int COMPONENT_BLOCK_BASE_PREMIUM = 60;

    private MhpcoPriceList() { }

    static int basePremium(String type) {
        return entry(type).basePremium();
    }

    static int insuranceValue(String type) {
        return entry(type).insuranceValue();
    }

    static void requireKnownItemType(String type) {
        entry(type);
    }

    private static boolean isComponent(String type) {
        return entry(type).component();
    }

    static int basePremium(List<String> itemTypes) {
        Map<String, Integer> componentCountsByType = new HashMap<>();
        int total = 0;
        for (String type : itemTypes) {
            if (isComponent(type)) {
                componentCountsByType.merge(type, 1, Integer::sum);
            } else {
                total += basePremium(type);
            }
        }
        return total + componentCountsByType.values().stream()
                .mapToInt(MhpcoPriceList::componentGroupPremium).sum();
    }

    private static int componentGroupPremium(int componentCount) {
        return formsBuildingBlock(componentCount)
                ? COMPONENT_BLOCK_BASE_PREMIUM
                : componentCount * COMPONENT_UNIT_BASE_PREMIUM;
    }

    private static boolean formsBuildingBlock(int componentCount) {
        return componentCount == COMPONENT_BLOCK_SIZE;
    }

    private static CatalogueEntry entry(String type) {
        return switch (type) {
            case "sword" -> new CatalogueEntry(1000, 100, false);
            case "amulet" -> new CatalogueEntry(600, 60, false);
            case "staff" -> new CatalogueEntry(800, 80, false);
            case "potion" -> new CatalogueEntry(400, 40, false);
            case "rune" -> new CatalogueEntry(250, COMPONENT_UNIT_BASE_PREMIUM, true);
            case "moonstone" -> new CatalogueEntry(250, COMPONENT_UNIT_BASE_PREMIUM, true);
            default -> throw new IllegalArgumentException("Unknown item type: " + type);
        };
    }

    private record CatalogueEntry(int insuranceValue, int basePremium, boolean component) { }
}
