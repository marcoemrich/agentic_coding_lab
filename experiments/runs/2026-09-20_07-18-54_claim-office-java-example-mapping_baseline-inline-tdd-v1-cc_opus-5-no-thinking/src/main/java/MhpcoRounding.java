import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Rounding to whole G, always in the MHPCO's favour: premiums it collects are rounded up,
 * payouts it owes are rounded down.
 */
public final class MhpcoRounding {

    private MhpcoRounding() {
    }

    public static int premium(BigDecimal amount) {
        return amount.setScale(0, RoundingMode.CEILING).intValueExact();
    }

    public static int payout(BigDecimal amount) {
        return amount.setScale(0, RoundingMode.FLOOR).intValueExact();
    }
}
