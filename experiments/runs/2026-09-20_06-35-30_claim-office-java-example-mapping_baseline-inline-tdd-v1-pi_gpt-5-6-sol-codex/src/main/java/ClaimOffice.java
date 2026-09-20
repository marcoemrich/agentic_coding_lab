import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Executes MHPCO scenarios while retaining policy state between their steps. */
public final class ClaimOffice {
    private final Map<Integer, Policy> policies = new HashMap<>();
    private int quoteCount;

    public ObjectNode process(JsonNode scenario) {
        policies.clear();
        quoteCount = 0;
        ObjectNode input = requireObject(scenario, "scenario");
        ObjectNode customer = requireObject(input.get("customer"), "customer");
        int years = requireInteger(customer.get("yearsWithMHPCO"), "yearsWithMHPCO");
        ArrayNode steps = requireArray(input.get("steps"), "steps");
        ObjectNode output = com.fasterxml.jackson.databind.node.JsonNodeFactory.instance.objectNode();
        ArrayNode results = output.putArray("results");
        for (int index = 0; index < steps.size(); index++) {
            ObjectNode step = requireObject(steps.get(index), "step");
            String operation = requireText(step.get("op"), "op");
            if ("quote".equals(operation)) {
                results.add(quote(step, years, index));
            } else if ("claim".equals(operation)) {
                results.add(claim(step));
            } else {
                throw new IllegalArgumentException("Unknown operation: " + operation);
            }
        }
        return output;
    }

    private ObjectNode quote(ObjectNode step, int years, int stepIndex) {
        ArrayNode itemNodes = requireArray(step.get("items"), "items");
        List<Item> items = new ArrayList<>();
        Map<ItemType, Integer> counts = new HashMap<>();
        for (JsonNode itemNode : itemNodes) {
            Item item = Item.from(requireObject(itemNode, "item"));
            items.add(item);
            counts.merge(item.type(), 1, Integer::sum);
        }

        long hundredths = 0;
        int insuranceSum = 0;
        for (Item item : items) {
            int base = effectiveBase(item.type(), counts.get(item.type()));
            hundredths += base * 100L;
            if (item.cursed()) {
                hundredths += base * 50L;
            }
            if (item.enchantment() >= 5) {
                hundredths += base * 30L;
            }
            insuranceSum += item.type().insuranceValue;
        }
        int policyBase = items.stream()
            .mapToInt(item -> effectiveBase(item.type(), counts.get(item.type())))
            .sum();
        if (years >= 2) {
            hundredths -= policyBase * 20L;
        }
        hundredths += policyBase * 10L;
        if (quoteCount > 0) {
            hundredths -= policyBase * 15L;
        }
        int premium = ceilHundredths(hundredths + 500L);
        policies.put(stepIndex, new Policy(items, insuranceSum * 2));
        quoteCount++;
        ObjectNode result = com.fasterxml.jackson.databind.node.JsonNodeFactory.instance.objectNode();
        result.put("premium", premium);
        return result;
    }

    private ObjectNode claim(ObjectNode step) {
        int policyIndex = requireInteger(step.get("policy"), "policy");
        Policy policy = policies.get(policyIndex);
        if (policy == null) {
            throw new IllegalArgumentException("Policy does not refer to an earlier quote: " + policyIndex);
        }
        ObjectNode incident = requireObject(step.get("incident"), "incident");
        requireText(incident.get("cause"), "cause");
        ArrayNode damages = requireArray(incident.get("damages"), "damages");
        Map<ItemType, Integer> usedByType = new HashMap<>();
        long payoutHalves = 0;
        for (JsonNode damageNode : damages) {
            ObjectNode damage = requireObject(damageNode, "damage");
            ItemType type = ItemType.from(requireText(damage.get("itemType"), "itemType"));
            int amount = requireInteger(damage.get("amount"), "amount");
            if (amount < 0) {
                throw new IllegalArgumentException("Damage amount cannot be negative");
            }
            int occurrence = usedByType.getOrDefault(type, 0);
            Item item = policy.item(type, occurrence);
            usedByType.put(type, occurrence + 1);
            long reimbursedHalves = item.enchantment() >= 8 ? amount : amount * 2L;
            payoutHalves += Math.max(0L, reimbursedHalves - 200L);
        }
        int wanted = (int) (payoutHalves / 2L);
        int payout = Math.min(wanted, policy.remainingCap);
        policy.remainingCap -= payout;
        ObjectNode result = com.fasterxml.jackson.databind.node.JsonNodeFactory.instance.objectNode();
        result.put("payout", payout);
        result.put("remainingCap", policy.remainingCap);
        return result;
    }

    private static int effectiveBase(ItemType type, int count) {
        return type.component && count == 3 ? 20 : type.basePremium;
    }

    private static int ceilHundredths(long amount) {
        return Math.toIntExact(Math.floorDiv(amount + 99L, 100L));
    }

    private static ObjectNode requireObject(JsonNode value, String name) {
        if (value == null || !value.isObject()) {
            throw new IllegalArgumentException(name + " must be an object");
        }
        return (ObjectNode) value;
    }

    private static ArrayNode requireArray(JsonNode value, String name) {
        if (value == null || !value.isArray()) {
            throw new IllegalArgumentException(name + " must be an array");
        }
        return (ArrayNode) value;
    }

    private static String requireText(JsonNode value, String name) {
        if (value == null || !value.isTextual()) {
            throw new IllegalArgumentException(name + " must be a string");
        }
        return value.textValue();
    }

    private static int requireInteger(JsonNode value, String name) {
        if (value == null || !value.isIntegralNumber() || !value.canConvertToInt()) {
            throw new IllegalArgumentException(name + " must be an integer");
        }
        return value.intValue();
    }

    private enum ItemType {
        SWORD("sword", 1000, 100, false),
        AMULET("amulet", 600, 60, false),
        STAFF("staff", 800, 80, false),
        POTION("potion", 400, 40, false),
        RUNE("rune", 250, 25, true),
        MOONSTONE("moonstone", 250, 25, true);

        private final String jsonName;
        private final int insuranceValue;
        private final int basePremium;
        private final boolean component;

        ItemType(String jsonName, int insuranceValue, int basePremium, boolean component) {
            this.jsonName = jsonName;
            this.insuranceValue = insuranceValue;
            this.basePremium = basePremium;
            this.component = component;
        }

        private static ItemType from(String value) {
            for (ItemType type : values()) {
                if (type.jsonName.equals(value)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown item type: " + value);
        }
    }

    private record Item(ItemType type, String material, int enchantment, boolean cursed) {
        private static Item from(ObjectNode node) {
            ItemType type = ItemType.from(requireText(node.get("type"), "type"));
            JsonNode materialNode = node.get("material");
            JsonNode enchantmentNode = node.get("enchantment");
            JsonNode cursedNode = node.get("cursed");
            String material = materialNode == null ? "" : requireText(materialNode, "material");
            int enchantment = enchantmentNode == null ? 0 : requireInteger(enchantmentNode, "enchantment");
            if (cursedNode != null && !cursedNode.isBoolean()) {
                throw new IllegalArgumentException("cursed must be a boolean");
            }
            boolean cursed = cursedNode != null && cursedNode.booleanValue();
            return new Item(type, material, enchantment, cursed);
        }
    }

    private static final class Policy {
        private final List<Item> items;
        private int remainingCap;

        private Policy(List<Item> items, int remainingCap) {
            this.items = List.copyOf(items);
            this.remainingCap = remainingCap;
        }

        private Item item(ItemType type, int occurrence) {
            int seen = 0;
            for (Item item : items) {
                if (item.type() == type) {
                    if (seen == occurrence) {
                        return item;
                    }
                    seen++;
                }
            }
            throw new IllegalArgumentException("Damage item is not covered or occurs too often: " + type.jsonName);
        }
    }
}
