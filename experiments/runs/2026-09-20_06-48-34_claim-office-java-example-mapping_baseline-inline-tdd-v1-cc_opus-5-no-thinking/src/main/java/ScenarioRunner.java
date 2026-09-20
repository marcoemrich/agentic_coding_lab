import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Processes the steps of a scenario in order and collects one result per step. */
public class ScenarioRunner {

    private final PremiumCalculator premiumCalculator = new PremiumCalculator();
    private final Map<Integer, Policy> policies = new HashMap<>();

    public ObjectNode run(JsonNode scenario) {
        Customer customer = new Customer(required(scenario, "customer").path("yearsWithMHPCO").asInt());
        ArrayNode results = JsonNodeFactory.instance.arrayNode();
        JsonNode steps = required(scenario, "steps");
        int contractsSoFar = 0;
        for (int index = 0; index < steps.size(); index++) {
            JsonNode step = steps.get(index);
            String op = step.path("op").asText();
            if ("quote".equals(op)) {
                results.add(quote(step, customer, contractsSoFar++, index));
            } else if ("claim".equals(op)) {
                results.add(claim(step));
            } else {
                throw new ClaimOfficeException("unknown operation: " + op);
            }
        }
        ObjectNode output = JsonNodeFactory.instance.objectNode();
        output.set("results", results);
        return output;
    }

    private ObjectNode quote(JsonNode step, Customer customer, int previousContracts, int stepIndex) {
        List<Item> items = items(step.path("items"));
        int premium = premiumCalculator.quote(items, customer, previousContracts);
        policies.put(stepIndex, new Policy(items));
        return JsonNodeFactory.instance.objectNode().put("premium", premium);
    }

    private ObjectNode claim(JsonNode step) {
        int policyIndex = required(step, "policy").asInt();
        Policy policy = policies.get(policyIndex);
        if (policy == null) {
            throw new ClaimOfficeException("no policy created by step " + policyIndex);
        }
        List<Damage> damages = new ArrayList<>();
        for (JsonNode damage : required(step, "incident").path("damages")) {
            damages.add(new Damage(required(damage, "itemType").asText(), required(damage, "amount").asInt()));
        }
        ClaimResult result = policy.claim(damages);
        return JsonNodeFactory.instance.objectNode()
                .put("payout", result.payout())
                .put("remainingCap", result.remainingCap());
    }

    private List<Item> items(JsonNode itemNodes) {
        List<Item> items = new ArrayList<>();
        for (JsonNode node : itemNodes) {
            String type = required(node, "type").asText();
            if (!PriceList.isKnown(type)) {
                throw new ClaimOfficeException("unknown item type: " + type);
            }
            items.add(new Item(type, node.path("material").asText(null),
                    node.path("enchantment").asInt(), node.path("cursed").asBoolean()));
        }
        return items;
    }

    private static JsonNode required(JsonNode node, String field) {
        JsonNode value = node.get(field);
        if (value == null || value.isNull()) {
            throw new ClaimOfficeException("missing required field: " + field);
        }
        return value;
    }
}
