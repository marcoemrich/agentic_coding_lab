final class FollowUpContractDiscount {
    private static final int DISCOUNT_PERCENT = 15;

    private FollowUpContractDiscount() { }

    static int inHundredths(int basePremium, boolean followUpContract) {
        return followUpContract ? basePremium * DISCOUNT_PERCENT : 0;
    }
}
