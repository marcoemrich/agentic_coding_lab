/**
 * What the MHPCO settled on a claim: what it pays out, and how much of the
 * policy's cap is left afterwards.
 */
public record Claim(int payout, int remainingCap) {
}
