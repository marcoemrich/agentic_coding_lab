import java.util.ArrayList;
import java.util.List;

/**
 * A customer's dealings with the MHPCO, worked through in order.
 *
 * <p>Knows that the steps of a scenario are settled sequentially for a single
 * customer, that each is settled against the running record of the steps
 * before it, and that a step's position in that order is what a later step
 * names it by. Defers what settling any one step means to the step itself,
 * what the running record carries to the scenario ledger, and knows nothing
 * about the wire format a scenario arrived in or its results are written back
 * in.
 */
final class Scenario {

    private final Customer customer;
    private final List<Step> steps;

    Scenario(Customer customer, List<Step> steps) {
        this.customer = customer;
        this.steps = List.copyOf(steps);
    }

    /**
     * The result of every step, in the order the MHPCO worked through them.
     */
    List<StepResult> settle() {
        List<StepResult> results = new ArrayList<>();
        ScenarioLedger ledger = new ScenarioLedger();
        for (int index = 0; index < steps.size(); index++) {
            results.add(steps.get(index).settle(customer, index, ledger));
        }
        return results;
    }
}
