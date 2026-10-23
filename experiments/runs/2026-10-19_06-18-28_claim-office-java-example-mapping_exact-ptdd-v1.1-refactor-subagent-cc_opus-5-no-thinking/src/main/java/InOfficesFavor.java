import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * The MHPCO rounds every amount to whole G in its own favor. One rule, read in
 * the direction the money moves: a fraction of a G the customer owes the office
 * is rounded up, a fraction the office owes the customer is rounded down. The
 * office never loses the fraction.
 *
 * Intermediate amounts during a calculation stay exact fractions; only a final
 * charge or payment is rounded.
 */
final class InOfficesFavor {

    private static final int WHOLE_G = 0;

    private InOfficesFavor() {
    }

    /** What the customer owes the office, rounded up: the fraction favors the office. */
    static BigDecimal charge(BigDecimal amount) {
        return amount.setScale(WHOLE_G, RoundingMode.CEILING);
    }

    /** What the office owes the customer, rounded down: the fraction favors the office. */
    static BigDecimal payment(BigDecimal amount) {
        return amount.setScale(WHOLE_G, RoundingMode.FLOOR);
    }
}
