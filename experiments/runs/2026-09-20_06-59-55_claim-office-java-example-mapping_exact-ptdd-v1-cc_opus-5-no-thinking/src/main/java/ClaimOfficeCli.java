import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** Reads an MHPCO scenario as JSON from stdin and writes the results as JSON to stdout. */
public final class ClaimOfficeCli {

    private static final ObjectMapper JSON = new ObjectMapper();

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) throws IOException {
        String scenario = readAll(System.in);
        try {
            System.out.print(run(scenario));
        } catch (IllegalArgumentException rejected) {
            System.err.println(rejected.getMessage());
            System.exit(1);
        }
    }

    public static String run(String scenarioJson) {
        JsonNode scenario = parse(scenarioJson);
        ClaimOffice office = new ClaimOffice(scenario.path("customer").path("yearsWithMHPCO").asInt());
        ArrayNode results = JSON.createArrayNode();
        for (JsonNode step : scenario.path("steps")) {
            results.add(resultOf(step, office));
        }
        ObjectNode document = JSON.createObjectNode();
        document.set("results", results);
        return document.toString();
    }

    private static ObjectNode resultOf(JsonNode step, ClaimOffice office) {
        ObjectNode result = JSON.createObjectNode();
        if ("quote".equals(step.path("op").asText())) {
            result.put("premium", office.quote(itemsOf(step)));
        } else {
            ClaimResult claim = office.claim(step.path("policy").asInt(), damagesOf(step));
            result.put("payout", claim.payout());
            result.put("remainingCap", claim.remainingCap());
        }
        return result;
    }

    private static List<Map<String, Object>> itemsOf(JsonNode step) {
        List<Map<String, Object>> items = new ArrayList<>();
        for (JsonNode item : step.path("items")) {
            items.add(JSON.convertValue(item, Map.class));
        }
        return items;
    }

    private static List<Map<String, Object>> damagesOf(JsonNode step) {
        List<Map<String, Object>> damages = new ArrayList<>();
        for (JsonNode damage : step.path("incident").path("damages")) {
            damages.add(JSON.convertValue(damage, Map.class));
        }
        return damages;
    }

    private static JsonNode parse(String scenarioJson) {
        try {
            return JSON.readTree(scenarioJson);
        } catch (IOException malformed) {
            throw new IllegalArgumentException("The scenario is not valid JSON", malformed);
        }
    }

    private static String readAll(InputStream in) throws IOException {
        return new String(in.readAllBytes(), StandardCharsets.UTF_8);
    }
}
