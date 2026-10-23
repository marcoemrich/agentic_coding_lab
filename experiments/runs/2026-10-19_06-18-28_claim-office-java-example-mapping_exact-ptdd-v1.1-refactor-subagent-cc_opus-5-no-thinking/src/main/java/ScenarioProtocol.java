import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * The binding JSON scenario protocol: it reads a scenario document as the
 * operations the office performs, and writes the office's answers back as the
 * results document the schema fixes.
 *
 * Every field name the specification binds is spelled here and nowhere else, so
 * a schema revision renaming a field or reshaping a step is a revision of this
 * one translation. What the office does with a step is the {@link ClaimOffice}'s
 * business, and whether the executable reports the results or a refusal is
 * {@link ClaimOfficeCli}'s.
 */
class ScenarioProtocol {

    private static final ObjectMapper JSON = new ObjectMapper();

    /**
     * The results document for one scenario: the office opens for the customer
     * the scenario names, performs its steps in order, and answers one result
     * per step in that same order.
     */
    String resultsFor(InputStream scenario) {
        try {
            JsonNode input = JSON.readTree(scenario);
            ClaimOffice office = new ClaimOffice(
                    input.get("customer").get("yearsWithMHPCO").asInt());
            ObjectNode output = JSON.createObjectNode();
            ArrayNode results = output.putArray("results");
            JsonNode steps = input.get("steps");
            for (int stepIndex = 0; stepIndex < steps.size(); stepIndex++) {
                perform(steps.get(stepIndex), stepIndex, office, results.addObject());
            }
            return JSON.writeValueAsString(output);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    /**
     * What one step asks of the office, and what its result says: a claim step
     * is settled against the policy its {@code policy} index names and answers
     * what was paid and what the cap has left; any other step is a quote of the
     * items it brings, filed under its own step index, and answers its premium.
     *
     * The step's {@code op} is the protocol's own discriminator between the two
     * step shapes, so a revision adding a third operation is a revision here.
     */
    private static void perform(JsonNode step, int stepIndex, ClaimOffice office,
            ObjectNode result) {
        if ("claim".equals(step.get("op").asText())) {
            writeSettlement(office.settleClaim(step.get("policy").asInt(), damages(step)), result);
            return;
        }
        result.put("premium", office.quote(stepIndex, insuredItems(step)));
    }

    private static void writeSettlement(ClaimOffice.Settlement settlement, ObjectNode result) {
        result.put("payout", settlement.payout().intValueExact());
        result.put("remainingCap", settlement.remainingCap().intValueExact());
    }

    private static List<Damage> damages(JsonNode claimStep) {
        List<Damage> damages = new ArrayList<>();
        for (JsonNode damage : claimStep.get("incident").get("damages")) {
            damages.add(new Damage(damage.get("itemType").asText(),
                    new BigDecimal(damage.get("amount").asText())));
        }
        return damages;
    }

    private static List<InsuredItem> insuredItems(JsonNode quoteStep) {
        List<InsuredItem> items = new ArrayList<>();
        for (JsonNode item : quoteStep.get("items")) {
            items.add(new InsuredItem(item.get("type").asText(),
                    item.path("cursed").asBoolean(false),
                    item.path("enchantment").asInt(0)));
        }
        return items;
    }
}
