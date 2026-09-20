/** The single customer a scenario is about. */
public record Customer(int yearsWithMHPCO) {

    private static final int LOYALTY_YEARS = 2;

    public boolean isLongStanding() {
        return yearsWithMHPCO >= LOYALTY_YEARS;
    }
}
