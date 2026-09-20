final class InitialAssessment {
    private static final int SURCHARGE_PERCENT = 10;

    private InitialAssessment() { }

    static int inHundredths(int basePremium) {
        return basePremium * SURCHARGE_PERCENT;
    }
}
