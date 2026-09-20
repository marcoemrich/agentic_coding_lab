final class LoyaltyDiscount {
    private static final int MINIMUM_CUSTOMER_YEARS = 2;
    private static final int DISCOUNT_PERCENT = 20;

    private LoyaltyDiscount() { }

    static int inHundredths(int basePremium, int customerYears) {
        return customerYears >= MINIMUM_CUSTOMER_YEARS ? basePremium * DISCOUNT_PERCENT : 0;
    }
}
