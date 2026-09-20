import com.fasterxml.jackson.core.JsonProcessingException;
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

    public static int run(InputStream input, OutputStream output, OutputStream error) {
        try {
            String result = process(new String(input.readAllBytes(), StandardCharsets.UTF_8));
            output.write(result.getBytes(StandardCharsets.UTF_8));
            return 0;
        } catch (IOException | RuntimeException exception) {
            reportFailure(error, exception);
            return 1;
        }
    }

    private static void reportFailure(OutputStream error, Exception failure) {
        try {
            error.write((failure.getMessage() + System.lineSeparator())
                    .getBytes(StandardCharsets.UTF_8));
        } catch (IOException ignored) {
            // The original failure determines the non-zero status.
        }
    }

    public static void main(String[] args) {
        int status = run(System.in, System.out, System.err);
        if (status != 0) {
            System.exit(status);
        }
    }

    public static String process(String input) {
        try {
            JsonNode scenario = JSON.readTree(input);
            ArrayNode results = JSON.createArrayNode();
            int yearsWithMhpco = scenario.path("customer").path("yearsWithMHPCO").asInt();
            int quoteCount = 0;
            int stepIndex = 0;
            Map<Integer, ClaimPolicy> policies = new HashMap<>();
            for (JsonNode step : scenario.path("steps")) {
                ObjectNode result = results.addObject();
                if ("quote".equals(step.path("op").asText())) {
                    result.put("premium", QuotePricing.premium(step, yearsWithMhpco, quoteCount > 0));
                    policies.put(stepIndex, new ClaimPolicy(step.path("items")));
                    quoteCount++;
                } else {
                    ClaimPolicy policy = policies.get(step.path("policy").asInt());
                    ClaimPolicy.ClaimResult claim = policy.claim(step.path("incident"));
                    result.put("payout", claim.payout());
                    result.put("remainingCap", claim.remainingCap());
                }
                stepIndex++;
            }
            ObjectNode output = JSON.createObjectNode();
            output.set("results", results);
            return JSON.writeValueAsString(output);
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException("Invalid scenario", exception);
        }
    }
}
