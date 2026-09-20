import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * The MHPCO's counter clerk: reads a scenario as JSON from stdin, has the office
 * process its steps in order, and writes the results as JSON to stdout. Translation
 * only -- every decision about premiums, payouts and what the office refuses to
 * cover belongs to the office, not to the counter.
 */
public final class ClaimOfficeCli {

    private static final ObjectMapper JSON = new ObjectMapper();

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        try {
            String scenario = new String(System.in.readAllBytes(), StandardCharsets.UTF_8);
            System.out.print(run(scenario));
        } catch (RuntimeException | IOException rejected) {
            PrintStream stderr = new PrintStream(System.err, true, StandardCharsets.UTF_8);
            stderr.println(rejected.getMessage());
            System.exit(1);
        }
    }

    /** Processes one scenario document and returns the result document. */
    public static String run(String scenario) throws IOException {
        JsonNode document = JSON.readTree(scenario);
        ClaimOffice office = new ClaimOffice(customerOf(document.get("customer")));
        PoliciesByStep policies = new PoliciesByStep();

        ArrayNode results = JSON.createArrayNode();
        for (JsonNode step : document.get("steps")) {
            results.add(resultOf(step, office, policies));
        }

        ObjectNode resultDocument = JSON.createObjectNode();
        resultDocument.set("results", results);
        return JSON.writeValueAsString(resultDocument);
    }

    /** What the office reports for one step, whichever operation the step asks for. */
    private static ObjectNode resultOf(
            JsonNode step, ClaimOffice office, PoliciesByStep policies) {
        if (isQuote(step)) {
            return quoteResultOf(step, office, policies);
        }
        return claimResultOf(step, office, policies);
    }

    /**
     * A quote leaves behind the policy it wrote, so a later claim step can name it by
     * the step that created it.
     */
    private static ObjectNode quoteResultOf(
            JsonNode step, ClaimOffice office, PoliciesByStep policies) {
        Policy policy = office.insure(itemsOf(step.get("items")));
        policies.recordPolicyWritten(policy);

        ObjectNode result = JSON.createObjectNode();
        result.put("premium", policy.premium());
        return result;
    }

    /** A claim is settled against the policy its step names, and writes no policy itself. */
    private static ObjectNode claimResultOf(
            JsonNode step, ClaimOffice office, PoliciesByStep policies) {
        policies.recordStepWithoutPolicy();
        Settlement settlement = office.claim(
                policies.writtenByStep(step.get("policy").asInt()),
                incidentOf(step.get("incident")));

        ObjectNode result = JSON.createObjectNode();
        result.put("payout", settlement.payout());
        result.put("remainingCap", settlement.remainingCap());
        return result;
    }

    private static boolean isQuote(JsonNode step) {
        return "quote".equals(step.get("op").asText());
    }

    private static Customer customerOf(JsonNode customer) {
        return new Customer(customer.get("yearsWithMHPCO").asInt());
    }

    private static List<Item> itemsOf(JsonNode items) {
        List<Item> insured = new ArrayList<>();
        for (JsonNode item : items) {
            insured.add(new Item(
                    item.get("type").asText(),
                    item.path("material").asText(null),
                    item.path("enchantment").asInt(),
                    item.path("cursed").asBoolean()));
        }
        return insured;
    }

    private static Incident incidentOf(JsonNode incident) {
        List<Damage> damages = new ArrayList<>();
        for (JsonNode damage : incident.get("damages")) {
            damages.add(new Damage(
                    damage.get("itemType").asText(), damage.get("amount").asInt()));
        }
        return new Incident(incident.get("cause").asText(), damages);
    }
}
