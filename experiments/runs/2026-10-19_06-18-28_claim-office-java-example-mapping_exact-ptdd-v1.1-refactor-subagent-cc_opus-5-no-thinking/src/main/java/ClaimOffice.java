import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * The office doing business with one customer over the course of a scenario: it
 * quotes premiums, writes the policies those quotes insure, and settles claims
 * against the policies it has written.
 *
 * What the office carries from one operation to the next is its own
 * bookkeeping, not the protocol's: how many contracts this customer already
 * holds (so the next quote knows it is a follow-up) and which policy each quote
 * wrote (so a later claim can be settled against it). A protocol revision
 * renaming a field changes none of it; deciding that some quote does not count
 * toward the customer's contracts would change it without touching a field
 * name.
 */
public class ClaimOffice {

    private final PriceList priceList = new PriceList();
    private final PremiumPolicy premiumPolicy = new PremiumPolicy(priceList);
    private final ClaimPolicy claimPolicy = new ClaimPolicy();

    private final int yearsWithMHPCO;
    private final Map<Integer, Policy> policiesByQuote = new HashMap<>();
    private int contractsAlreadyHeld;

    public ClaimOffice(int yearsWithMHPCO) {
        this.yearsWithMHPCO = yearsWithMHPCO;
    }

    /**
     * The office quotes a premium for the items brought and writes the policy
     * insuring them, filed under the quote it answers. Every quote the office
     * answers is another contract this customer holds, so the next one is a
     * follow-up.
     */
    public int quote(int quoteReference, List<InsuredItem> insuredItems) {
        Customer customer = new Customer(yearsWithMHPCO, contractsAlreadyHeld);
        policiesByQuote.put(quoteReference,
                Policy.covering(insuredItems, priceList, claimPolicy));
        contractsAlreadyHeld++;
        return premiumPolicy.quote(customer, insuredItems);
    }

    /**
     * The office settles a reported incident against the policy a previous
     * quote wrote, on that policy's own terms.
     */
    public Settlement settleClaim(int quoteReference, List<Damage> damages) {
        Policy policy = policiesByQuote.get(quoteReference);
        BigDecimal paid = policy.settle(damages);
        return new Settlement(paid, policy.remainingCap());
    }

    /** What one settled claim paid, and what the policy's cap has left afterwards. */
    public record Settlement(BigDecimal payout, BigDecimal remainingCap) {
    }
}
