import com.fasterxml.jackson.databind.JsonNode;

final class DamageReimbursement {
    static final int HALF_GOLD_UNITS_PER_GOLD = 2;
    private static final int DEDUCTIBLE_IN_GOLD = 100;

    private DamageReimbursement() {
    }

    static long payoutInHalfGold(JsonNode insuredItem, DamageReport damage) {
        long reimbursedDamageInHalfGold = reimbursedDamageInHalfGold(insuredItem, damage);
        return payoutAfterDeductibleInHalfGold(reimbursedDamageInHalfGold);
    }

    private static long payoutAfterDeductibleInHalfGold(long reimbursedDamageInHalfGold) {
        return Math.max(0, reimbursedDamageInHalfGold
                - DEDUCTIBLE_IN_GOLD * HALF_GOLD_UNITS_PER_GOLD);
    }

    private static long reimbursedDamageInHalfGold(JsonNode insuredItem, DamageReport damage) {
        long reportedDamageInHalfGold = (long) damage.amount() * HALF_GOLD_UNITS_PER_GOLD;
        return EnchantmentReimbursement.applyTo(insuredItem, reportedDamageInHalfGold);
    }
}
