import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/** Reads a scenario as JSON from stdin and writes its results as JSON to stdout. */
public final class ClaimOfficeCli {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        try (InputStream in = System.in) {
            System.out.println(run(new String(in.readAllBytes(), StandardCharsets.UTF_8)));
        } catch (ScenarioException | IOException e) {
            System.err.println(e.getMessage());
            System.exit(1);
        }
    }

    /** Processes a whole scenario document and returns the results document. */
    public static String run(String stdin) {
        JsonNode scenario = parse(stdin);
        ClaimOffice office = new ClaimOffice(customerOf(scenario));

        ArrayNode results = MAPPER.createArrayNode();
        for (JsonNode step : scenario.path("steps")) {
            results.add(process(office, step));
        }

        ObjectNode document = MAPPER.createObjectNode();
        document.set("results", results);
        return document.toString();
    }

    private static ObjectNode process(ClaimOffice office, JsonNode step) {
        ObjectNode result = MAPPER.createObjectNode();
        String op = step.path("op").asText();
        if ("quote".equals(op)) {
            result.put("premium", office.quote(itemsOf(step)).premium());
        } else if ("claim".equals(op)) {
            JsonNode incident = step.path("incident");
            Claim claim = office.claim(step.path("policy").asInt(-1), damagesOf(incident));
            result.put("payout", claim.payout());
            result.put("remainingCap", claim.remainingCap());
        } else {
            throw new ScenarioException("unknown operation: " + op);
        }
        return result;
    }

    private static Customer customerOf(JsonNode scenario) {
        return new Customer(scenario.path("customer").path("yearsWithMHPCO").asInt());
    }

    private static List<Item> itemsOf(JsonNode step) {
        List<Item> items = new ArrayList<>();
        for (JsonNode node : step.path("items")) {
            String type = node.path("type").asText();
            if (!PriceList.isKnown(type)) {
                throw new ScenarioException("unknown item type: " + type);
            }
            JsonNode enchantment = node.path("enchantment");
            items.add(new Item(type,
                    node.path("material").isMissingNode() ? null : node.path("material").asText(),
                    enchantment.isMissingNode() ? null : enchantment.asInt(),
                    node.path("cursed").asBoolean(false)));
        }
        return items;
    }

    private static List<Damage> damagesOf(JsonNode incident) {
        List<Damage> damages = new ArrayList<>();
        for (JsonNode node : incident.path("damages")) {
            damages.add(new Damage(node.path("itemType").asText(), node.path("amount").asInt()));
        }
        return damages;
    }

    private static JsonNode parse(String stdin) {
        try {
            return MAPPER.readTree(stdin);
        } catch (IOException e) {
            throw new ScenarioException("malformed scenario document: " + e.getMessage());
        }
    }
}
