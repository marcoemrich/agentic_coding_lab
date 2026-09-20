import java.util.ArrayList;
import java.util.List;

/**
 * Works through a scenario's steps in the order the office received them.
 *
 * Each step is handled against the policies already on file: a quote is priced against the
 * history that stands before it and adds the policy it issues to that file, while a claim is
 * settled against a policy the file already holds and so leaves the history untouched.
 */
public class ClaimOffice {

    private final PremiumCalculator premiumCalculator = new PremiumCalculator();
    private final PayoutCalculator payoutCalculator = new PayoutCalculator();

    public List<StepResult> run(Scenario scenario) {
        List<StepResult> results = new ArrayList<>();
        PoliciesOnFile policiesOnFile = new PoliciesOnFile();
        for (Step step : scenario.steps()) {
            if (step instanceof QuoteStep quoteStep) {
                results.add(quote(quoteStep, scenario.customer(), policiesOnFile, results.size()));
            } else {
                results.add(settle((ClaimStep) step, policiesOnFile));
            }
        }
        return results;
    }

    /**
     * Quoting: the premium the office asks for the items, assessed against the contracts that
     * stand before this one, and the policy that premium is quoted for goes on file under the
     * step that quoted it.
     */
    private QuoteResult quote(QuoteStep quoteStep, Customer customer, PoliciesOnFile policiesOnFile,
            int stepIndex) {
        QuoteAssessment assessment =
                new QuoteAssessment(customer, policiesOnFile.contractsOnFile());
        int premium = premiumCalculator.premiumFor(quoteStep, assessment);
        policiesOnFile.issuedBy(stepIndex, new Policy(quoteStep.items()));
        return new QuoteResult(premium);
    }

    /**
     * Settling a claim against the policy it names: what the office pays for the damages
     * reported, and what that settlement leaves of the cap the policy was underwritten with.
     */
    private ClaimResult settle(ClaimStep claimStep, PoliciesOnFile policiesOnFile) {
        Policy policy = policiesOnFile.namedBy(claimStep);
        int desiredPayout = payoutCalculator.payoutFor(claimStep.incident(), policy.unclaimedCover());
        int payout = policy.settle(desiredPayout);
        return new ClaimResult(payout, policy.remainingCap());
    }
}
