import java.util.HashMap;
import java.util.Map;

/**
 * The policies the office has written so far in one scenario, filed under the step
 * that wrote them. A claim step names its policy by the zero-based index of the quote
 * step that created it, so the clerk must be able to answer "which policy did step n
 * write?" -- and to refuse a step that wrote none.
 *
 * <p>This numbering is the scenario document's convention, not the office's: the office
 * knows policies, the clerk knows which step each came from. Keeping the filing here
 * lets the clerk advance the step count without a placeholder standing in for a policy
 * that was never written.
 */
final class PoliciesByStep {

    private final Map<Integer, Policy> byStep = new HashMap<>();
    private int stepsSeen;

    /** Files the policy a quote step just wrote under that step's own index. */
    void recordPolicyWritten(Policy policy) {
        byStep.put(stepsSeen++, policy);
    }

    /** Notes a step that wrote no policy, so later steps keep their own indices. */
    void recordStepWithoutPolicy() {
        stepsSeen++;
    }

    /** The policy written by the named step, or a refusal if that step wrote none. */
    Policy writtenByStep(int step) {
        Policy policy = byStep.get(step);
        if (policy == null) {
            throw new IllegalArgumentException("step " + step + " wrote no policy");
        }
        return policy;
    }
}
