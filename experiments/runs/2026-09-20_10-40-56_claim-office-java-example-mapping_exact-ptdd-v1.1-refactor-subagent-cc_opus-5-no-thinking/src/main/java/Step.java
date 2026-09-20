/**
 * One step of a scenario: what the customer asks the MHPCO to do.
 *
 * <p>Each kind of step knows what the MHPCO does when it is worked through,
 * and what that leaves behind in the ledger for the steps after it. Knows
 * nothing about the order the steps come in, which is the scenario's affair.
 */
sealed interface Step permits QuoteStep, ClaimStep {

    /**
     * Works this step through for the customer, against the running record of
     * the steps before it, and records in that ledger whatever this step
     * leaves behind.
     *
     * @param index the zero-based position of this step in the scenario, by
     *     which a later claim names the policy a quote wrote
     */
    StepResult settle(Customer customer, int index, ScenarioLedger ledger);
}
