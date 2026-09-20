import java.util.HashMap;
import java.util.List;
import java.util.Map;

final class PolicyDamageCoverage {
    private PolicyDamageCoverage() { }

    static boolean coversEveryDamage(List<InsuredItem> insuredItems, List<DamageEvent> damages) {
        Map<String, Integer> availableByType = new HashMap<>();
        for (InsuredItem item : insuredItems) {
            availableByType.merge(item.type(), 1, Integer::sum);
        }
        for (DamageEvent damage : damages) {
            if (availableByType.merge(damage.itemType(), -1, Integer::sum) < 0) {
                return false;
            }
        }
        return true;
    }
}
