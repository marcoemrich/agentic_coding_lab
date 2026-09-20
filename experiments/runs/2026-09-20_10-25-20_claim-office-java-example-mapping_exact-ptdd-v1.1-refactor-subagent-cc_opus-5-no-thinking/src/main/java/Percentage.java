import java.math.BigDecimal;
import java.math.MathContext;

/**
 * A percentage of an amount in G, as the MHPCO measures every premium
 * modifier: a risk surcharge against an item's base premium, a discount or
 * assessment surcharge against the policy premium.
 *
 * This is the one place that says how the MHPCO turns a modifier percentage
 * into an amount, so a change to that arithmetic is made here and nowhere
 * else.
 */
public final class Percentage {

    private static final BigDecimal WHOLE = BigDecimal.valueOf(100);

    /**
     * The MHPCO keeps intermediate amounts as fractions and rounds only the
     * final premium or payout, so a modifier amount is carried at a precision
     * far beyond the whole G it will finally be rounded to. Stating the
     * precision here keeps a modifier whose share does not divide evenly -- a
     * third-share surcharge, say -- an arithmetic detail rather than a failed
     * quote.
     */
    private static final MathContext KEPT_AS_A_FRACTION = MathContext.DECIMAL64;

    private Percentage() {
    }

    public static BigDecimal of(BigDecimal amountInG, int percent) {
        return amountInG.multiply(BigDecimal.valueOf(percent)).divide(WHOLE, KEPT_AS_A_FRACTION);
    }

    public static BigDecimal of(int amountInG, int percent) {
        return of(BigDecimal.valueOf(amountInG), percent);
    }
}
