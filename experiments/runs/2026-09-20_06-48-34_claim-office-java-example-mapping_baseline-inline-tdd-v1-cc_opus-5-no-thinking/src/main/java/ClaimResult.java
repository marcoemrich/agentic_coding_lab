/** The outcome of a single claim against a policy. */
public record ClaimResult(int payout, int remainingCap) {
}
