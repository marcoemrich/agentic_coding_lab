import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * The insured items still available during one incident. Each damage claims one insured item of
 * its type; a damage naming a type the policy no longer covers is rejected.
 */
final class IncidentCoverage {

    private final List<Map<String, Object>> stillCovered;

    IncidentCoverage(List<Map<String, Object>> insuredItems) {
        this.stillCovered = new ArrayList<>(insuredItems);
    }

    Map<String, Object> claimItemOfType(String itemType) {
        for (Map<String, Object> item : stillCovered) {
            if (item.get("type").equals(itemType)) {
                stillCovered.remove(item);
                return item;
            }
        }
        throw new IllegalArgumentException(
                "The policy does not insure a further item of type " + itemType);
    }
}
