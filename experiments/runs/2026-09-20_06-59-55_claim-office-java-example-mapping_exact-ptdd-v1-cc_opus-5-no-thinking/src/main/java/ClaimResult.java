/** The outcome of one claim against a policy. */
public record ClaimResult(int payout, int remainingCap) {
}
