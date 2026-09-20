import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.InputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

public final class ClaimOfficeCli {
    private static final ObjectMapper JSON = new ObjectMapper();

    private ClaimOfficeCli() { }

    public static void main(String[] args) throws Exception {
        int status = run(System.in, System.out, System.err);
        if (status != 0) {
            System.exit(status);
        }
    }

    static int run(InputStream input, PrintStream output, PrintStream error) throws Exception {
        JsonNode scenario = JSON.readTree(input);
        ArrayNode results = JSON.createArrayNode();
        int customerYears = scenario.path("customer").path("yearsWithMHPCO").asInt();
        int quoteCount = 0;
        Map<Integer, Policy> policies = new HashMap<>();
        int stepIndex = 0;
        for (JsonNode step : scenario.path("steps")) {
            ObjectNode result = JSON.createObjectNode();
            if ("quote".equals(step.path("op").asText())) {
                List<InsuredItem> quotedItems = items(step.path("items"));
                if (quotedItems.stream().anyMatch(item -> !PriceList.includesItemType(item.type()))) {
                    error.println("Unknown item type");
                    return 1;
                }
                result.put("premium", PremiumCalculator.quote(
                        quotedItems, customerYears, quoteCount > 0));
                policies.put(stepIndex, new Policy(quotedItems));
                quoteCount++;
            } else {
                Policy policy = policies.get(step.path("policy").asInt());
                List<DamageEvent> damageEvents = damages(step.path("incident").path("damages"));
                if (damageEvents.stream().anyMatch(DamageEvent::hasNegativeAmount)) {
                    error.println("Damage amount must not be negative");
                    return 1;
                }
                if (!policy.coversEveryDamage(damageEvents)) {
                    error.println("Claim damage exceeds policy coverage");
                    return 1;
                }
                int desiredPayout = ClaimCalculator.payout(policy, damageEvents);
                int payout = policy.pay(desiredPayout);
                result.put("payout", payout);
                result.put("remainingCap", policy.remainingCap());
            }
            results.add(result);
            stepIndex++;
        }
        ObjectNode response = JSON.createObjectNode();
        response.set("results", results);
        output.print(JSON.writeValueAsString(response));
        return 0;
    }

    private static List<DamageEvent> damages(JsonNode damageNodes) {
        List<DamageEvent> damages = new ArrayList<>();
        for (JsonNode damage : damageNodes) {
            damages.add(new DamageEvent(
                    damage.path("itemType").asText(), damage.path("amount").asInt()));
        }
        return damages;
    }

    private static List<InsuredItem> items(JsonNode itemNodes) {
        List<InsuredItem> items = new ArrayList<>();
        for (JsonNode item : itemNodes) {
            items.add(new InsuredItem(item.path("type").asText(), item.path("material").asText(),
                    item.path("enchantment").asInt(), item.path("cursed").asBoolean()));
        }
        return items;
    }

}
