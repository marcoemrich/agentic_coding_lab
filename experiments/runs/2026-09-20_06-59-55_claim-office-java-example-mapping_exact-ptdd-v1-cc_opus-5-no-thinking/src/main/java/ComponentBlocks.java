import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** The MHPCO offer for components: a building block of 3 alike components has a special premium. */
final class ComponentBlocks {

    private static final int BLOCK_SIZE = 3;
    private static final int BLOCK_PREMIUM = 60;
    private static final List<String> COMPONENT_TYPES = List.of("rune", "moonstone");

    private ComponentBlocks() {
    }

    static boolean isComponent(String type) {
        return COMPONENT_TYPES.contains(type);
    }

    static Map<String, List<Map<String, Object>>> groupAlike(List<Map<String, Object>> components) {
        Map<String, List<Map<String, Object>>> alike = new LinkedHashMap<>();
        for (Map<String, Object> component : components) {
            alike.computeIfAbsent((String) component.get("type"), unused -> new ArrayList<>()).add(component);
        }
        return alike;
    }

    static boolean formsBlock(List<Map<String, Object>> alike) {
        return alike.size() == BLOCK_SIZE;
    }

    static int blockPremium() {
        return BLOCK_PREMIUM;
    }
}
