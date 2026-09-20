import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public final class ClaimOfficeCli {
    private static final ObjectMapper JSON = new ObjectMapper();

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        int status = run(System.in, System.out, System.err);
        if (status != 0) {
            System.exit(status);
        }
    }

    static int run(InputStream input, OutputStream output, OutputStream error) {
        try {
            JSON.writeValue(output, processScenario(JSON.readTree(input)));
            return 0;
        } catch (IOException | IllegalArgumentException exception) {
            try {
                error.write(exception.getMessage().getBytes(StandardCharsets.UTF_8));
            } catch (IOException ignored) {
                // The original operation has already failed.
            }
            return 1;
        }
    }

    private static ObjectNode processScenario(JsonNode scenario) {
        int years = scenario.path("customer").path("yearsWithMHPCO").asInt();
        ArrayNode results = JSON.createArrayNode();
        ClaimOffice office = new ClaimOffice();
        Map<Integer, Policy> policies = new HashMap<>();
        int previousContracts = 0;
        int stepIndex = 0;
        for (JsonNode step : scenario.path("steps")) {
            ObjectNode result = JSON.createObjectNode();
            if ("quote".equals(step.path("op").asText())) {
                JsonNode items = step.path("items");
                result.put("premium", office.quote(items, years, previousContracts));
                policies.put(stepIndex, office.createPolicy(items));
                previousContracts++;
            } else {
                Policy policy = policies.get(step.path("policy").asInt());
                if (policy == null) {
                    throw new IllegalArgumentException("Claim references an unknown policy");
                }
                ClaimOffice.ClaimResult claim = office.claim(policy, step.path("incident"));
                result.put("payout", claim.payout());
                result.put("remainingCap", claim.remainingCap());
            }
            results.add(result);
            stepIndex++;
        }
        ObjectNode response = JSON.createObjectNode();
        response.set("results", results);
        return response;
    }
}
