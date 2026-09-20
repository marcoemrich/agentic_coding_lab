import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.HashMap;
import java.util.Map;

final class ClaimOffice {
    private static final ObjectMapper JSON = new ObjectMapper();
    private final PremiumCalculator premiums = new PremiumCalculator();
    private final ClaimProcessor claims = new ClaimProcessor();

    ObjectNode process(JsonNode scenario) {
        ArrayNode results = JSON.createArrayNode();
        Map<Integer, Policy> policies = new HashMap<>();
        int years = scenario.path("customer").path("yearsWithMHPCO").asInt();
        int quotesSeen = 0;
        for (int index = 0; index < scenario.path("steps").size(); index++) {
            JsonNode step = scenario.path("steps").get(index);
            ObjectNode result = JSON.createObjectNode();
            if ("quote".equals(step.path("op").asText())) {
                result.put("premium", premiums.quote(step.path("items"), years, quotesSeen > 0));
                policies.put(index, new Policy(step.path("items")));
                quotesSeen++;
            } else {
                Policy policy = policies.get(step.path("policy").asInt());
                int payout = claims.process(policy, step.path("incident").path("damages"));
                result.put("payout", payout);
                result.put("remainingCap", policy.remainingCap());
            }
            results.add(result);
        }
        ObjectNode response = JSON.createObjectNode();
        response.set("results", results);
        return response;
    }
}
