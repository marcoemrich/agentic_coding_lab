import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Reads a scenario from stdin and writes the MHPCO's results to stdout. */
public final class ClaimOfficeCli {

    private static final ObjectMapper JSON = new ObjectMapper();
    private static final TypeReference<Map<String, Object>> DOCUMENT =
            new TypeReference<>() {
            };

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) throws Exception {
        String scenario = new String(System.in.readAllBytes());
        try {
            System.out.print(run(scenario));
        } catch (RuntimeException rejected) {
            reportRejection(rejected, System.err);
            System.exit(1);
        }
    }

    private static void reportRejection(RuntimeException rejected, PrintStream stderr) {
        stderr.println("the MHPCO rejects this scenario: " + rejected.getMessage());
    }

    static String run(String scenarioJson) throws Exception {
        Map<String, Object> scenario = JSON.readValue(scenarioJson, DOCUMENT);
        ClaimOffice office = new ClaimOffice(objectAt("customer", scenario));
        List<Map<String, Object>> results = new ArrayList<>();
        for (Map<String, Object> step : listAt("steps", scenario)) {
            results.add(resultOf(step, office));
        }
        return JSON.writeValueAsString(Map.of("results", results));
    }

    private static Map<String, Object> resultOf(Map<String, Object> step, ClaimOffice office) {
        if ("quote".equals(step.get("op"))) {
            return Map.of("premium", office.quote(listAt("items", step)));
        }
        Settlement settlement = office.claim(policyIndexIn(step), objectAt("incident", step));
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("payout", settlement.payout());
        result.put("remainingCap", settlement.remainingCap());
        return result;
    }

    /** Reads a nested JSON object, such as the scenario's customer or a claim's incident. */
    private static Map<String, Object> objectAt(String field, Map<String, Object> document) {
        return JSON.convertValue(document.get(field), DOCUMENT);
    }

    /** Reads a JSON array of objects, such as the scenario's steps or a quote's items. */
    private static List<Map<String, Object>> listAt(String field, Map<String, Object> document) {
        return JSON.convertValue(document.get(field),
                new TypeReference<List<Map<String, Object>>>() {
                });
    }

    private static int policyIndexIn(Map<String, Object> step) {
        return ((Number) step.get("policy")).intValue();
    }
}
