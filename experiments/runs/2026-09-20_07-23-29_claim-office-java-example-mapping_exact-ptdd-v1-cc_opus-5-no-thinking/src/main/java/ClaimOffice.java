import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class ClaimOffice {

    private static final int PROCESSING_FEE = 5;
    private static final int BLOCK_SIZE = 3;
    private static final int BLOCK_BASE_PREMIUM = 60;
    private static final int DEDUCTIBLE = 100;

    private final CustomerHistory customer;
    private final List<Policy> policies = new ArrayList<>();

    public ClaimOffice(int yearsWithMhpco) {
        this.customer = new CustomerHistory(yearsWithMhpco);
    }

    public int quote(List<Item> items) {
        policies.add(new Policy(items));
        double base = policyBasePremium(items);
        double itemSurcharges = 0;
        for (Item item : items) {
            itemSurcharges += RiskSurcharge.forItem(item);
        }
        return (int) Math.ceil(base + itemSurcharges
                + base * customer.modifierRateForNextContract() + PROCESSING_FEE);
    }

    public ClaimResult claim(int policyIndex, Incident incident) {
        Policy policy = policies.get(policyIndex);
        incident.validate();
        List<Item> damagedItems = policy.damagedItems(incident.damages());
        int desired = 0;
        for (int i = 0; i < incident.damages().size(); i++) {
            desired += reimbursement(damagedItems.get(i), incident.damages().get(i));
        }
        return new ClaimResult(policy.payOutAtMost(desired), policy.remainingCap());
    }

    private int reimbursement(Item item, Damage damage) {
        double reimbursed = damage.amount() * Reimbursement.shareFor(item);
        return (int) Math.max(0, Math.floor(reimbursed - DEDUCTIBLE));
    }

    private double policyBasePremium(List<Item> items) {
        Map<String, Integer> countsByType = new LinkedHashMap<>();
        for (Item item : items) {
            PriceList.basePremium(item.type());
            countsByType.merge(item.type(), 1, Integer::sum);
        }
        double base = 0;
        for (Map.Entry<String, Integer> entry : countsByType.entrySet()) {
            base += basePremiumFor(entry.getKey(), entry.getValue());
        }
        return base;
    }

    private double basePremiumFor(String itemType, int count) {
        if (count == BLOCK_SIZE) {
            return BLOCK_BASE_PREMIUM;
        }
        return count * PriceList.basePremium(itemType);
    }
}
