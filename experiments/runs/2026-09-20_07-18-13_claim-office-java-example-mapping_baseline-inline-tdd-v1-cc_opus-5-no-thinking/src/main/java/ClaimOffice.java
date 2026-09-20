import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/** Processes the quote and claim steps of one scenario for one customer. */
public class ClaimOffice {

    private static final BigDecimal PROCESSING_FEE = BigDecimal.valueOf(5);
    private static final BigDecimal FIRST_INSURANCE_SURCHARGE = new BigDecimal("0.10");
    private static final BigDecimal LOYALTY_DISCOUNT = new BigDecimal("0.20");
    private static final BigDecimal FOLLOW_UP_DISCOUNT = new BigDecimal("0.15");
    private static final int LOYALTY_YEARS = 2;

    private final Customer customer;
    private final List<Policy> policies = new ArrayList<>();
    private int contractsIssued;

    public ClaimOffice(Customer customer) {
        this.customer = customer;
    }

    public Policy quote(List<Item> items) {
        BigDecimal base = Quote.basePremium(items);
        BigDecimal premium = base
                .add(Quote.riskSurcharges(items))
                .add(policyWideModifiers(base))
                .add(PROCESSING_FEE);
        contractsIssued++;
        Policy policy = new Policy(Money.asPremium(premium), items);
        policies.add(policy);
        return policy;
    }

    public Claim claim(int policyIndex, List<Damage> damages) {
        Policy policy = policyAt(policyIndex);
        BigDecimal payout = Incident.desiredPayout(policy, damages).min(policy.remainingCap());
        policy.reduceCapBy(payout);
        return new Claim(Money.asPayout(payout), Money.asPayout(policy.remainingCap()));
    }

    private Policy policyAt(int policyIndex) {
        if (policyIndex < 0 || policyIndex >= policies.size()) {
            throw new ScenarioException("no policy at step " + policyIndex);
        }
        return policies.get(policyIndex);
    }

    /** Loyalty, first insurance and follow-up contract all apply to the policy base premium. */
    private BigDecimal policyWideModifiers(BigDecimal base) {
        BigDecimal rate = FIRST_INSURANCE_SURCHARGE;
        if (customer.yearsWithMHPCO() >= LOYALTY_YEARS) {
            rate = rate.subtract(LOYALTY_DISCOUNT);
        }
        if (contractsIssued > 0) {
            rate = rate.subtract(FOLLOW_UP_DISCOUNT);
        }
        return base.multiply(rate);
    }
}
