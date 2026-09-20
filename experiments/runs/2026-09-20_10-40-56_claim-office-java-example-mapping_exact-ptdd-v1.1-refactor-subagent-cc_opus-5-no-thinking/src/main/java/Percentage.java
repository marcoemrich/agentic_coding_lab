import java.math.BigDecimal;

/**
 * A rate the MHPCO levies or grants, as a percentage of some amount.
 *
 * <p>Every MHPCO modifier — the item risk surcharges as well as the
 * policy-wide loyalty, first insurance and follow-up contract modifiers — is
 * expressed as a percentage of an amount. This is the one place that knows
 * what taking a percentage of an amount means, so the modifiers are left to
 * differ only in their rate and in which amount they are measured against.
 *
 * <p>The result is kept as a fraction: the MHPCO settles to whole G only once,
 * at the end of a calculation.
 */
record Percentage(int percent) {

    private static final BigDecimal HUNDRED_PERCENT = BigDecimal.valueOf(100);

    static Percentage of(int percent) {
        return new Percentage(percent);
    }

    /**
     * The part of {@code amount} this rate comes to, exactly.
     *
     * <p>Exact division is deliberate: MHPCO rates divide their amounts evenly,
     * and a rate that did not would be a tariff the MHPCO has not decided how
     * to settle rather than something to silently round away.
     */
    BigDecimal ofAmount(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(percent)).divide(HUNDRED_PERCENT);
    }
}
