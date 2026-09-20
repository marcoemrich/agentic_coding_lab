import java.math.BigDecimal;

/**
 * What a claim step paid out, and what is left of the policy's cap.
 *
 * <p>Both amounts are money the MHPCO owes, so both are settled to whole G in
 * the MHPCO's favour when the result is recorded. This is the one place that
 * knows a claim is reported in whole G.
 */
record ClaimResult(int payout, int remainingCap) implements StepResult {

    /**
     * Records a settled claim, taking the fractions the calculation kept down
     * to the whole G the MHPCO reports.
     */
    static ClaimResult of(BigDecimal payout, BigDecimal remainingCap) {
        return new ClaimResult(WholeG.payout(payout), WholeG.payout(remainingCap));
    }
}
