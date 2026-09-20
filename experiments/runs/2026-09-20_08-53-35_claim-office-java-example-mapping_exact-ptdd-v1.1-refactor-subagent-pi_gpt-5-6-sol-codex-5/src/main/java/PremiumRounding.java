final class PremiumRounding {
    private static final int HUNDREDTHS_PER_G = 100;

    private PremiumRounding() { }

    static int upToWholeG(int amountInHundredths) {
        return (amountInHundredths + HUNDREDTHS_PER_G - 1) / HUNDREDTHS_PER_G;
    }
}
