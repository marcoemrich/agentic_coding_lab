import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Processes MHPCO scenarios. A new instance may be used for each document. */
public final class ClaimOffice {
    private static final Map<String, Integer> VALUES = Map.of(
            "sword", 1000,
            "amulet", 600,
            "staff", 800,
            "potion", 400,
            "rune", 250,
            "moonstone", 250);
    private static final Map<String, Integer> PREMIUMS = Map.of(
            "sword", 100,
            "amulet", 60,
            "staff", 80,
            "potion", 40,
            "rune", 25,
            "moonstone", 25);

    private final ObjectMapper mapper;
    private final Map<Integer, Policy> policies = new HashMap<>();
    private int quoteCount;

    public ClaimOffice(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public ObjectNode process(JsonNode scenario) {
        policies.clear();
        quoteCount = 0;
        requireObject(scenario, "scenario");
        JsonNode customer = required(scenario, "customer");
        requireObject(customer, "customer");
        int years = requiredInteger(customer, "yearsWithMHPCO");
        JsonNode steps = required(scenario, "steps");
        if (!steps.isArray()) {
            throw invalid("steps must be an array");
        }

        ArrayNode results = mapper.createArrayNode();
        int stepIndex = 0;
        for (JsonNode step : steps) {
            results.add(processStep(step, stepIndex, years));
            stepIndex++;
        }
        ObjectNode output = mapper.createObjectNode();
        output.set("results", results);
        return output;
    }

    private ObjectNode processStep(JsonNode step, int stepIndex, int years) {
        requireObject(step, "step " + stepIndex);
        String operation = requiredText(step, "op");
        return switch (operation) {
            case "quote" -> quote(step, stepIndex, years);
            case "claim" -> claim(step, stepIndex);
            default -> throw invalid("unknown operation: " + operation);
        };
    }

    private ObjectNode quote(JsonNode step, int stepIndex, int years) {
        JsonNode itemNodes = required(step, "items");
        if (!itemNodes.isArray()) {
            throw invalid("items must be an array");
        }

        List<InsuredItem> items = readItems(itemNodes);
        Map<String, Integer> componentCounts = componentCounts(items);
        int base = 0;
        int itemSurchargesInHundredths = 0;
        int insuranceSum = 0;
        for (InsuredItem item : items) {
            int itemBase = itemBase(item.type(), componentCounts);
            base += itemBase;
            insuranceSum += VALUES.get(item.type());
            if (item.cursed()) {
                itemSurchargesInHundredths += itemBase * 50;
            }
            if (item.enchantment() != null && item.enchantment() >= 5) {
                itemSurchargesInHundredths += itemBase * 30;
            }
        }

        int premiumInHundredths = base * 100 + itemSurchargesInHundredths + base * 10 + 500;
        if (years >= 2) {
            premiumInHundredths -= base * 20;
        }
        if (quoteCount > 0) {
            premiumInHundredths -= base * 15;
        }
        int premium = ceilingHundredths(premiumInHundredths);
        policies.put(stepIndex, new Policy(List.copyOf(items), insuranceSum * 2));
        quoteCount++;

        ObjectNode result = mapper.createObjectNode();
        result.put("premium", premium);
        return result;
    }

    private ObjectNode claim(JsonNode step, int stepIndex) {
        int policyIndex = requiredInteger(step, "policy");
        if (policyIndex >= stepIndex) {
            throw invalid("policy must refer to an earlier quote step");
        }
        Policy policy = policies.get(policyIndex);
        if (policy == null) {
            throw invalid("policy does not refer to a quote step: " + policyIndex);
        }
        JsonNode incident = required(step, "incident");
        requireObject(incident, "incident");
        requiredText(incident, "cause");
        JsonNode damages = required(incident, "damages");
        if (!damages.isArray()) {
            throw invalid("damages must be an array");
        }

        Map<String, Integer> usedByType = new HashMap<>();
        long payoutInHalves = 0;
        for (JsonNode damage : damages) {
            requireObject(damage, "damage");
            String type = requiredText(damage, "itemType");
            if (!VALUES.containsKey(type)) {
                throw invalid("unknown damaged item type: " + type);
            }
            int amount = requiredInteger(damage, "amount");
            if (amount < 0) {
                throw invalid("damage amount must not be negative");
            }
            InsuredItem item = nextInsuredItem(policy.items(), type, usedByType);
            payoutInHalves += damagePayoutInHalves(item, amount);
        }

        long desiredPayout = payoutInHalves / 2;
        int payout = (int) Math.min(desiredPayout, policy.remainingCap());
        policy.reduceCap(payout);
        ObjectNode result = mapper.createObjectNode();
        result.put("payout", payout);
        result.put("remainingCap", policy.remainingCap());
        return result;
    }

    private static List<InsuredItem> readItems(JsonNode itemNodes) {
        List<InsuredItem> items = new ArrayList<>();
        for (JsonNode node : itemNodes) {
            requireObject(node, "item");
            String type = requiredText(node, "type");
            if (!VALUES.containsKey(type)) {
                throw invalid("unknown item type: " + type);
            }
            String material = optionalText(node, "material");
            Integer enchantment = optionalInteger(node, "enchantment");
            boolean cursed = optionalBoolean(node, "cursed");
            items.add(new InsuredItem(type, material, enchantment, cursed));
        }
        return items;
    }

    private static Map<String, Integer> componentCounts(List<InsuredItem> items) {
        Map<String, Integer> counts = new HashMap<>();
        for (InsuredItem item : items) {
            if (isComponent(item.type())) {
                counts.merge(item.type(), 1, Integer::sum);
            }
        }
        return counts;
    }

    private static int itemBase(String type, Map<String, Integer> componentCounts) {
        if (isComponent(type) && componentCounts.getOrDefault(type, 0) == 3) {
            return 20;
        }
        return PREMIUMS.get(type);
    }

    private static boolean isComponent(String type) {
        return "rune".equals(type) || "moonstone".equals(type);
    }

    private static InsuredItem nextInsuredItem(List<InsuredItem> items, String type,
                                                Map<String, Integer> usedByType) {
        int requestedOccurrence = usedByType.getOrDefault(type, 0);
        int found = 0;
        for (InsuredItem item : items) {
            if (item.type().equals(type)) {
                if (found == requestedOccurrence) {
                    usedByType.put(type, requestedOccurrence + 1);
                    return item;
                }
                found++;
            }
        }
        throw invalid("damaged item is not covered, or appears too many times: " + type);
    }

    private static long damagePayoutInHalves(InsuredItem item, int amount) {
        long reimbursedInHalves = item.enchantment() != null && item.enchantment() >= 8
                ? amount : amount * 2L;
        return Math.max(0, reimbursedInHalves - 200L);
    }

    private static int ceilingHundredths(int amount) {
        return Math.floorDiv(amount + 99, 100);
    }

    private static JsonNode required(JsonNode object, String field) {
        JsonNode value = object.get(field);
        if (value == null || value.isNull()) {
            throw invalid("missing required field: " + field);
        }
        return value;
    }

    private static String requiredText(JsonNode object, String field) {
        JsonNode value = required(object, field);
        if (!value.isTextual()) {
            throw invalid(field + " must be a string");
        }
        return value.textValue();
    }

    private static int requiredInteger(JsonNode object, String field) {
        JsonNode value = required(object, field);
        if (!value.isIntegralNumber() || !value.canConvertToInt()) {
            throw invalid(field + " must be an integer");
        }
        return value.intValue();
    }

    private static Integer optionalInteger(JsonNode object, String field) {
        JsonNode value = object.get(field);
        if (value == null || value.isNull()) {
            return null;
        }
        if (!value.isIntegralNumber() || !value.canConvertToInt()) {
            throw invalid(field + " must be an integer");
        }
        return value.intValue();
    }

    private static String optionalText(JsonNode object, String field) {
        JsonNode value = object.get(field);
        if (value == null || value.isNull()) {
            return null;
        }
        if (!value.isTextual()) {
            throw invalid(field + " must be a string");
        }
        return value.textValue();
    }

    private static boolean optionalBoolean(JsonNode object, String field) {
        JsonNode value = object.get(field);
        if (value == null || value.isNull()) {
            return false;
        }
        if (!value.isBoolean()) {
            throw invalid(field + " must be a boolean");
        }
        return value.booleanValue();
    }

    private static void requireObject(JsonNode value, String name) {
        if (value == null || !value.isObject()) {
            throw invalid(name + " must be an object");
        }
    }

    private static IllegalArgumentException invalid(String message) {
        return new IllegalArgumentException(message);
    }

    private record InsuredItem(String type, String material, Integer enchantment, boolean cursed) {
    }

    private static final class Policy {
        private final List<InsuredItem> items;
        private int remainingCap;

        private Policy(List<InsuredItem> items, int remainingCap) {
            this.items = items;
            this.remainingCap = remainingCap;
        }

        private List<InsuredItem> items() {
            return items;
        }

        private int remainingCap() {
            return remainingCap;
        }

        private void reduceCap(int payout) {
            remainingCap -= payout;
        }
    }
}
