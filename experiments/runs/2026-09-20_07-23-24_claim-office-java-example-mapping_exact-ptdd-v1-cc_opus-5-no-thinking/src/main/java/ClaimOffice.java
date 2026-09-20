import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

final class ClaimOffice {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final Map<String, Double> INSURANCE_VALUES = Map.of(
            "sword", 1000.0,
            "amulet", 600.0,
            "staff", 800.0,
            "potion", 400.0,
            "rune", 250.0,
            "moonstone", 250.0);
    private static final Map<String, Double> BASE_PREMIUMS = Map.of(
            "sword", 100.0,
            "amulet", 60.0,
            "staff", 80.0,
            "potion", 40.0,
            "rune", 25.0,
            "moonstone", 25.0);
    private static final int PROCESSING_FEE = 5;
    private static final double DEDUCTIBLE = 100;
    private static final double CAP_FACTOR = 2;
    private static final int BLOCK_SIZE = 3;
    private static final double BLOCK_BASE_PREMIUM = 60;
    private static final double FIRST_INSURANCE_SURCHARGE = 0.10;
    private static final double LOYALTY_DISCOUNT = 0.20;
    private static final int LOYALTY_YEARS = 2;
    private static final double FOLLOW_UP_DISCOUNT = 0.15;
    private static final double CURSE_SURCHARGE = 0.50;
    private static final double HIGH_ENCHANTMENT_SURCHARGE = 0.30;
    private static final int HIGH_ENCHANTMENT_LEVEL = 5;
    private static final int HALVED_REIMBURSEMENT_LEVEL = 8;
    private static final double HALVED_REIMBURSEMENT = 0.50;

    private ClaimOffice() {
    }

    static String run(String scenarioJson) {
        try {
            JsonNode scenario = MAPPER.readTree(scenarioJson);
            JsonNode customer = scenario.get("customer");
            StringBuilder results = new StringBuilder();
            int contractsIssued = 0;
            List<Policy> policies = new ArrayList<>();
            for (JsonNode step : scenario.get("steps")) {
                if (results.length() > 0) {
                    results.append(',');
                }
                if ("claim".equals(step.get("op").asText())) {
                    Settlement settlement = settle(step, policies);
                    results.append("{\"payout\":").append(settlement.payout())
                            .append(",\"remainingCap\":")
                            .append(settlement.remainingCap()).append('}');
                } else {
                    results.append("{\"premium\":")
                            .append(quote(step, customer, contractsIssued))
                            .append('}');
                    policies.add(new Policy(step.get("items")));
                    contractsIssued++;
                }
            }
            return "{\"results\":[" + results + "]}";
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new IllegalArgumentException(e.getMessage(), e);
        }
    }

    private static long quote(JsonNode step, JsonNode customer, int contractsIssued) {
        JsonNode items = step.get("items");
        for (JsonNode item : items) {
            requireInsurableType(typeOf(item));
        }
        double basePremium = policyBasePremium(items);
        double itemSurcharges = 0;
        for (JsonNode item : items) {
            itemSurcharges += itemSurchargeOf(item);
        }
        double premium = basePremium + itemSurcharges
                + basePremium * policyModifierRate(customer, contractsIssued)
                + PROCESSING_FEE;
        return roundChargeInMhpcoFavour(premium);
    }

    private record Settlement(long payout, long remainingCap) {
    }

    private static final class Policy {

        private final JsonNode insuredItems;
        private double remainingCap;

        private Policy(JsonNode insuredItems) {
            this.insuredItems = insuredItems;
            this.remainingCap = CAP_FACTOR * insuranceSum(insuredItems);
        }
    }

    private static Settlement settle(JsonNode step, List<Policy> policies) {
        Policy policy = policies.get(step.get("policy").asInt());
        List<JsonNode> uninjuredItems = new ArrayList<>();
        policy.insuredItems.forEach(uninjuredItems::add);
        double payout = 0;
        for (JsonNode damage : step.get("incident").get("damages")) {
            payout += reimbursementFor(damage, claimDamagedItem(damage, uninjuredItems));
        }
        payout = Math.min(payout, policy.remainingCap);
        policy.remainingCap -= payout;
        return new Settlement(roundDisbursementInMhpcoFavour(payout),
                roundDisbursementInMhpcoFavour(policy.remainingCap));
    }

    private static double reimbursementFor(JsonNode damage, JsonNode insuredItem) {
        double reimbursable = damageAmountOf(damage);
        if (insuredItem.path("enchantment").asInt() >= HALVED_REIMBURSEMENT_LEVEL) {
            reimbursable *= HALVED_REIMBURSEMENT;
        }
        return Math.max(0, reimbursable - DEDUCTIBLE);
    }

    private static double damageAmountOf(JsonNode damage) {
        double amount = damage.get("amount").asDouble();
        if (amount < 0) {
            throw new IllegalArgumentException(
                    "a damage amount cannot be negative: " + amount);
        }
        return amount;
    }

    private static JsonNode claimDamagedItem(JsonNode damage,
            List<JsonNode> uninjuredItems) {
        String damagedType = damage.get("itemType").asText();
        for (int i = 0; i < uninjuredItems.size(); i++) {
            if (damagedType.equals(typeOf(uninjuredItems.get(i)))) {
                return uninjuredItems.remove(i);
            }
        }
        throw new IllegalArgumentException(
                "damaged item is not covered by the policy: " + damagedType);
    }

    private static String typeOf(JsonNode item) {
        return item.get("type").asText();
    }

    private static String requireInsurableType(String type) {
        if (!BASE_PREMIUMS.containsKey(type)) {
            throw new IllegalArgumentException(
                    "the MHPCO does not insure items of type: " + type);
        }
        return type;
    }

    private static double insuranceSum(JsonNode items) {
        double sum = 0;
        for (JsonNode item : items) {
            sum += INSURANCE_VALUES.get(typeOf(item));
        }
        return sum;
    }

    private static long roundChargeInMhpcoFavour(double amount) {
        return (long) Math.ceil(amount);
    }

    private static long roundDisbursementInMhpcoFavour(double amount) {
        return (long) Math.floor(amount);
    }

    private static double loyaltyDiscountRate(JsonNode customer) {
        if (customer.get("yearsWithMHPCO").asInt() >= LOYALTY_YEARS) {
            return LOYALTY_DISCOUNT;
        }
        return 0;
    }

    private static double policyModifierRate(JsonNode customer, int contractsIssued) {
        return FIRST_INSURANCE_SURCHARGE
                - loyaltyDiscountRate(customer)
                - followUpDiscountRate(contractsIssued);
    }

    private static double followUpDiscountRate(int contractsIssued) {
        if (contractsIssued > 0) {
            return FOLLOW_UP_DISCOUNT;
        }
        return 0;
    }

    private static double policyBasePremium(JsonNode items) {
        Map<String, Integer> countsByType = new LinkedHashMap<>();
        for (JsonNode item : items) {
            countsByType.merge(typeOf(item), 1, Integer::sum);
        }
        double basePremium = 0;
        for (Map.Entry<String, Integer> group : countsByType.entrySet()) {
            basePremium += basePremiumOfGroup(group.getKey(), group.getValue());
        }
        return basePremium;
    }

    private static double itemSurchargeOf(JsonNode item) {
        double listPremium = BASE_PREMIUMS.get(typeOf(item));
        double surcharge = 0;
        if (item.path("cursed").asBoolean()) {
            surcharge += listPremium * CURSE_SURCHARGE;
        }
        if (item.path("enchantment").asInt() >= HIGH_ENCHANTMENT_LEVEL) {
            surcharge += listPremium * HIGH_ENCHANTMENT_SURCHARGE;
        }
        return surcharge;
    }

    private static double basePremiumOfGroup(String type, int count) {
        if (count == BLOCK_SIZE) {
            return BLOCK_BASE_PREMIUM;
        }
        return count * BASE_PREMIUMS.get(type);
    }
}
