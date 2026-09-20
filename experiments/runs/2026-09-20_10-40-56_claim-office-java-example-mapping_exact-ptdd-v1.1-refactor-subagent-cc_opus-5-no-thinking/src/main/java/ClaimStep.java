/**
 * A damage report made against a policy an earlier quote created.
 *
 * <p>Working a claim through means settling its incident against the policy it
 * names, and reporting both what was paid out and what is left of that
 * policy's cap afterwards. A claim leaves nothing new in the ledger: it draws
 * down the policy already filed there.
 */
record ClaimStep(int policy, Incident incident) implements Step {

    @Override
    public StepResult settle(Customer customer, int index, ScenarioLedger ledger) {
        Policy written = ledger.policyWrittenBy(policy);
        return ClaimResult.of(written.settle(incident), written.remainingCap());
    }
}
