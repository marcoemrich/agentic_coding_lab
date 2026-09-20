import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * What the office considers "alike" when it looks for a building block.
 *
 * The office reads "alike" as items of the same type: three runes are alike, two runes
 * and a moonstone are not. Groups are kept in the order their first item was insured.
 */
public class AlikeItems {

    public Collection<List<Item>> groupsIn(List<Item> items) {
        Map<String, List<Item>> byType = new LinkedHashMap<>();
        for (Item item : items) {
            byType.computeIfAbsent(item.type(), type -> new ArrayList<>()).add(item);
        }
        return byType.values();
    }
}
