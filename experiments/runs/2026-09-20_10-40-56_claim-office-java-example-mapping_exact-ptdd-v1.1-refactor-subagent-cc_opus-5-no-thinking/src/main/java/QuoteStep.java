import java.util.List;

/**
 * A request to quote a premium for a list of items.
 *
 * <p>Working a quote through means tariffing its items for the customer as
 * they stand after the contracts already concluded, and writing the policy the
 * quote creates into the ledger under this step's index, where a later claim
 * will look for it.
 */
record QuoteStep(List<Item> items) implements Step {

    QuoteStep {
        items = List.copyOf(items);
    }

    @Override
    public StepResult settle(Customer customer, int index, ScenarioLedger ledger) {
        int premium = PremiumCalculator.premiumFor(customer, ledger.concludedContracts(), items);
        ledger.recordPolicy(index, new Policy(items));
        return new QuoteResult(premium);
    }
}
