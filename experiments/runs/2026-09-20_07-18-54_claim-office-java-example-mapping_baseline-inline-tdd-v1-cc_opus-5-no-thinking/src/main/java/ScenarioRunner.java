import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Runs a scenario: parses the JSON input, processes the steps in order against a single customer,
 * and renders the results as JSON.
 */
public final class ScenarioRunner {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private ScenarioRunner() {
    }

    public static String run(String input) {
        JsonNode scenario = parse(input);
        Customer customer = customerOf(scenario);
        Map<Integer, Policy> policies = new HashMap<>();
        int contractsSoFar = 0;

        ArrayNode results = MAPPER.createArrayNode();
        List<JsonNode> steps = stepsOf(scenario);
        for (int index = 0; index < steps.size(); index++) {
            JsonNode step = steps.get(index);
            String op = step.path("op").asText();
            if ("quote".equals(op)) {
                results.add(quote(customer, contractsSoFar, step, index, policies));
                contractsSoFar++;
            } else if ("claim".equals(op)) {
                results.add(claim(step, policies));
            } else {
                throw new ClaimOfficeException("unknown operation: " + op);
            }
        }

        ObjectNode output = MAPPER.createObjectNode();
        output.set("results", results);
        return output.toString();
    }

    private static ObjectNode quote(
            Customer customer,
            int previousContracts,
            JsonNode step,
            int stepIndex,
            Map<Integer, Policy> policies) {
        List<Item> items = itemsOf(step);
        policies.put(stepIndex, new Policy(items));
        ObjectNode result = MAPPER.createObjectNode();
        result.put("premium", PremiumCalculator.premium(customer, previousContracts, items));
        return result;
    }

    private static ObjectNode claim(JsonNode step, Map<Integer, Policy> policies) {
        JsonNode policyIndex = step.path("policy");
        Policy policy = policies.get(policyIndex.asInt(-1));
        if (!policyIndex.isInt() || policy == null) {
            throw new ClaimOfficeException("claim refers to an unknown policy: " + policyIndex);
        }
        ClaimResult settled = policy.settle(incidentOf(step.path("incident")));
        ObjectNode result = MAPPER.createObjectNode();
        result.put("payout", settled.payout());
        result.put("remainingCap", settled.remainingCap());
        return result;
    }

    private static Customer customerOf(JsonNode scenario) {
        JsonNode years = scenario.path("customer").path("yearsWithMHPCO");
        if (!years.isInt()) {
            throw new ClaimOfficeException("customer.yearsWithMHPCO must be an integer");
        }
        return new Customer(years.intValue());
    }

    private static List<JsonNode> stepsOf(JsonNode scenario) {
        JsonNode steps = scenario.path("steps");
        if (!steps.isArray()) {
            throw new ClaimOfficeException("steps must be an array");
        }
        List<JsonNode> list = new ArrayList<>();
        steps.forEach(list::add);
        return list;
    }

    private static List<Item> itemsOf(JsonNode step) {
        JsonNode items = step.path("items");
        if (!items.isArray()) {
            throw new ClaimOfficeException("quote step requires an items array");
        }
        List<Item> parsed = new ArrayList<>();
        items.forEach(item -> parsed.add(itemOf(item)));
        return parsed;
    }

    private static Item itemOf(JsonNode item) {
        JsonNode enchantment = item.path("enchantment");
        return new Item(
                item.path("type").asText(),
                item.path("material").isTextual() ? item.path("material").asText() : null,
                enchantment.isInt() ? enchantment.intValue() : null,
                item.path("cursed").asBoolean(false));
    }

    private static Incident incidentOf(JsonNode incident) {
        JsonNode damages = incident.path("damages");
        if (!damages.isArray()) {
            throw new ClaimOfficeException("claim step requires an incident with damages");
        }
        List<Damage> parsed = new ArrayList<>();
        damages.forEach(damage -> parsed.add(damageOf(damage)));
        return new Incident(incident.path("cause").asText(), parsed);
    }

    private static Damage damageOf(JsonNode damage) {
        JsonNode amount = damage.path("amount");
        if (!amount.isInt()) {
            throw new ClaimOfficeException("damage requires an integer amount");
        }
        return new Damage(damage.path("itemType").asText(), amount.intValue());
    }

    private static JsonNode parse(String input) {
        try {
            return MAPPER.readTree(input);
        } catch (IOException e) {
            throw new ClaimOfficeException("malformed scenario JSON: " + e.getMessage());
        }
    }
}
