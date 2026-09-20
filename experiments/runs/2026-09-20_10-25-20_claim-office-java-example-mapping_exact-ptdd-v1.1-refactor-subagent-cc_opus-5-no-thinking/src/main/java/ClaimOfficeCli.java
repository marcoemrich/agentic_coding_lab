import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * The MHPCO's command-line counter: it reads a scenario from stdin and writes
 * the results of its steps to stdout.
 *
 * This is the office's adapter to the outside world, not a place where it
 * decides anything: it translates a scenario into the office's own terms,
 * asks the office, and translates the answers back.
 */
public final class ClaimOfficeCli {

    private static final ObjectMapper JSON = new ObjectMapper();

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) throws IOException {
        JsonNode scenario = JSON.readTree(System.in.readAllBytes());
        System.out.write(JSON.writeValueAsBytes(resultsOf(scenario)));
        System.out.flush();
    }

    private static ObjectNode resultsOf(JsonNode scenario) {
        ClaimOffice office = new ClaimOffice(customerOf(scenario.get("customer")));
        ObjectNode output = JSON.createObjectNode();
        ArrayNode results = output.putArray("results");
        Policy[] policies = new Policy[scenario.get("steps").size()];
        int stepIndex = 0;
        for (JsonNode step : scenario.get("steps")) {
            if ("quote".equals(step.get("op").asText())) {
                policies[stepIndex] = quoteResult(office, step, results);
            } else {
                claimResult(policies[step.get("policy").asInt()], step, results);
            }
            stepIndex++;
        }
        return output;
    }

    private static Policy quoteResult(ClaimOffice office, JsonNode step, ArrayNode results) {
        java.util.List<Item> items = itemsOf(step.get("items"));
        results.addObject().put("premium", office.quote(items));
        return office.insure(items);
    }

    private static void claimResult(Policy policy, JsonNode step, ArrayNode results) {
        Claim claim = policy.claim(incidentOf(step.get("incident")));
        results.addObject()
                .put("payout", claim.payout())
                .put("remainingCap", claim.remainingCap());
    }

    private static Customer customerOf(JsonNode customer) {
        return new Customer(customer.get("yearsWithMHPCO").asInt());
    }

    private static java.util.List<Item> itemsOf(JsonNode items) {
        java.util.List<Item> parsed = new java.util.ArrayList<>();
        for (JsonNode item : items) {
            parsed.add(new Item(
                    item.get("type").asText(),
                    item.path("material").asText(null),
                    item.path("enchantment").asInt(),
                    item.path("cursed").asBoolean()));
        }
        return parsed;
    }

    private static Incident incidentOf(JsonNode incident) {
        java.util.List<Damage> damages = new java.util.ArrayList<>();
        for (JsonNode damage : incident.get("damages")) {
            damages.add(new Damage(damage.get("itemType").asText(), damage.get("amount").asInt()));
        }
        return new Incident(incident.get("cause").asText(), damages);
    }
}
