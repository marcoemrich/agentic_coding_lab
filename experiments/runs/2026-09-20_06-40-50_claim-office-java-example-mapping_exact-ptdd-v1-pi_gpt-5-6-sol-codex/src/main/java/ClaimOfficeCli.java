import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.HashMap;
import java.util.Map;

public final class ClaimOfficeCli {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String ITEMS = "items";
    private static final String TYPE = "type";

    private ClaimOfficeCli() {
    }

    public static String process(String input) {
        try {
            JsonNode scenario = JSON.readTree(input);
            ArrayNode results = JSON.createArrayNode();
            Map<Integer, Policy> policies = new HashMap<>();
            int priorQuotes = 0;
            int stepIndex = 0;
            for (JsonNode step : scenario.path("steps")) {
                ObjectNode result = results.addObject();
                if ("quote".equals(step.path("op").asText())) {
                    result.put("premium", premiumFor(step,
                            scenario.path("customer").path("yearsWithMHPCO").asInt(), priorQuotes > 0));
                    policies.put(stepIndex, new Policy(step.path(ITEMS), insuranceSum(step.path(ITEMS)) * 2));
                    priorQuotes++;
                } else {
                    processClaim(step, policies.get(step.path("policy").asInt()), result);
                }
                stepIndex++;
            }
            ObjectNode output = JSON.createObjectNode();
            output.set("results", results);
            return JSON.writeValueAsString(output);
        } catch (Exception exception) {
            throw new IllegalArgumentException("Invalid scenario", exception);
        }
    }

    private static void processClaim(JsonNode claim, Policy policy, ObjectNode result) {
        int payout = Math.min((int) Math.floor(desiredPayoutFor(claim, policy)), policy.remainingCap);
        policy.remainingCap -= payout;
        result.put("payout", payout);
        result.put("remainingCap", policy.remainingCap);
    }

    private static double desiredPayoutFor(JsonNode claim, Policy policy) {
        double desiredPayout = 0;
        Map<String, Integer> usedItems = new HashMap<>();
        for (JsonNode damage : claim.path("incident").path("damages")) {
            requireValidDamageAmount(damage.path("amount").asInt());
            String type = damage.path("itemType").asText();
            int occurrence = usedItems.getOrDefault(type, 0);
            JsonNode item = insuredItem(policy.items, type, occurrence);
            usedItems.put(type, occurrence + 1);
            desiredPayout += reimbursementFor(item, damage.path("amount").asInt());
        }
        return desiredPayout;
    }

    private static void requireValidDamageAmount(int amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Damage amount must not be negative");
        }
    }

    private static double reimbursementFor(JsonNode item, int damageAmount) {
        double reimbursementRate = item.path("enchantment").asInt() >= 8 ? 0.50 : 1;
        return Math.max(0, damageAmount * reimbursementRate - 100);
    }

    private static JsonNode insuredItem(JsonNode items, String type, int occurrence) {
        int matchingIndex = 0;
        for (JsonNode item : items) {
            if (type.equals(item.path(TYPE).asText())) {
                if (matchingIndex == occurrence) {
                    return item;
                }
                matchingIndex++;
            }
        }
        throw new IllegalArgumentException("Damaged item is not insured: " + type);
    }

    private static int insuranceSum(JsonNode items) {
        int sum = 0;
        for (JsonNode item : items) {
            sum += switch (item.path(TYPE).asText()) {
                case "sword" -> 1000;
                case "amulet" -> 600;
                case "staff" -> 800;
                case "potion" -> 400;
                case "rune", "moonstone" -> 250;
                default -> 0;
            };
        }
        return sum;
    }

    private static int premiumFor(JsonNode quote, int yearsWithMhpco, boolean followUpContract) {
        int basePremium = basePremiumFor(quote.path(ITEMS));
        double premium = basePremium + cursedSurcharge(quote.path(ITEMS))
                + highEnchantmentSurcharge(quote.path(ITEMS))
                - loyaltyDiscount(basePremium, yearsWithMhpco) + basePremium * 0.10
                - followUpContractDiscount(basePremium, followUpContract) + 5;
        return (int) Math.ceil(premium);
    }

    private static int basePremiumFor(JsonNode items) {
        int basePremium = 0;
        for (JsonNode item : items) {
            basePremium += itemBasePremium(item.path(TYPE).asText());
        }
        return basePremium - componentBlockDiscount(items, "rune")
                - componentBlockDiscount(items, "moonstone");
    }

    private static double followUpContractDiscount(int basePremium, boolean followUpContract) {
        return followUpContract ? basePremium * 0.15 : 0;
    }

    private static double loyaltyDiscount(int basePremium, int yearsWithMhpco) {
        return yearsWithMhpco >= 2 ? basePremium * 0.20 : 0;
    }

    private static double highEnchantmentSurcharge(JsonNode items) {
        double surcharge = 0;
        for (JsonNode item : items) {
            if (item.path("enchantment").asInt() >= 5) {
                surcharge += itemBasePremium(item.path(TYPE).asText()) * 0.30;
            }
        }
        return surcharge;
    }

    private static double cursedSurcharge(JsonNode items) {
        double surcharge = 0;
        for (JsonNode item : items) {
            if (item.path("cursed").asBoolean()) {
                surcharge += itemBasePremium(item.path(TYPE).asText()) * 0.50;
            }
        }
        return surcharge;
    }

    private static int itemBasePremium(String type) {
        return switch (type) {
            case "sword" -> 100;
            case "amulet" -> 60;
            case "staff" -> 80;
            case "potion" -> 40;
            case "rune", "moonstone" -> 25;
            default -> throw new IllegalArgumentException("Unknown item type: " + type);
        };
    }

    private static int componentBlockDiscount(JsonNode items, String type) {
        long count = java.util.stream.StreamSupport.stream(items.spliterator(), false)
                .filter(item -> type.equals(item.path(TYPE).asText()))
                .count();
        return count == 3 ? 15 : 0;
    }

    private static final class Policy {
        private final JsonNode items;
        private int remainingCap;

        private Policy(JsonNode items, int remainingCap) {
            this.items = items;
            this.remainingCap = remainingCap;
        }
    }

    public static void main(String[] args) throws Exception {
        String input = new String(System.in.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
        System.out.print(process(input));
    }
}
