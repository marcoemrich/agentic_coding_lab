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

/** Reads an MHPCO scenario as JSON from stdin and writes the results to stdout. */
public final class ClaimOfficeCli {

    private static final ObjectMapper JSON = new ObjectMapper();

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) throws IOException {
        String scenario = readAll(System.in);
        try {
            System.out.print(run(scenario));
        } catch (RuntimeException rejected) {
            System.err.println(rejected.getMessage());
            System.exit(1);
        }
    }

    static String run(String scenario) {
        JsonNode input = parse(scenario);
        ClaimOffice office = new ClaimOffice(customerOf(input.get("customer")));
        Map<Integer, Policy> policies = new HashMap<>();

        ArrayNode results = JSON.createArrayNode();
        JsonNode steps = input.get("steps");
        for (int index = 0; index < steps.size(); index++) {
            results.add(resultOf(office, policies, steps.get(index), index));
        }

        ObjectNode output = JSON.createObjectNode();
        output.set("results", results);
        return output.toString();
    }

    private static JsonNode parse(String scenario) {
        try {
            return JSON.readTree(scenario);
        } catch (IOException malformed) {
            throw new IllegalArgumentException("the scenario is not valid JSON", malformed);
        }
    }

    private static ObjectNode resultOf(ClaimOffice office, Map<Integer, Policy> policies,
            JsonNode step, int index) {
        ObjectNode result = JSON.createObjectNode();
        if ("quote".equals(step.get("op").asText())) {
            List<Item> items = itemsOf(step.get("items"));
            Policy policy = office.insure(items);
            policies.put(index, policy);
            result.put("premium", policy.premium());
        } else {
            Policy policy = policyOf(policies, step.get("policy").asInt());
            Settlement settlement = office.claim(policy, damagesOf(step.get("incident")));
            result.put("payout", settlement.payout());
            result.put("remainingCap", settlement.remainingCap());
        }
        return result;
    }

    private static Policy policyOf(Map<Integer, Policy> policies, int step) {
        Policy policy = policies.get(step);
        if (policy == null) {
            throw new IllegalArgumentException("no policy was created by step " + step);
        }
        return policy;
    }

    private static Customer customerOf(JsonNode customer) {
        return new Customer(customer.get("yearsWithMHPCO").asInt());
    }

    private static List<Item> itemsOf(JsonNode items) {
        List<Item> insured = new ArrayList<>();
        for (JsonNode item : items) {
            insured.add(new Item(
                    item.get("type").asText(),
                    item.path("material").asText(""),
                    item.path("enchantment").asInt(0),
                    item.path("cursed").asBoolean(false)));
        }
        return insured;
    }

    private static List<Damage> damagesOf(JsonNode incident) {
        List<Damage> damages = new ArrayList<>();
        for (JsonNode damage : incident.get("damages")) {
            damages.add(new Damage(damage.get("itemType").asText(), damage.get("amount").asInt()));
        }
        return damages;
    }

    private static String readAll(InputStream in) throws IOException {
        return new String(in.readAllBytes(), StandardCharsets.UTF_8);
    }
}
