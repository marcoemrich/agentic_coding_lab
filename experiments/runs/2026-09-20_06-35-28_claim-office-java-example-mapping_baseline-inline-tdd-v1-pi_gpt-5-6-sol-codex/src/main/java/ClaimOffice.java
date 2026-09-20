import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Applies the MHPCO quotation and claim rules to one scenario. */
public final class ClaimOffice {
    private static final BigDecimal CURSE_RATE = new BigDecimal("0.50");
    private static final BigDecimal ENCHANTMENT_RATE = new BigDecimal("0.30");
    private static final BigDecimal LOYALTY_RATE = new BigDecimal("0.20");
    private static final BigDecimal INITIAL_RATE = new BigDecimal("0.10");
    private static final BigDecimal FOLLOW_UP_RATE = new BigDecimal("0.15");
    private static final BigDecimal HALF = new BigDecimal("0.50");
    private static final BigDecimal DEDUCTIBLE = new BigDecimal("100");

    public ObjectNode process(JsonNode scenario) {
        ObjectNode root = requireObject(scenario, "scenario");
        ObjectNode customer = requireObject(root.get("customer"), "customer");
        int years = requireInt(customer.get("yearsWithMHPCO"), "customer.yearsWithMHPCO");
        ArrayNode steps = requireArray(root.get("steps"), "steps");

        ObjectNode output = com.fasterxml.jackson.databind.node.JsonNodeFactory.instance.objectNode();
        ArrayNode results = output.putArray("results");
        Map<Integer, Policy> policies = new HashMap<>();
        int quoteNumber = 0;

        for (int stepIndex = 0; stepIndex < steps.size(); stepIndex++) {
            ObjectNode step = requireObject(steps.get(stepIndex), "steps[" + stepIndex + "]");
            String operation = requireText(step.get("op"), "steps[" + stepIndex + "].op");
            if ("quote".equals(operation)) {
                Policy policy = createPolicy(step, years, quoteNumber++);
                policies.put(stepIndex, policy);
                results.addObject().put("premium", policy.premium());
            } else if ("claim".equals(operation)) {
                results.add(processClaim(step, policies));
            } else {
                throw invalid("unknown operation: " + operation);
            }
        }
        return output;
    }

    private Policy createPolicy(ObjectNode step, int years, int quoteNumber) {
        ArrayNode itemNodes = requireArray(step.get("items"), "quote.items");
        List<Item> items = new ArrayList<>();
        Map<ItemType, Integer> componentCounts = new HashMap<>();

        for (int index = 0; index < itemNodes.size(); index++) {
            ObjectNode node = requireObject(itemNodes.get(index), "quote.items[" + index + "]");
            ItemType type = ItemType.from(requireText(node.get("type"), "item.type"));
            int enchantment = optionalInt(node.get("enchantment"), "item.enchantment", 0);
            boolean cursed = optionalBoolean(node.get("cursed"), "item.cursed", false);
            String material = optionalText(node.get("material"), "item.material", "");
            items.add(new Item(type, material, enchantment, cursed));
            if (type.component) {
                componentCounts.merge(type, 1, Integer::sum);
            }
        }

        BigDecimal base = BigDecimal.ZERO;
        BigDecimal itemSurcharges = BigDecimal.ZERO;
        long insuranceSum = 0;
        for (Item item : items) {
            BigDecimal itemBase = BigDecimal.valueOf(item.type.basePremium);
            if (item.type.component && componentCounts.get(item.type) == 3) {
                itemBase = new BigDecimal("20");
            }
            base = base.add(itemBase);
            if (item.cursed) {
                itemSurcharges = itemSurcharges.add(itemBase.multiply(CURSE_RATE));
            }
            if (item.enchantment >= 5) {
                itemSurcharges = itemSurcharges.add(itemBase.multiply(ENCHANTMENT_RATE));
            }
            insuranceSum = Math.addExact(insuranceSum, item.type.insuranceValue);
        }

        BigDecimal premium = base.add(itemSurcharges).add(base.multiply(INITIAL_RATE));
        if (years >= 2) {
            premium = premium.subtract(base.multiply(LOYALTY_RATE));
        }
        if (quoteNumber > 0) {
            premium = premium.subtract(base.multiply(FOLLOW_UP_RATE));
        }
        premium = premium.add(BigDecimal.valueOf(5));
        long roundedPremium = premium.setScale(0, RoundingMode.CEILING).longValueExact();
        return new Policy(items, roundedPremium, Math.multiplyExact(insuranceSum, 2));
    }

    private ObjectNode processClaim(ObjectNode step, Map<Integer, Policy> policies) {
        int policyIndex = requireInt(step.get("policy"), "claim.policy");
        Policy policy = policies.get(policyIndex);
        if (policy == null) {
            throw invalid("claim.policy must refer to an earlier quote step");
        }
        ObjectNode incident = requireObject(step.get("incident"), "claim.incident");
        requireText(incident.get("cause"), "claim.incident.cause");
        ArrayNode damages = requireArray(incident.get("damages"), "claim.incident.damages");

        Map<ItemType, List<Item>> covered = new HashMap<>();
        for (Item item : policy.items) {
            covered.computeIfAbsent(item.type, ignored -> new ArrayList<>()).add(item);
        }
        Map<ItemType, Integer> used = new HashMap<>();
        BigDecimal desired = BigDecimal.ZERO;
        for (int index = 0; index < damages.size(); index++) {
            ObjectNode damage = requireObject(damages.get(index), "damages[" + index + "]");
            ItemType type = ItemType.from(requireText(damage.get("itemType"), "damage.itemType"));
            long amount = requireLong(damage.get("amount"), "damage.amount");
            if (amount < 0) {
                throw invalid("damage amount must not be negative");
            }
            int occurrence = used.getOrDefault(type, 0);
            List<Item> matching = covered.get(type);
            if (matching == null || occurrence >= matching.size()) {
                throw invalid("damaged item is not covered by the policy: " + type.externalName);
            }
            used.put(type, occurrence + 1);
            Item item = matching.get(occurrence);
            BigDecimal reimbursement = BigDecimal.valueOf(amount);
            if (item.enchantment >= 8) {
                reimbursement = reimbursement.multiply(HALF);
            }
            reimbursement = reimbursement.subtract(DEDUCTIBLE).max(BigDecimal.ZERO);
            desired = desired.add(reimbursement);
        }

        BigDecimal available = BigDecimal.valueOf(policy.remainingCap);
        long payout = desired.min(available).setScale(0, RoundingMode.FLOOR).longValueExact();
        policy.remainingCap -= payout;
        return com.fasterxml.jackson.databind.node.JsonNodeFactory.instance.objectNode()
                .put("payout", payout)
                .put("remainingCap", policy.remainingCap);
    }

    private static ObjectNode requireObject(JsonNode node, String field) {
        if (node == null || !node.isObject()) {
            throw invalid(field + " must be an object");
        }
        return (ObjectNode) node;
    }

    private static ArrayNode requireArray(JsonNode node, String field) {
        if (node == null || !node.isArray()) {
            throw invalid(field + " must be an array");
        }
        return (ArrayNode) node;
    }

    private static String requireText(JsonNode node, String field) {
        if (node == null || !node.isTextual()) {
            throw invalid(field + " must be a string");
        }
        return node.textValue();
    }

    private static String optionalText(JsonNode node, String field, String fallback) {
        return node == null ? fallback : requireText(node, field);
    }

    private static int requireInt(JsonNode node, String field) {
        if (node == null || !node.isIntegralNumber() || !node.canConvertToInt()) {
            throw invalid(field + " must be an integer");
        }
        return node.intValue();
    }

    private static int optionalInt(JsonNode node, String field, int fallback) {
        return node == null ? fallback : requireInt(node, field);
    }

    private static long requireLong(JsonNode node, String field) {
        if (node == null || !node.isIntegralNumber() || !node.canConvertToLong()) {
            throw invalid(field + " must be an integer");
        }
        return node.longValue();
    }

    private static boolean optionalBoolean(JsonNode node, String field, boolean fallback) {
        if (node == null) {
            return fallback;
        }
        if (!node.isBoolean()) {
            throw invalid(field + " must be a boolean");
        }
        return node.booleanValue();
    }

    private static IllegalArgumentException invalid(String message) {
        return new IllegalArgumentException(message);
    }

    private enum ItemType {
        SWORD("sword", 1000, 100, false),
        AMULET("amulet", 600, 60, false),
        STAFF("staff", 800, 80, false),
        POTION("potion", 400, 40, false),
        RUNE("rune", 250, 25, true),
        MOONSTONE("moonstone", 250, 25, true);

        private final String externalName;
        private final long insuranceValue;
        private final long basePremium;
        private final boolean component;

        ItemType(String externalName, long insuranceValue, long basePremium, boolean component) {
            this.externalName = externalName;
            this.insuranceValue = insuranceValue;
            this.basePremium = basePremium;
            this.component = component;
        }

        private static ItemType from(String name) {
            for (ItemType type : values()) {
                if (type.externalName.equals(name)) {
                    return type;
                }
            }
            throw invalid("unknown item type: " + name);
        }
    }

    private record Item(ItemType type, String material, int enchantment, boolean cursed) { }

    private static final class Policy {
        private final List<Item> items;
        private final long premium;
        private long remainingCap;

        private Policy(List<Item> items, long premium, long remainingCap) {
            this.items = List.copyOf(items);
            this.premium = premium;
            this.remainingCap = remainingCap;
        }

        private long premium() {
            return premium;
        }
    }
}
