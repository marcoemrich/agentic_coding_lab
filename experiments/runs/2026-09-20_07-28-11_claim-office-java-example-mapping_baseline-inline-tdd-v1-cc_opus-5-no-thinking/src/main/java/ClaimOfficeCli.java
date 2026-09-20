import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Reads a scenario as JSON from stdin and writes the results as JSON to stdout. */
public final class ClaimOfficeCli {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        try (InputStream in = System.in) {
            String input = new String(in.readAllBytes(), StandardCharsets.UTF_8);
            System.out.println(process(input));
        } catch (ClaimOfficeException e) {
            System.err.println(e.getMessage());
            System.exit(1);
        } catch (IOException | RuntimeException e) {
            System.err.println("invalid scenario: " + e.getMessage());
            System.exit(1);
        }
    }

    /** Processes a scenario document and returns the result document. */
    public static String process(String input) {
        JsonNode scenario = readJson(input);
        Customer customer = new Customer(scenario.path("customer").path("yearsWithMHPCO").asInt());

        Map<Integer, InsurancePolicy> policies = new HashMap<>();
        ArrayNode results = MAPPER.createArrayNode();
        int contractNumber = 0;

        JsonNode steps = scenario.path("steps");
        for (int index = 0; index < steps.size(); index++) {
            JsonNode step = steps.get(index);
            String op = step.path("op").asText();
            if ("quote".equals(op)) {
                contractNumber++;
                results.add(quote(customer, contractNumber, step, index, policies));
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

    private static ObjectNode quote(Customer customer, int contractNumber, JsonNode step, int index,
            Map<Integer, InsurancePolicy> policies) {
        List<Item> items = items(step.path("items"));
        policies.put(index, new InsurancePolicy(items));

        ObjectNode result = MAPPER.createObjectNode();
        result.put("premium", Quote.premium(customer, contractNumber, items));
        return result;
    }

    private static ObjectNode claim(JsonNode step, Map<Integer, InsurancePolicy> policies) {
        InsurancePolicy policy = policies.get(step.path("policy").asInt());
        if (policy == null) {
            throw new ClaimOfficeException("claim refers to a step that created no policy");
        }

        List<Damage> damages = new ArrayList<>();
        for (JsonNode node : step.path("incident").path("damages")) {
            damages.add(new Damage(node.path("itemType").asText(), node.path("amount").asInt()));
        }

        ObjectNode result = MAPPER.createObjectNode();
        result.put("payout", policy.claim(damages));
        result.put("remainingCap", policy.remainingCap().intValueExact());
        return result;
    }

    private static List<Item> items(JsonNode nodes) {
        List<Item> items = new ArrayList<>();
        for (JsonNode node : nodes) {
            String type = node.path("type").asText();
            if (!PriceList.isKnown(type)) {
                throw new ClaimOfficeException("unknown item type: " + type);
            }
            items.add(new Item(type, node.path("material").asText(null),
                    node.path("enchantment").asInt(), node.path("cursed").asBoolean()));
        }
        return items;
    }

    private static JsonNode readJson(String input) {
        try {
            return MAPPER.readTree(input);
        } catch (IOException e) {
            throw new ClaimOfficeException("malformed JSON input: " + e.getMessage());
        }
    }
}
