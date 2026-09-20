import java.util.HashMap;
import java.util.Map;

/**
 * The policies the office has issued so far in a scenario, held as the office holds them:
 * on file, in the order they were taken out.
 *
 * The register answers the two questions the office asks between steps. How many contracts
 * stand before the next quote, because a quote is priced against the history that precedes
 * it -- and that is simply how many policies are on file, not a tally kept beside them. And
 * which policy a claim is made against, because a claim names the quote step that created
 * its cover rather than the policy itself; filing a policy under that step index is the
 * office's way of making a claim's reference answerable.
 */
public class PoliciesOnFile {

    private final Map<Integer, Policy> byIssuingStep = new HashMap<>();

    /**
     * Files the policy a quote has just issued under the step that quoted it.
     */
    public void issuedBy(int quotingStep, Policy policy) {
        byIssuingStep.put(quotingStep, policy);
    }

    /**
     * How many contracts the customer already holds -- one per policy on file.
     */
    public int contractsOnFile() {
        return byIssuingStep.size();
    }

    /**
     * The policy a claim is made against, looked up by the quote step the claim names.
     */
    public Policy namedBy(ClaimStep claimStep) {
        return byIssuingStep.get(claimStep.policy());
    }
}
