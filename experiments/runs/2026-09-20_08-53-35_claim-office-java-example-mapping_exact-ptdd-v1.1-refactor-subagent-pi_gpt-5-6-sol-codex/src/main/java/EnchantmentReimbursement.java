import com.fasterxml.jackson.databind.JsonNode;

final class EnchantmentReimbursement {
    private static final int HIGH_ENCHANTMENT_THRESHOLD = 8;
    private static final int HALF_REIMBURSEMENT_DIVISOR = 2;

    private EnchantmentReimbursement() {
    }

    static long applyTo(JsonNode insuredItem, long reportedDamageInHalfGold) {
        if (insuredItem.path("enchantment").asInt() >= HIGH_ENCHANTMENT_THRESHOLD) {
            return reportedDamageInHalfGold / HALF_REIMBURSEMENT_DIVISOR;
        }
        return reportedDamageInHalfGold;
    }
}
