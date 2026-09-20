/**
 * What the office pays out for a claim, and what remains of the policy's cap.
 */
public record ClaimResult(int payout, int remainingCap) implements StepResult {
}
