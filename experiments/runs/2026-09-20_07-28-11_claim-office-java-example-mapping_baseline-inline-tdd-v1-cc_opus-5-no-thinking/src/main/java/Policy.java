import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Premium calculation for a list of insured items. */
public final class Policy {

    private Policy() {
    }

    /**
     * Sum of the item base premiums. Components of the same type form a building
     * block at a special rate when there are exactly {@link PriceList#BLOCK_SIZE}
     * of them; any other count is charged per component.
     */
    public static BigDecimal basePremium(List<Item> items) {
        BigDecimal total = BigDecimal.ZERO;
        Map<String, Integer> componentCounts = new LinkedHashMap<>();

        for (Item item : items) {
            String type = item.type();
            if (PriceList.isComponent(type)) {
                componentCounts.merge(type, 1, Integer::sum);
            } else {
                total = total.add(PriceList.basePremium(type));
            }
        }

        for (Map.Entry<String, Integer> entry : componentCounts.entrySet()) {
            total = total.add(componentsPremium(entry.getKey(), entry.getValue()));
        }
        return total;
    }

    private static BigDecimal componentsPremium(String type, int count) {
        if (count == PriceList.BLOCK_SIZE) {
            return PriceList.BLOCK_PREMIUM;
        }
        return PriceList.basePremium(type).multiply(new BigDecimal(count));
    }
}
