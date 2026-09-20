import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.List;

/**
 * Reads a scenario document in the MHPCO wire format into the domain.
 *
 * <p>Holds what the input schema says and nothing else: which fields name the
 * customer, the steps and their items and damages, and that an item whose
 * enchantment or curse is not stated carries neither. Knows nothing about
 * tariffs, payouts, the command line, or how a results document is written.
 *
 * <p>Changes whenever the MHPCO revises the input schema.
 */
final class ScenarioReader {

    private ScenarioReader() {
    }

    static Scenario scenarioOf(JsonNode scenario) {
        List<Step> steps = new ArrayList<>();
        for (JsonNode step : scenario.get("steps")) {
            steps.add(stepOf(step));
        }
        return new Scenario(customerOf(scenario), steps);
    }

    private static Step stepOf(JsonNode step) {
        if ("claim".equals(step.get("op").asText())) {
            return new ClaimStep(step.get("policy").asInt(), incidentOf(step.get("incident")));
        }
        return new QuoteStep(itemsOf(step));
    }

    private static Incident incidentOf(JsonNode incident) {
        List<Damage> damages = new ArrayList<>();
        for (JsonNode damage : incident.get("damages")) {
            damages.add(new Damage(damage.get("itemType").asText(), damage.get("amount").asInt()));
        }
        return new Incident(incident.get("cause").asText(), damages);
    }

    private static List<Item> itemsOf(JsonNode quoteStep) {
        List<Item> items = new ArrayList<>();
        for (JsonNode item : quoteStep.get("items")) {
            items.add(new Item(item.get("type").asText(), item.path("enchantment").asInt(),
                    item.path("cursed").asBoolean()));
        }
        return items;
    }

    private static Customer customerOf(JsonNode scenario) {
        return new Customer(scenario.get("customer").get("yearsWithMHPCO").asInt());
    }
}
