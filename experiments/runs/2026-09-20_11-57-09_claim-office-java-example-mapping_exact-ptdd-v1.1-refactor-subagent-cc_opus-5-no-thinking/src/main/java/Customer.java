/**
 * The single customer a scenario is priced for, and what the office knows of their history.
 *
 * The office's traditions turn on how long a customer has been with it: from two years up
 * it calls them long-standing, and it is long-standing customers who earn the loyalty
 * discount. How many years that takes is the office's definition of standing; what the
 * discount is then worth is a matter of pricing.
 */
public record Customer(int yearsWithMHPCO) {

    private static final int LONG_STANDING_YEARS = 2;

    public boolean isLongStanding() {
        return yearsWithMHPCO >= LONG_STANDING_YEARS;
    }
}
