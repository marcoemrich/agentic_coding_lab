/**
 * A claim made against the policy created by an earlier quote step.
 */
public record ClaimStep(int policy, Incident incident) implements Step {
}
