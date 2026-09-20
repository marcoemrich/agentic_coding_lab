final class DamageReimbursement {
    private static final int HIGH_ENCHANTMENT_LEVEL = 8;

    private DamageReimbursement() { }

    static int reimbursableAmountInHalfG(InsuredItem item, int damageAmount) {
        return highEnchantmentClauseApplies(item) ? damageAmount : damageAmount * 2;
    }

    private static boolean highEnchantmentClauseApplies(InsuredItem item) {
        return item.enchantment() >= HIGH_ENCHANTMENT_LEVEL;
    }
}
