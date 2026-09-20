import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Runs a scenario: parses the stdin document, processes the steps, renders the results. */
final class Scenario {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private Scenario() {
    }

    static String run(String input) {
        JsonNode root = parse(input);
        Customer customer = new Customer(root.path("customer").path("yearsWithMHPCO").asInt());
        Map<Integer, Policy> policies = new HashMap<>();
        ArrayNode results = MAPPER.createArrayNode();
        int quotesSoFar = 0;

        JsonNode steps = root.path("steps");
        for (int index = 0; index < steps.size(); index++) {
            JsonNode step = steps.get(index);
            String op = step.path("op").asText();
            if ("quote".equals(op)) {
                List<Item> items = readItems(step.path("items"));
                results.add(MAPPER.createObjectNode()
                        .put("premium", Premium.quote(customer, quotesSoFar, items)));
                policies.put(index, new Policy(items));
                quotesSoFar++;
            } else if ("claim".equals(op)) {
                results.add(settle(step, policies));
            } else {
                throw new ClaimOfficeException("unknown operation: " + op);
            }
        }
        ObjectNode output = MAPPER.createObjectNode();
        output.set("results", results);
        return output.toString();
    }

    private static ObjectNode settle(JsonNode step, Map<Integer, Policy> policies) {
        int policyIndex = step.path("policy").asInt(-1);
        Policy policy = policies.get(policyIndex);
        if (policy == null) {
            throw new ClaimOfficeException("no policy created by step " + policyIndex);
        }
        List<Damage> damages = new ArrayList<>();
        for (JsonNode damage : step.path("incident").path("damages")) {
            damages.add(new Damage(damage.path("itemType").asText(), damage.path("amount").asInt()));
        }
        int payout = policy.settle(damages);
        return MAPPER.createObjectNode()
                .put("payout", payout)
                .put("remainingCap", policy.remainingCap());
    }

    private static List<Item> readItems(JsonNode itemsNode) {
        List<Item> items = new ArrayList<>();
        for (JsonNode item : itemsNode) {
            String type = item.path("type").asText();
            PriceList.basePremium(type);
            items.add(new Item(
                    type,
                    item.hasNonNull("material") ? item.get("material").asText() : null,
                    item.path("enchantment").asInt(),
                    item.path("cursed").asBoolean()));
        }
        return items;
    }

    private static JsonNode parse(String input) {
        try {
            return MAPPER.readTree(input);
        } catch (IOException e) {
            throw new ClaimOfficeException("malformed scenario: " + e.getMessage());
        }
    }
}
