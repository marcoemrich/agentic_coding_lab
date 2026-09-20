import com.fasterxml.jackson.databind.JsonNode;

final class Policy {
    private final JsonNode items;
    private int remainingCap;

    Policy(JsonNode items) {
        this.items = items.deepCopy();
        int insuranceSum = 0;
        for (JsonNode item : items) {
            insuranceSum += ItemCatalog.insuranceValue(item.path("type").asText());
        }
        remainingCap = insuranceSum * 2;
    }

    JsonNode items() {
        return items;
    }

    int remainingCap() {
        return remainingCap;
    }

    int pay(int desiredPayout) {
        int payout = Math.min(desiredPayout, remainingCap);
        remainingCap -= payout;
        return payout;
    }
}
