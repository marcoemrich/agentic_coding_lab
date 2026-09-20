import com.fasterxml.jackson.databind.JsonNode;

final class DamageReport {
    private final int amount;

    DamageReport(JsonNode damage) {
        amount = damage.path("amount").asInt();
        if (amount < 0) {
            throw new IllegalArgumentException("Damage amount must not be negative");
        }
    }

    int amount() {
        return amount;
    }
}
