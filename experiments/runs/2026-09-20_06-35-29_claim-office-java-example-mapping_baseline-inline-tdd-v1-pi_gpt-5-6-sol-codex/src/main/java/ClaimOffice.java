import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Processes quote and claim scenarios for one customer. */
public final class ClaimOffice {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final long PROCESSING_FEE_HUNDREDTHS = 500;
    private final Map<Integer, Policy> policies = new HashMap<>();
    private int quoteCount;

    /** Processes a complete scenario. A ClaimOffice instance handles one scenario. */
    public ObjectNode process(JsonNode scenario) {
        policies.clear();
        quoteCount = 0;
        requireObject(scenario, "scenario");
        JsonNode customer = required(scenario, "customer");
        requireObject(customer, "customer");
        int years = requiredInt(customer, "yearsWithMHPCO");
        JsonNode steps = required(scenario, "steps");
        requireArray(steps, "steps");

        ArrayNode results = JSON.createArrayNode();
        for (int index = 0; index < steps.size(); index++) {
            JsonNode step = steps.get(index);
            requireObject(step, "step " + index);
            String operation = requiredText(step, "op");
            if ("quote".equals(operation)) {
                results.add(quote(step, years, index));
            } else if ("claim".equals(operation)) {
                results.add(claim(step));
            } else {
                throw invalid("unknown operation: " + operation);
            }
        }
        return JSON.createObjectNode().set("results", results);
    }

    private ObjectNode quote(JsonNode step, int years, int stepIndex) {
        JsonNode itemNodes = required(step, "items");
        requireArray(itemNodes, "items");
        List<InsuredItem> items = parseItems(itemNodes);
        Map<ItemType, Integer> counts = counts(items);

        long baseHundredths = 0;
        long itemSurchargesHundredths = 0;
        long insuranceSum = 0;
        for (InsuredItem item : items) {
            long itemBase = effectiveBase(item.type(), counts.get(item.type()));
            baseHundredths += itemBase * 100;
            if (item.cursed()) {
                itemSurchargesHundredths += itemBase * 50;
            }
            if (item.highlyEnchantedForPremium()) {
                itemSurchargesHundredths += itemBase * 30;
            }
            insuranceSum += item.type().insuranceValue;
        }

        long premiumHundredths = baseHundredths + itemSurchargesHundredths;
        premiumHundredths += baseHundredths / 10; // Every item is a first insurance: +10%.
        if (years >= 2) {
            premiumHundredths -= baseHundredths / 5;
        }
        if (quoteCount > 0) {
            premiumHundredths -= baseHundredths * 15 / 100;
        }
        premiumHundredths += PROCESSING_FEE_HUNDREDTHS;

        Policy policy = new Policy(items, insuranceSum * 2);
        policies.put(stepIndex, policy);
        quoteCount++;
        return JSON.createObjectNode().put("premium", roundPremium(premiumHundredths));
    }

    private ObjectNode claim(JsonNode step) {
        int policyIndex = requiredInt(step, "policy");
        Policy policy = policies.get(policyIndex);
        if (policy == null) {
            throw invalid("policy does not refer to an earlier quote: " + policyIndex);
        }
        JsonNode incident = required(step, "incident");
        requireObject(incident, "incident");
        requiredText(incident, "cause");
        JsonNode damages = required(incident, "damages");
        requireArray(damages, "damages");

        Map<ItemType, Integer> used = new EnumMap<>(ItemType.class);
        long desiredTenths = 0;
        for (JsonNode damage : damages) {
            requireObject(damage, "damage");
            String itemName = requiredText(damage, "itemType");
            ItemType type = ItemType.fromName(itemName);
            long amount = requiredLong(damage, "amount");
            if (amount < 0) {
                throw invalid("damage amount must not be negative");
            }
            int occurrence = used.getOrDefault(type, 0);
            InsuredItem item = policy.item(type, occurrence);
            if (item == null) {
                throw invalid("damaged item is not covered by the policy: " + itemName);
            }
            used.put(type, occurrence + 1);
            long reimbursedTenths = item.hasSevereEnchantment() ? amount * 5 : amount * 10;
            desiredTenths += Math.max(0, reimbursedTenths - 1_000);
        }

        long payableTenths = Math.min(desiredTenths, policy.remainingCap * 10);
        long payout = payableTenths / 10; // The office rounds payouts down.
        policy.remainingCap -= payout;
        return JSON.createObjectNode()
                .put("payout", payout)
                .put("remainingCap", policy.remainingCap);
    }

    private static List<InsuredItem> parseItems(JsonNode nodes) {
        List<InsuredItem> items = new ArrayList<>();
        for (JsonNode node : nodes) {
            requireObject(node, "item");
            ItemType type = ItemType.fromName(requiredText(node, "type"));
            boolean cursed = optionalBoolean(node, "cursed", false);
            Integer enchantment = optionalInt(node, "enchantment");
            String material = optionalText(node, "material");
            if (type.component) {
                enchantment = null;
                material = null;
            }
            items.add(new InsuredItem(type, material, enchantment, cursed));
        }
        return List.copyOf(items);
    }

    private static Map<ItemType, Integer> counts(List<InsuredItem> items) {
        Map<ItemType, Integer> result = new EnumMap<>(ItemType.class);
        for (InsuredItem item : items) {
            result.merge(item.type(), 1, Integer::sum);
        }
        return result;
    }

    private static long effectiveBase(ItemType type, int count) {
        return type.component && count == 3 ? 20 : type.basePremium;
    }

    private static long roundPremium(long hundredths) {
        return (hundredths + 99) / 100;
    }

    private static JsonNode required(JsonNode parent, String field) {
        JsonNode value = parent.get(field);
        if (value == null || value.isNull()) {
            throw invalid("missing field: " + field);
        }
        return value;
    }

    private static String requiredText(JsonNode parent, String field) {
        JsonNode value = required(parent, field);
        if (!value.isTextual()) {
            throw invalid(field + " must be a string");
        }
        return value.textValue();
    }

    private static int requiredInt(JsonNode parent, String field) {
        JsonNode value = required(parent, field);
        if (!value.isIntegralNumber() || !value.canConvertToInt()) {
            throw invalid(field + " must be an integer");
        }
        return value.intValue();
    }

    private static long requiredLong(JsonNode parent, String field) {
        JsonNode value = required(parent, field);
        if (!value.isIntegralNumber() || !value.canConvertToLong()) {
            throw invalid(field + " must be an integer");
        }
        return value.longValue();
    }

    private static boolean optionalBoolean(JsonNode parent, String field, boolean fallback) {
        JsonNode value = parent.get(field);
        if (value == null || value.isNull()) {
            return fallback;
        }
        if (!value.isBoolean()) {
            throw invalid(field + " must be a boolean");
        }
        return value.booleanValue();
    }

    private static Integer optionalInt(JsonNode parent, String field) {
        JsonNode value = parent.get(field);
        if (value == null || value.isNull()) {
            return null;
        }
        if (!value.isIntegralNumber() || !value.canConvertToInt()) {
            throw invalid(field + " must be an integer");
        }
        return value.intValue();
    }

    private static String optionalText(JsonNode parent, String field) {
        JsonNode value = parent.get(field);
        if (value == null || value.isNull()) {
            return null;
        }
        if (!value.isTextual()) {
            throw invalid(field + " must be a string");
        }
        return value.textValue();
    }

    private static void requireObject(JsonNode value, String name) {
        if (value == null || !value.isObject()) {
            throw invalid(name + " must be an object");
        }
    }

    private static void requireArray(JsonNode value, String name) {
        if (!value.isArray()) {
            throw invalid(name + " must be an array");
        }
    }

    private static IllegalArgumentException invalid(String message) {
        return new IllegalArgumentException(message);
    }

    private enum ItemType {
        SWORD("sword", 1_000, 100, false),
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

        private static ItemType fromName(String name) {
            for (ItemType type : values()) {
                if (type.externalName.equals(name)) {
                    return type;
                }
            }
            throw invalid("unknown item type: " + name);
        }
    }

    private record InsuredItem(ItemType type, String material, Integer enchantment, boolean cursed) {
        private boolean highlyEnchantedForPremium() {
            return enchantment != null && enchantment >= 5;
        }

        private boolean hasSevereEnchantment() {
            return enchantment != null && enchantment >= 8;
        }
    }

    private static final class Policy {
        private final List<InsuredItem> items;
        private long remainingCap;

        private Policy(List<InsuredItem> items, long cap) {
            this.items = items;
            this.remainingCap = cap;
        }

        private InsuredItem item(ItemType type, int occurrence) {
            int found = 0;
            for (InsuredItem item : items) {
                if (item.type() == type) {
                    if (found == occurrence) {
                        return item;
                    }
                    found++;
                }
            }
            return null;
        }
    }
}
