import com.fasterxml.jackson.databind.JsonNode;

final class Policy {
    private final JsonNode items;
    private int remainingCap;

    Policy(JsonNode items, int insuranceSum) {
        this.items = items.deepCopy();
        this.remainingCap = insuranceSum * 2;
    }

    JsonNode items() {
        return items;
    }

    int remainingCap() {
        return remainingCap;
    }

    int payUpToCap(int desiredPayout) {
        int payout = Math.min(desiredPayout, remainingCap);
        remainingCap -= payout;
        return payout;
    }
}
