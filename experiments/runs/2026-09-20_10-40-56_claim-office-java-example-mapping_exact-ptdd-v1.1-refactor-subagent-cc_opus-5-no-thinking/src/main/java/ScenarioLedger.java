import java.util.HashMap;
import java.util.Map;

/**
 * The running record the MHPCO carries from one step of a scenario to the
 * next.
 *
 * <p>Holds two readings of how the steps of a scenario bear on one another.
 * Every contract concluded before a step makes that step a follow-up
 * contract, so the ledger counts them as it goes. And a claim names the
 * policy it is made against by the zero-based index of the quote step that
 * wrote it, so the ledger files each policy under that index.
 *
 * <p>Changes whenever the MHPCO revises what one step of a scenario means for
 * the next; knows nothing about tariffs, payouts or the wire format.
 */
final class ScenarioLedger {

    private final Map<Integer, Policy> policiesByQuoteStep = new HashMap<>();
    private int concludedContracts;

    /**
     * Files the policy a quote step wrote under that step's index, and counts
     * the contract as concluded.
     */
    void recordPolicy(int quoteStepIndex, Policy policy) {
        policiesByQuoteStep.put(quoteStepIndex, policy);
        concludedContracts++;
    }

    /**
     * The policy a claim names by the index of the quote step that wrote it.
     */
    Policy policyWrittenBy(int quoteStepIndex) {
        return policiesByQuoteStep.get(quoteStepIndex);
    }

    /**
     * How many contracts the customer had already concluded in this scenario.
     */
    int concludedContracts() {
        return concludedContracts;
    }
}
