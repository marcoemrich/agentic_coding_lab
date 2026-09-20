final class PremiumCalculator {
    private static final int HUNDREDTHS_PER_G = 100;
    private static final int PROCESSING_FEE = 5;

    private PremiumCalculator() { }

    static int quote(Iterable<InsuredItem> items, int customerYears, boolean followUpContract) {
        int basePremium = PriceList.totalBasePremium(items);
        int premiumInHundredths = basePremium * HUNDREDTHS_PER_G
                + CursedSurcharge.totalInHundredths(items)
                + EnchantmentSurcharge.totalInHundredths(items)
                + InitialAssessment.inHundredths(basePremium)
                - LoyaltyDiscount.inHundredths(basePremium, customerYears)
                - FollowUpContractDiscount.inHundredths(basePremium, followUpContract)
                + PROCESSING_FEE * HUNDREDTHS_PER_G;
        return PremiumRounding.upToWholeG(premiumInHundredths);
    }
}
