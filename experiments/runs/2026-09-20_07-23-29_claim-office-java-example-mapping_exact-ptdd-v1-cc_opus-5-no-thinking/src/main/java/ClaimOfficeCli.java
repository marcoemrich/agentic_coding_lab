import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.InputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;

/** Reads a scenario as JSON from stdin and writes the MHPCO's results to stdout. */
public final class ClaimOfficeCli {

    private static final ObjectMapper JSON = new ObjectMapper();

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        System.exit(run(System.in, System.out, System.err));
    }

    public static int run(InputStream in, PrintStream out, PrintStream err) {
        try {
            out.println(JSON.writeValueAsString(resultsFor(JSON.readTree(in))));
            return 0;
        } catch (Exception e) {
            err.println(e.getMessage());
            return 1;
        }
    }

    private static ObjectNode resultsFor(JsonNode scenario) {
        ClaimOffice office = new ClaimOffice(
                scenario.get("customer").get("yearsWithMHPCO").asInt());
        ObjectNode output = JSON.createObjectNode();
        ArrayNode results = output.putArray("results");
        for (JsonNode step : scenario.get("steps")) {
            results.add(resultFor(office, step));
        }
        return output;
    }

    private static ObjectNode resultFor(ClaimOffice office, JsonNode step) {
        ObjectNode result = JSON.createObjectNode();
        if ("quote".equals(step.get("op").asText())) {
            result.put("premium", office.quote(itemsOf(step.get("items"))));
        } else {
            ClaimResult claim = office.claim(step.get("policy").asInt(),
                    incidentOf(step.get("incident")));
            result.put("payout", claim.payout());
            result.put("remainingCap", claim.remainingCap());
        }
        return result;
    }

    private static List<Item> itemsOf(JsonNode itemsNode) {
        List<Item> items = new ArrayList<>();
        for (JsonNode item : itemsNode) {
            items.add(new Item(
                    item.get("type").asText(),
                    item.path("material").asText(null),
                    item.path("enchantment").asInt(),
                    item.path("cursed").asBoolean()));
        }
        return items;
    }

    private static Incident incidentOf(JsonNode incidentNode) {
        List<Damage> damages = new ArrayList<>();
        for (JsonNode damage : incidentNode.get("damages")) {
            damages.add(new Damage(damage.get("itemType").asText(), damage.get("amount").asInt()));
        }
        return new Incident(incidentNode.get("cause").asText(), damages);
    }
}
