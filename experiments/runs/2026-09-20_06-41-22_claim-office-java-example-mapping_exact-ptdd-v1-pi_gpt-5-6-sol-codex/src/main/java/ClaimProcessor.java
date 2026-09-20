import com.fasterxml.jackson.databind.JsonNode;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

final class ClaimProcessor {
    int process(Policy policy, JsonNode damages) {
        BigDecimal desiredPayout = BigDecimal.ZERO;
        Map<String, Integer> occurrences = new HashMap<>();
        for (JsonNode damage : damages) {
            int amount = damageAmount(damage);
            String type = damage.path("itemType").asText();
            int occurrence = occurrences.getOrDefault(type, 0);
            JsonNode item = insuredItem(policy, type, occurrence);
            occurrences.put(type, occurrence + 1);
            BigDecimal eventPayout = reimbursableAmount(item, amount).subtract(BigDecimal.valueOf(100));
            desiredPayout = desiredPayout.add(eventPayout.max(BigDecimal.ZERO));
        }
        return policy.pay(desiredPayout.setScale(0, RoundingMode.DOWN).intValueExact());
    }

    private int damageAmount(JsonNode damage) {
        int amount = damage.path("amount").asInt();
        if (amount < 0) {
            throw new IllegalArgumentException("Damage amount must not be negative");
        }
        return amount;
    }

    private BigDecimal reimbursableAmount(JsonNode item, int damageAmount) {
        BigDecimal amount = BigDecimal.valueOf(damageAmount);
        return item.path("enchantment").asInt() >= 8
                ? amount.multiply(new BigDecimal("0.50")) : amount;
    }

    private JsonNode insuredItem(Policy policy, String type, int requestedOccurrence) {
        int occurrence = 0;
        for (JsonNode item : policy.items()) {
            if (type.equals(item.path("type").asText())) {
                if (occurrence == requestedOccurrence) {
                    return item;
                }
                occurrence++;
            }
        }
        throw new IllegalArgumentException("Item is not insured: " + type);
    }
}
