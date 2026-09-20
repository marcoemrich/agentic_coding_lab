/** A customer of the MHPCO, and the file the office keeps on their standing with it. */
public record Customer(int yearsWithMHPCO) {

    /** From this many years of business on, the MHPCO calls a customer long-standing. */
    private static final int LONG_STANDING_YEARS = 2;

    /** Two years of business with the MHPCO make a customer long-standing. */
    public boolean isLongStanding() {
        return yearsWithMHPCO() >= LONG_STANDING_YEARS;
    }
}
