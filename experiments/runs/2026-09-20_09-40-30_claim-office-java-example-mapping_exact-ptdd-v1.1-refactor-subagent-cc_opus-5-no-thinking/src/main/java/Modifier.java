import java.math.BigDecimal;

/**
 * How the MHPCO states a premium modifier: a rate in whole percent, the way the
 * price list writes it. Applying it is a multiplication by the amount the modifier
 * attaches to -- an item's base premium, or the policy base premium.
 */
final class Modifier {

    private Modifier() {
    }

    static BigDecimal rate(int percent) {
        return BigDecimal.valueOf(percent, 2);
    }
}
