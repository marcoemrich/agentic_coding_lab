import com.fasterxml.jackson.databind.JsonNode;
import java.util.List;

final class DamageOccurrenceCoverage {
    private final List<JsonNode> insuredItems;
    private final boolean[] claimedOccurrences;

    DamageOccurrenceCoverage(List<JsonNode> insuredItems) {
        this.insuredItems = insuredItems;
        claimedOccurrences = new boolean[insuredItems.size()];
    }

    JsonNode claimInsuredOccurrence(String damagedItemType) {
        for (int index = 0; index < insuredItems.size(); index++) {
            if (!claimedOccurrences[index]
                    && damagedItemType.equals(insuredItems.get(index).path("type").asText())) {
                claimedOccurrences[index] = true;
                return insuredItems.get(index);
            }
        }
        throw new IllegalArgumentException(
                "Damage item is not covered by policy: " + damagedItemType);
    }
}
