final class ClaimReimbursementPolicy {
    private static final int HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;

    private ClaimReimbursementPolicy() { }

    static long beforeDeductibleInHalfGold(int enchantmentLevel, int damageAmount) {
        return enchantmentLevel >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
                ? damageAmount : damageAmount * 2L;
    }
}
