import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Command-line adapter for the MHPCO claim office. */
public final class ClaimOfficeCli {
    private static final ObjectMapper JSON = new ObjectMapper();

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        int status = run(System.in, System.out, System.err);
        if (status != 0) {
            System.exit(status);
        }
    }

    /** Runs one scenario, returning a process-style status code. */
    static int run(InputStream input, OutputStream output, OutputStream error) {
        try {
            JsonNode scenario = JSON.readTree(input);
            ObjectNode response = new Processor(scenario).process();
            JSON.writeValue(output, response);
            return 0;
        } catch (Exception exception) {
            PrintStream errors = new PrintStream(error);
            String message = exception.getMessage();
            errors.println("Invalid scenario: " + (message == null ? "unable to process input" : message));
            return 1;
        }
    }

    private static final class Processor {
        private final JsonNode scenario;
        private final Map<Integer, Policy> policies = new HashMap<>();
        private long yearsWithMhpco;
        private int quotes;

        private Processor(JsonNode scenario) {
            this.scenario = scenario;
        }

        private ObjectNode process() {
            requireObject(scenario, "scenario");
            JsonNode customer = required(scenario, "customer");
            requireObject(customer, "customer");
            yearsWithMhpco = integer(required(customer, "yearsWithMHPCO"), "yearsWithMHPCO");
            JsonNode steps = required(scenario, "steps");
            requireArray(steps, "steps");

            ArrayNode results = JSON.createArrayNode();
            for (int index = 0; index < steps.size(); index++) {
                JsonNode step = steps.get(index);
                requireObject(step, "step " + index);
                String operation = text(required(step, "op"), "op");
                if ("quote".equals(operation)) {
                    results.add(quote(step, index));
                } else if ("claim".equals(operation)) {
                    results.add(claim(step, index));
                } else {
                    throw invalid("unknown operation: " + operation);
                }
            }
            ObjectNode response = JSON.createObjectNode();
            response.set("results", results);
            return response;
        }

        private ObjectNode quote(JsonNode step, int stepIndex) {
            JsonNode itemNodes = required(step, "items");
            requireArray(itemNodes, "items");
            List<Item> items = new ArrayList<>();
            Map<String, Integer> componentCounts = new HashMap<>();
            for (JsonNode itemNode : itemNodes) {
                Item item = parseItem(itemNode);
                items.add(item);
                if (item.kind.component) {
                    componentCounts.merge(item.kind.jsonName, 1, Integer::sum);
                }
            }

            BigDecimal base = BigDecimal.ZERO;
            BigDecimal itemSurcharges = BigDecimal.ZERO;
            for (Item item : items) {
                BigDecimal itemBase = item.basePremium(componentCounts);
                base = base.add(itemBase);
                if (item.cursed) {
                    itemSurcharges = itemSurcharges.add(percent(itemBase, 50));
                }
                if (!item.kind.component && item.enchantment >= 5) {
                    itemSurcharges = itemSurcharges.add(percent(itemBase, 30));
                }
            }

            BigDecimal premium = base.add(itemSurcharges).add(percent(base, 10));
            if (yearsWithMhpco >= 2) {
                premium = premium.subtract(percent(base, 20));
            }
            if (quotes > 0) {
                premium = premium.subtract(percent(base, 15));
            }
            premium = premium.add(BigDecimal.valueOf(5));
            long roundedPremium = premium.setScale(0, RoundingMode.CEILING).longValueExact();

            Policy policy = new Policy(items);
            policies.put(stepIndex, policy);
            quotes++;
            ObjectNode result = JSON.createObjectNode();
            result.put("premium", roundedPremium);
            return result;
        }

        private ObjectNode claim(JsonNode step, int stepIndex) {
            long policyReference = integer(required(step, "policy"), "policy");
            if (policyReference < 0 || policyReference >= stepIndex || policyReference > Integer.MAX_VALUE) {
                throw invalid("policy must refer to an earlier quote step");
            }
            Policy policy = policies.get((int) policyReference);
            if (policy == null) {
                throw invalid("policy does not refer to a quote step");
            }
            JsonNode incident = required(step, "incident");
            requireObject(incident, "incident");
            text(required(incident, "cause"), "cause");
            JsonNode damages = required(incident, "damages");
            requireArray(damages, "damages");

            Map<String, Integer> usedByType = new HashMap<>();
            BigDecimal desired = BigDecimal.ZERO;
            for (JsonNode damage : damages) {
                requireObject(damage, "damage");
                String itemType = text(required(damage, "itemType"), "itemType");
                ItemKind.fromJson(itemType);
                long amount = integer(required(damage, "amount"), "amount");
                if (amount < 0) {
                    throw invalid("damage amount must not be negative");
                }
                int occurrence = usedByType.getOrDefault(itemType, 0);
                Item item = policy.item(itemType, occurrence);
                usedByType.put(itemType, occurrence + 1);
                BigDecimal reimbursement = BigDecimal.valueOf(amount);
                if (!item.kind.component && item.enchantment >= 8) {
                    reimbursement = percent(reimbursement, 50);
                }
                reimbursement = reimbursement.subtract(BigDecimal.valueOf(100));
                if (reimbursement.signum() > 0) {
                    desired = desired.add(reimbursement);
                }
            }

            long roundedDesired = desired.setScale(0, RoundingMode.FLOOR).longValueExact();
            long payout = Math.min(roundedDesired, policy.remainingCap);
            policy.remainingCap -= payout;
            ObjectNode result = JSON.createObjectNode();
            result.put("payout", payout);
            result.put("remainingCap", policy.remainingCap);
            return result;
        }

        private static Item parseItem(JsonNode node) {
            requireObject(node, "item");
            ItemKind kind = ItemKind.fromJson(text(required(node, "type"), "type"));
            String material = optionalText(node, "material", "");
            long enchantment = optionalInteger(node, "enchantment", 0);
            boolean cursed = optionalBoolean(node, "cursed", false);
            return new Item(kind, material, enchantment, cursed);
        }
    }

    private static final class Policy {
        private final Map<String, List<Item>> itemsByType = new HashMap<>();
        private long remainingCap;

        private Policy(List<Item> items) {
            long insuranceSum = 0;
            for (Item item : items) {
                itemsByType.computeIfAbsent(item.kind.jsonName, ignored -> new ArrayList<>()).add(item);
                insuranceSum = Math.addExact(insuranceSum, item.kind.insuranceValue);
            }
            remainingCap = Math.multiplyExact(insuranceSum, 2);
        }

        private Item item(String type, int occurrence) {
            List<Item> matching = itemsByType.get(type);
            if (matching == null || occurrence >= matching.size()) {
                throw invalid("damage item is not covered by the policy: " + type);
            }
            return matching.get(occurrence);
        }
    }

    private record Item(ItemKind kind, String material, long enchantment, boolean cursed) {
        private BigDecimal basePremium(Map<String, Integer> componentCounts) {
            if (kind.component && componentCounts.getOrDefault(kind.jsonName, 0) == 3) {
                return BigDecimal.valueOf(20);
            }
            return BigDecimal.valueOf(kind.basePremium);
        }
    }

    private enum ItemKind {
        SWORD("sword", 1000, 100, false),
        AMULET("amulet", 600, 60, false),
        STAFF("staff", 800, 80, false),
        POTION("potion", 400, 40, false),
        RUNE("rune", 250, 25, true),
        MOONSTONE("moonstone", 250, 25, true);

        private final String jsonName;
        private final long insuranceValue;
        private final long basePremium;
        private final boolean component;

        ItemKind(String jsonName, long insuranceValue, long basePremium, boolean component) {
            this.jsonName = jsonName;
            this.insuranceValue = insuranceValue;
            this.basePremium = basePremium;
            this.component = component;
        }

        private static ItemKind fromJson(String name) {
            for (ItemKind kind : values()) {
                if (kind.jsonName.equals(name)) {
                    return kind;
                }
            }
            throw invalid("unknown item type: " + name);
        }
    }

    private static BigDecimal percent(BigDecimal value, int percentage) {
        return value.multiply(BigDecimal.valueOf(percentage)).movePointLeft(2);
    }

    private static JsonNode required(JsonNode parent, String field) {
        JsonNode value = parent.get(field);
        if (value == null || value.isNull()) {
            throw invalid("missing field: " + field);
        }
        return value;
    }

    private static void requireObject(JsonNode node, String name) {
        if (node == null || !node.isObject()) {
            throw invalid(name + " must be an object");
        }
    }

    private static void requireArray(JsonNode node, String name) {
        if (!node.isArray()) {
            throw invalid(name + " must be an array");
        }
    }

    private static String text(JsonNode node, String name) {
        if (!node.isTextual()) {
            throw invalid(name + " must be a string");
        }
        return node.textValue();
    }

    private static long integer(JsonNode node, String name) {
        if (!node.isIntegralNumber() || !node.canConvertToLong()) {
            throw invalid(name + " must be an integer");
        }
        return node.longValue();
    }

    private static String optionalText(JsonNode parent, String field, String fallback) {
        JsonNode value = parent.get(field);
        return value == null ? fallback : text(value, field);
    }

    private static long optionalInteger(JsonNode parent, String field, long fallback) {
        JsonNode value = parent.get(field);
        return value == null ? fallback : integer(value, field);
    }

    private static boolean optionalBoolean(JsonNode parent, String field, boolean fallback) {
        JsonNode value = parent.get(field);
        if (value == null) {
            return fallback;
        }
        if (!value.isBoolean()) {
            throw invalid(field + " must be a boolean");
        }
        return value.booleanValue();
    }

    private static IllegalArgumentException invalid(String message) {
        return new IllegalArgumentException(message);
    }
}
