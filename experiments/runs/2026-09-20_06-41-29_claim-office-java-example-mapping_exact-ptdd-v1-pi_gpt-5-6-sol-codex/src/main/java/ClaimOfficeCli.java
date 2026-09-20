import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

public final class ClaimOfficeCli {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String ITEM_TYPE_FIELD = "type";

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        try {
            run(System.in, System.out);
        } catch (Exception exception) {
            System.err.println(exception.getMessage());
            System.exit(1);
        }
    }

    public static void run(InputStream input, OutputStream output) throws Exception {
        JsonNode scenario = JSON.readTree(input);
        ArrayNode results = JSON.createArrayNode();
        int yearsWithMhpco = scenario.get("customer").get("yearsWithMHPCO").asInt();
        int previousContracts = 0;
        int stepIndex = 0;
        Map<Integer, JsonNode> policies = new HashMap<>();
        Map<Integer, Integer> remainingCaps = new HashMap<>();
        for (JsonNode step : scenario.get("steps")) {
            ObjectNode result = JSON.createObjectNode();
            if ("quote".equals(step.get("op").asText())) {
                JsonNode items = step.get("items");
                result.put("premium", calculatePremium(items, yearsWithMhpco, previousContracts));
                policies.put(stepIndex, items);
                remainingCaps.put(stepIndex, insuranceSum(items) * 2);
                previousContracts++;
            } else {
                int policy = step.get("policy").asInt();
                int desiredPayout = claimPayout(
                        step.at("/incident/damages"), policies.get(policy));
                int payout = Math.min(desiredPayout, remainingCaps.get(policy));
                remainingCaps.put(policy, remainingCaps.get(policy) - payout);
                result.put("payout", payout);
                result.put("remainingCap", remainingCaps.get(policy));
            }
            results.add(result);
            stepIndex++;
        }
        ObjectNode response = JSON.createObjectNode();
        response.set("results", results);
        JSON.writeValue(output, response);
    }

    private static int claimPayout(JsonNode damages, JsonNode insuredItems) {
        validateClaimCoverage(damages, insuredItems);
        double payout = 0;
        for (JsonNode damage : damages) {
            String itemType = damage.get("itemType").asText();
            JsonNode insuredItem = findInsuredItem(insuredItems, itemType);
            double reimbursable = reimbursableDamage(
                    insuredItem, damage.get("amount").asInt());
            payout += Math.max(0, reimbursable - 100);
        }
        return (int) Math.floor(payout);
    }

    private static void validateClaimCoverage(JsonNode damages, JsonNode insuredItems) {
        Map<String, Integer> matchedCounts = new HashMap<>();
        for (JsonNode damage : damages) {
            validateDamageAmount(damage);
            String itemType = damage.get("itemType").asText();
            int matchedCount = matchedCounts.merge(itemType, 1, Integer::sum);
            if (matchedCount > countItems(insuredItems, itemType)) {
                throw new IllegalArgumentException("Damage item is not insured: " + itemType);
            }
        }
    }

    private static void validateDamageAmount(JsonNode damage) {
        if (damage.get("amount").asInt() < 0) {
            throw new IllegalArgumentException("Damage amount must not be negative");
        }
    }

    private static double reimbursableDamage(JsonNode insuredItem, int damageAmount) {
        return insuredItem.path("enchantment").asInt() >= 8
                ? damageAmount * 0.5 : damageAmount;
    }

    private static JsonNode findInsuredItem(JsonNode insuredItems, String itemType) {
        for (JsonNode item : insuredItems) {
            if (itemType.equals(item.get(ITEM_TYPE_FIELD).asText())) {
                return item;
            }
        }
        throw new IllegalArgumentException("Damage item is not insured: " + itemType);
    }

    private static int insuranceSum(JsonNode items) {
        int sum = 0;
        for (JsonNode item : items) {
            sum += switch (item.get(ITEM_TYPE_FIELD).asText()) {
                case "sword" -> 1000;
                case "amulet" -> 600;
                case "staff" -> 800;
                case "potion" -> 400;
                default -> 250;
            };
        }
        return sum;
    }

    private static int calculatePremium(
            JsonNode items, int yearsWithMhpco, int previousContracts) {
        int totalBasePremium = 0;
        for (JsonNode item : items) {
            totalBasePremium += basePremium(item.get(ITEM_TYPE_FIELD).asText());
        }
        totalBasePremium -= componentBlockDiscount(items);
        double premium = totalBasePremium + initialAssessment(totalBasePremium)
                - loyaltyDiscount(totalBasePremium, yearsWithMhpco)
                - followUpDiscount(totalBasePremium, previousContracts) + itemRiskSurcharge(items);
        return (int) Math.ceil(premium + 5);
    }

    private static double initialAssessment(int policyBasePremium) {
        return policyBasePremium * 10 / 100.0;
    }

    private static double loyaltyDiscount(int policyBasePremium, int yearsWithMhpco) {
        return yearsWithMhpco >= 2 ? policyBasePremium * 20 / 100.0 : 0;
    }

    private static double followUpDiscount(int policyBasePremium, int previousContracts) {
        return previousContracts > 0 ? policyBasePremium * 15 / 100.0 : 0;
    }

    private static double itemRiskSurcharge(JsonNode items) {
        double surcharge = 0;
        for (JsonNode item : items) {
            int itemBasePremium = basePremium(item.get(ITEM_TYPE_FIELD).asText());
            surcharge += curseSurcharge(itemBasePremium, item)
                    + enchantmentSurcharge(itemBasePremium, item);
        }
        return surcharge;
    }

    private static double curseSurcharge(int itemBasePremium, JsonNode item) {
        return item.path("cursed").asBoolean() ? itemBasePremium * 50 / 100.0 : 0;
    }

    private static double enchantmentSurcharge(int itemBasePremium, JsonNode item) {
        return item.path("enchantment").asInt() >= 5 ? itemBasePremium * 30 / 100.0 : 0;
    }

    private static int componentBlockDiscount(JsonNode items) {
        int discount = 0;
        if (countItems(items, "rune") == 3) {
            discount += 15;
        }
        if (countItems(items, "moonstone") == 3) {
            discount += 15;
        }
        return discount;
    }

    private static int countItems(JsonNode items, String type) {
        int count = 0;
        for (JsonNode item : items) {
            if (type.equals(item.get(ITEM_TYPE_FIELD).asText())) {
                count++;
            }
        }
        return count;
    }

    private static int basePremium(String itemType) {
        return switch (itemType) {
            case "sword" -> 100;
            case "amulet" -> 60;
            case "staff" -> 80;
            case "potion" -> 40;
            case "rune", "moonstone" -> 25;
            default -> throw new IllegalArgumentException("Unknown item type: " + itemType);
        };
    }
}
