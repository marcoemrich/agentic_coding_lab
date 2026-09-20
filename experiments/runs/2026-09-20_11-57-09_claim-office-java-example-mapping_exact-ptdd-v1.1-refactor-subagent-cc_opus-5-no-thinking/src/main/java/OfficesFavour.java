/**
 * Rounding "in the MHPCO's favour": whichever way the fraction falls, the office keeps it.
 *
 * The favour is one rule with two directions, because the direction depends on which way the
 * money flows. Money the office receives is rounded up; money the office pays out is rounded
 * down. Stating both here keeps them from drifting apart.
 */
public final class OfficesFavour {

    private OfficesFavour() {
    }

    /** An amount the customer pays the office, rounded up to whole G. */
    public static int onAmountReceived(double amount) {
        return (int) Math.ceil(amount);
    }

    /** An amount the office pays the customer, rounded down to whole G. */
    public static int onAmountPaidOut(double amount) {
        return (int) Math.floor(amount);
    }
}
