/**
 * The customer a scenario is about, as the office knows them: their standing
 * with the MHPCO at the moment a premium is quoted.
 *
 * Both facts here are the office's view of its relationship with this customer
 * rather than of the items insured, so this is also where the office decides
 * what that relationship entitles the customer to: whether they count as
 * long-standing, and whether this contract is a follow-up. The rates those
 * entitlements earn are the premium rules' business, in {@link PremiumPolicy}.
 */
public record Customer(int yearsWithMHPCO, int contractsAlreadyHeld) {

    private static final int LOYALTY_YEARS = 2;

    /**
     * The office counts a customer as long-standing from 2 years of business
     * with the MHPCO up; a newer customer earns no loyalty.
     */
    public boolean isLongStanding() {
        return yearsWithMHPCO >= LOYALTY_YEARS;
    }

    /**
     * Every contract after the customer's first is a follow-up, however long
     * they have been with the office.
     */
    public boolean holdsFollowUpContract() {
        return contractsAlreadyHeld > 0;
    }
}
