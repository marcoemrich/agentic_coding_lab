import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * The MHPCO's settlement rule: a calculation is kept as fractions throughout
 * and only its final amount is settled to whole G, always in the MHPCO's own
 * favour.
 *
 * <p>Favour has a direction, and the direction depends on which way the money
 * moves. On a premium, money the MHPCO receives, favour rounds up. On a
 * payout, money the MHPCO pays out, favour rounds down. The two are stated
 * together here so the asymmetry is visible rather than rediscovered.
 *
 * <p>Changes whenever the MHPCO revises how it settles fractions; knows
 * nothing about how any amount was arrived at.
 */
final class WholeG {

    private WholeG() {
    }

    /**
     * Settles a premium — money the MHPCO receives — so a fraction of a G
     * falls to the MHPCO.
     */
    static int premium(BigDecimal amount) {
        return amount.setScale(0, RoundingMode.CEILING).intValueExact();
    }

    /**
     * Settles a payout — money the MHPCO pays out — so a fraction of a G stays
     * with the MHPCO.
     */
    static int payout(BigDecimal amount) {
        return amount.setScale(0, RoundingMode.FLOOR).intValueExact();
    }
}
