import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public final class ClaimOffice {

    private static final String ITEM_TYPE_FIELD = "type";
    private static final int PROCESSING_FEE = 5;

    private final CustomerPricingPolicy customerPolicy;
    private final List<Policy> policies = new ArrayList<>();

    public ClaimOffice(int yearsWithMhpco) {
        this.customerPolicy = new CustomerPricingPolicy(yearsWithMhpco);
    }

    public int quote(List<Map<String, Object>> items) {
        for (Map<String, Object> item : items) {
            requireListedType(typeOf(item));
        }
        double base = policyBasePremium(items);
        double premium = base + itemSurcharges(items)
                + base * customerPolicy.netRate()
                + PROCESSING_FEE;
        customerPolicy.recordContract();
        policies.add(new Policy(items, insuranceSum(items)));
        return (int) Math.ceil(premium);
    }

    public ClaimResult claim(int policyIndex, List<Map<String, Object>> damages) {
        Policy policy = policies.get(policyIndex);
        IncidentCoverage coverage = policy.coverageForIncident();
        double desiredPayout = 0;
        for (Map<String, Object> damage : damages) {
            desiredPayout += reimbursementFor(damage, coverage);
        }
        int payout = policy.drawFromCap(desiredPayout);
        return new ClaimResult(payout, policy.remainingCap());
    }

    private double reimbursementFor(Map<String, Object> damage, IncidentCoverage coverage) {
        return ReimbursementClauses.reimbursementFor((Integer) damage.get("amount"),
                coverage.claimItemOfType((String) damage.get("itemType")));
    }


    private void requireListedType(String type) {
        if (!PriceList.lists(type)) {
            throw new IllegalArgumentException("The MHPCO price list does not cover items of type " + type);
        }
    }

    private int insuranceSum(List<Map<String, Object>> items) {
        int sum = 0;
        for (Map<String, Object> item : items) {
            sum += PriceList.insuranceValueOf(typeOf(item));
        }
        return sum;
    }

    private double itemSurcharges(List<Map<String, Object>> items) {
        double surcharges = 0;
        for (Map<String, Object> item : items) {
            surcharges += ItemRiskSurcharges.forItem(item, this::basePremiumOf);
        }
        return surcharges;
    }

    private double policyBasePremium(List<Map<String, Object>> items) {
        double base = 0;
        List<Map<String, Object>> components = new ArrayList<>();
        for (Map<String, Object> item : items) {
            if (ComponentBlocks.isComponent(typeOf(item))) {
                components.add(item);
            } else {
                base += basePremiumOf(item);
            }
        }
        for (List<Map<String, Object>> alike : ComponentBlocks.groupAlike(components).values()) {
            base += componentGroupBasePremium(alike);
        }
        return base;
    }

    private double componentGroupBasePremium(List<Map<String, Object>> alike) {
        if (ComponentBlocks.formsBlock(alike)) {
            return ComponentBlocks.blockPremium();
        }
        double base = 0;
        for (Map<String, Object> component : alike) {
            base += basePremiumOf(component);
        }
        return base;
    }

    private double basePremiumOf(Map<String, Object> item) {
        return PriceList.basePremiumOf(typeOf(item));
    }

    private static String typeOf(Map<String, Object> item) {
        return (String) item.get(ITEM_TYPE_FIELD);
    }
}
