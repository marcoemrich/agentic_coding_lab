import java.math.BigDecimal;
import java.math.RoundingMode;

/** Rounds the final amounts of a calculation to whole G in the MHPCO's favor. */
public final class Money {

    private Money() {
    }

    public static int asPremium(BigDecimal amount) {
        return amount.setScale(0, RoundingMode.CEILING).intValueExact();
    }

    public static int asPayout(BigDecimal amount) {
        return amount.setScale(0, RoundingMode.FLOOR).intValueExact();
    }
}
