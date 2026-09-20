import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Command-line adapter for the claim office: it translates a JSON scenario from stdin into
 * calls on {@link ClaimOffice} and the results back into JSON on stdout. It holds no
 * insurance rules of its own.
 */
public final class ClaimOfficeCli {

    private static final ObjectMapper JSON = new ObjectMapper();

    private static final int SUCCESS = 0;
    private static final int REJECTED = 1;

    /** Binding field names from the specification's normative schema. */
    private static final String CUSTOMER = "customer";
    private static final String YEARS_WITH_MHPCO = "yearsWithMHPCO";
    private static final String STEPS = "steps";
    private static final String OP = "op";
    private static final String QUOTE = "quote";
    private static final String ITEMS = "items";
    private static final String POLICY = "policy";
    private static final String INCIDENT = "incident";
    private static final String DAMAGES = "damages";
    private static final String RESULTS = "results";
    private static final String PREMIUM = "premium";
    private static final String PAYOUT = "payout";
    private static final String REMAINING_CAP = "remainingCap";

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        System.exit(run());
    }

    /**
     * Processes one scenario and returns the process exit status: zero when every step was
     * settled, non-zero when the office rejected the scenario or the input was unreadable.
     * The error description goes to stderr, and no results are written to stdout.
     *
     * <p>Scope: this handles a rejected scenario and malformed JSON. A structurally absent
     * document -- empty stdin, or one missing {@code customer} or {@code steps} -- still fails
     * with an uncaught {@link NullPointerException} and a stack trace rather than a description.
     * No behaviour in the specification covers that input, so it is recorded rather than fixed.
     */
    static int run() {
        try {
            writeResults(readScenario());
            return SUCCESS;
        } catch (IllegalArgumentException | IOException rejected) {
            System.err.println(rejected.getMessage());
            return REJECTED;
        }
    }

    private static JsonNode readScenario() throws IOException {
        return JSON.readTree(System.in);
    }

    private static void writeResults(JsonNode scenario) throws IOException {
        ClaimOffice office = new ClaimOffice(scenario.get(CUSTOMER).get(YEARS_WITH_MHPCO).asInt());

        ArrayNode results = JSON.createArrayNode();
        for (JsonNode step : scenario.get(STEPS)) {
            results.add(resultOf(office, step));
        }

        ObjectNode output = JSON.createObjectNode();
        output.set(RESULTS, results);
        System.out.println(JSON.writeValueAsString(output));
    }

    private static ObjectNode resultOf(ClaimOffice office, JsonNode step) {
        ObjectNode result = JSON.createObjectNode();
        if (QUOTE.equals(step.get(OP).asText())) {
            result.put(PREMIUM, office.quote(elementsOf(step.get(ITEMS))));
            return result;
        }
        int policyIndex = step.get(POLICY).asInt();
        result.put(PAYOUT, office.claim(policyIndex, elementsOf(step.get(INCIDENT).get(DAMAGES))));
        result.put(REMAINING_CAP, office.remainingCap(policyIndex));
        return result;
    }

    /** Items and damages are both plain JSON arrays of flat objects; the domain reads the fields. */
    private static List<Map<String, Object>> elementsOf(JsonNode array) {
        List<Map<String, Object>> converted = new ArrayList<>();
        for (JsonNode element : array) {
            converted.add(fieldsOf(element));
        }
        return converted;
    }

    private static Map<String, Object> fieldsOf(JsonNode node) {
        Map<String, Object> fields = new HashMap<>();
        node.fields().forEachRemaining(field -> fields.put(field.getKey(), valueOf(field.getValue())));
        return fields;
    }

    private static Object valueOf(JsonNode value) {
        if (value.isInt()) {
            return value.asInt();
        }
        if (value.isBoolean()) {
            return value.asBoolean();
        }
        return value.asText();
    }
}
