import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * All amounts are rounded to whole G in the MHPCO's favour.
 *
 * This is the one place that decides what the office's favour means: not a
 * direction, but the side of the ledger an amount falls on. An amount the
 * customer owes the office is resolved upwards; an amount the office owes a
 * claimant is resolved downwards. The office therefore never loses a fraction
 * of a G, whichever way the money is travelling.
 *
 * Stating the rule this way keeps the two current applications -- a quoted
 * premium and a settled payout -- readings of one MHPCO rule rather than two
 * unrelated choices of rounding mode. A third kind of amount states which
 * side of the ledger it is on and inherits the rule; a change to what
 * "in the office's favour" means -- to the nearest whole G with ties kept,
 * say -- is made here and nowhere else.
 */
public final class MhpcoFavour {

    private static final int WHOLE_G = 0;

    private MhpcoFavour() {
    }

    /**
     * An amount the customer owes the MHPCO, rounded in the office's favour:
     * the office collects the fraction.
     */
    public static int roundedOwedToTheOffice(BigDecimal amountInG) {
        return roundedInTheMhpcoFavour(amountInG, RoundingMode.CEILING);
    }

    /**
     * An amount the MHPCO owes a claimant, rounded in the office's favour:
     * the office keeps the fraction.
     */
    public static int roundedOwedByTheOffice(BigDecimal amountInG) {
        return roundedInTheMhpcoFavour(amountInG, RoundingMode.FLOOR);
    }

    private static int roundedInTheMhpcoFavour(BigDecimal amountInG, RoundingMode towardsTheOffice) {
        return amountInG.setScale(WHOLE_G, towardsTheOffice).intValueExact();
    }
}
