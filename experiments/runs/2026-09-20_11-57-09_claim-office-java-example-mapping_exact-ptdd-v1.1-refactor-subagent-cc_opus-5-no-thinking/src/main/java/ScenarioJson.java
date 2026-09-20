import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.ArrayList;
import java.util.List;

/**
 * Translates between the scenario document the office is sent and the office's own terms.
 *
 * This is the office's correspondence clerk: it reads a scenario written in JSON and writes
 * the results back in the same form. No rule of the office lives here -- only the wording.
 */
public class ScenarioJson {

    private final ObjectMapper mapper = new ObjectMapper();

    public Scenario readScenario(String document) {
        JsonNode root = readTree(document);
        List<Step> steps = new ArrayList<>();
        for (JsonNode step : root.path("steps")) {
            steps.add(readStep(step));
        }
        return new Scenario(new Customer(root.path("customer").path("yearsWithMHPCO").asInt()), steps);
    }

    public String writeResults(List<StepResult> results) {
        ObjectNode root = mapper.createObjectNode();
        ArrayNode written = root.putArray("results");
        for (StepResult result : results) {
            written.add(writeResult(result));
        }
        return root.toString();
    }

    private JsonNode readTree(String document) {
        try {
            return mapper.readTree(document);
        } catch (com.fasterxml.jackson.core.JsonProcessingException malformed) {
            throw new ClaimOfficeException("The scenario could not be read: " + malformed.getOriginalMessage());
        }
    }

    private Step readStep(JsonNode step) {
        if ("claim".equals(step.path("op").asText())) {
            return new ClaimStep(step.path("policy").asInt(), readIncident(step.path("incident")));
        }
        List<Item> items = new ArrayList<>();
        for (JsonNode item : step.path("items")) {
            items.add(readItem(item));
        }
        return new QuoteStep(items);
    }

    private Item readItem(JsonNode item) {
        return new Item(item.path("type").asText(),
                item.path("material").asText(null),
                item.path("enchantment").asInt(),
                item.path("cursed").asBoolean());
    }

    private Incident readIncident(JsonNode incident) {
        List<Damage> damages = new ArrayList<>();
        for (JsonNode damage : incident.path("damages")) {
            damages.add(new Damage(damage.path("itemType").asText(), damage.path("amount").asInt()));
        }
        return new Incident(incident.path("cause").asText(), damages);
    }

    private ObjectNode writeResult(StepResult result) {
        ObjectNode written = mapper.createObjectNode();
        if (result instanceof QuoteResult quoteResult) {
            written.put("premium", quoteResult.premium());
        } else {
            ClaimResult claimResult = (ClaimResult) result;
            written.put("payout", claimResult.payout());
            written.put("remainingCap", claimResult.remainingCap());
        }
        return written;
    }
}
