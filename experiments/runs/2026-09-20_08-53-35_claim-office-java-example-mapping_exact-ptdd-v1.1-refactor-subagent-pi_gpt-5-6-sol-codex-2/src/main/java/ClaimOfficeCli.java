import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class ClaimOfficeCli {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final int PROCESSING_FEE = 5;

    private ClaimOfficeCli() { }

    public static void main(String[] args) {
        int status = run(System.in, System.out, System.err);
        if (status != 0) {
            System.exit(status);
        }
    }

    public static int run(InputStream input, OutputStream output, PrintStream error) {
        try {
            ObjectNode response = process(JSON.readTree(input));
            JSON.writeValue(output, response);
            return 0;
        } catch (Exception exception) {
            error.println(exception.getMessage());
            return 1;
        }
    }

    private static ObjectNode process(JsonNode scenario) {
        int years = scenario.path("customer").path("yearsWithMHPCO").asInt();
        ArrayNode results = JSON.createArrayNode();
        Map<Integer, Policy> policies = new HashMap<>();
        int quoteNumber = 0;
        int stepIndex = 0;
        for (JsonNode step : scenario.path("steps")) {
            String operation = step.path("op").asText();
            if ("quote".equals(operation)) {
                Policy policy = Policy.from(step.path("items"));
                policies.put(stepIndex, policy);
                results.addObject().put("premium", quotePremium(policy, years, quoteNumber));
                quoteNumber++;
            } else if ("claim".equals(operation)) {
                Policy policy = policies.get(step.path("policy").asInt());
                if (policy == null) {
                    throw new IllegalArgumentException("Claim references no earlier quote policy");
                }
                int payout = policy.claim(step.path("incident").path("damages"));
                results.addObject().put("payout", payout).put("remainingCap", policy.remainingCap());
            } else {
                throw new IllegalArgumentException("Unknown operation: " + operation);
            }
            stepIndex++;
        }
        ObjectNode response = JSON.createObjectNode();
        response.set("results", results);
        return response;
    }

    private static int quotePremium(Policy policy, int years, int quoteNumber) {
        int base = policy.basePremium();
        int hundredths = base * 100 + initialAssessmentSurchargeHundredths(base);
        hundredths -= loyaltyDiscountHundredths(base, years);
        hundredths -= followUpContractDiscountHundredths(base, quoteNumber);
        for (InsuredItem item : policy.items()) {
            hundredths += item.riskSurchargeHundredths();
        }
        return roundPremiumInMhpcoFavor(hundredths) + PROCESSING_FEE;
    }

    private static int initialAssessmentSurchargeHundredths(int policyBasePremium) {
        return policyBasePremium * 10;
    }

    private static int loyaltyDiscountHundredths(int policyBasePremium, int yearsWithMhpco) {
        return yearsWithMhpco >= 2 ? policyBasePremium * 20 : 0;
    }

    private static int followUpContractDiscountHundredths(int policyBasePremium, int quoteNumber) {
        return quoteNumber > 0 ? policyBasePremium * 15 : 0;
    }

    private static int roundPremiumInMhpcoFavor(int hundredths) {
        return (hundredths + 99) / 100;
    }

    private record InsuredItem(String type, String material, int enchantment, boolean cursed) {
        private static final int CURSE_SURCHARGE_PERCENTAGE = 50;
        private static final int HIGH_ENCHANTMENT_THRESHOLD = 5;
        private static final int HIGH_ENCHANTMENT_SURCHARGE_PERCENTAGE = 30;

        static InsuredItem from(JsonNode node) {
            String type = node.path("type").asText();
            MhpcoPriceList.requireKnownItemType(type);
            return new InsuredItem(type, node.path("material").asText(),
                    node.has("enchantment") ? node.path("enchantment").asInt() : -1,
                    node.path("cursed").asBoolean(false));
        }

        int riskSurchargeHundredths() {
            int percentage = cursed ? CURSE_SURCHARGE_PERCENTAGE : 0;
            if (enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
                percentage += HIGH_ENCHANTMENT_SURCHARGE_PERCENTAGE;
            }
            return MhpcoPriceList.basePremium(type) * percentage;
        }

    }

    private record Damage(String itemType, int amount) {
        Damage {
            if (amount < 0) {
                throw new IllegalArgumentException("Damage amount must not be negative");
            }
        }

        static Damage from(JsonNode node) {
            return new Damage(node.path("itemType").asText(), node.path("amount").asInt());
        }
    }

    private static final class DamageItemAssignments {
        private final Map<String, ArrayDeque<InsuredItem>> unassignedItemsByType = new HashMap<>();

        DamageItemAssignments(List<InsuredItem> insuredItems) {
            for (InsuredItem item : insuredItems) {
                unassignedItemsByType.computeIfAbsent(item.type(), ignored -> new ArrayDeque<>()).add(item);
            }
        }

        InsuredItem assignCoveredItem(String damagedItemType) {
            ArrayDeque<InsuredItem> matchingItems = unassignedItemsByType.get(damagedItemType);
            if (matchingItems == null || matchingItems.isEmpty()) {
                throw new IllegalArgumentException(
                        "Damaged item is not covered by policy: " + damagedItemType);
            }
            return matchingItems.removeFirst();
        }
    }

    private static final class Policy {
        private static final long DAMAGE_EVENT_DEDUCTIBLE_IN_HALF_GOLD = 200;

        private final List<InsuredItem> items;
        private final PolicyPayoutCap payoutCap;

        private Policy(List<InsuredItem> items) {
            this.items = List.copyOf(items);
            this.payoutCap = new PolicyPayoutCap(itemTypes());
        }

        static Policy from(JsonNode itemNodes) {
            List<InsuredItem> items = new ArrayList<>();
            itemNodes.forEach(node -> items.add(InsuredItem.from(node)));
            return new Policy(items);
        }

        List<InsuredItem> items() { return items; }

        int remainingCap() { return payoutCap.remaining(); }

        int basePremium() {
            return MhpcoPriceList.basePremium(itemTypes());
        }

        private List<String> itemTypes() {
            return items.stream().map(InsuredItem::type).toList();
        }

        int claim(JsonNode damages) {
            DamageItemAssignments assignments = new DamageItemAssignments(items);
            long payoutHalfUnits = 0;
            for (JsonNode damageNode : damages) {
                Damage damage = Damage.from(damageNode);
                InsuredItem item = assignments.assignCoveredItem(damage.itemType());
                long reimbursement = ClaimReimbursementPolicy.beforeDeductibleInHalfGold(
                        item.enchantment(), damage.amount());
                payoutHalfUnits += reimbursementAfterDeductibleInHalfGold(reimbursement);
            }
            int desiredPayout = roundPayoutInMhpcoFavor(payoutHalfUnits);
            return payoutCap.payUpTo(desiredPayout);
        }

        private static int roundPayoutInMhpcoFavor(long payoutInHalfGold) {
            return (int) (payoutInHalfGold / 2);
        }

        private static long reimbursementAfterDeductibleInHalfGold(long reimbursementInHalfGold) {
            return Math.max(0, reimbursementInHalfGold - DAMAGE_EVENT_DEDUCTIBLE_IN_HALF_GOLD);
        }
    }
}
