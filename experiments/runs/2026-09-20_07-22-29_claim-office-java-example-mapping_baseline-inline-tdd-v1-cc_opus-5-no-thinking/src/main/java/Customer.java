/** The single customer a scenario is about. */
record Customer(int yearsWithMHPCO) {

    private static final int LOYALTY_YEARS = 2;

    boolean isLongStanding() {
        return yearsWithMHPCO >= LOYALTY_YEARS;
    }
}
