import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.List;

/**
 * Writes the results of a settled scenario back out in the MHPCO wire format.
 *
 * <p>Holds what the output schema says and nothing else: that the document is
 * a results array mirroring the steps in order, and which field names a quote
 * result and a claim result are reported under. Knows nothing about tariffs,
 * payouts, the command line, or how a scenario document is read.
 *
 * <p>Changes whenever the MHPCO revises the output schema.
 */
final class ResultsWriter {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private ResultsWriter() {
    }

    static String document(List<StepResult> results) {
        ObjectNode document = MAPPER.createObjectNode();
        ArrayNode written = document.putArray("results");
        for (StepResult result : results) {
            written.add(resultOf(result));
        }
        return document.toString();
    }

    private static ObjectNode resultOf(StepResult result) {
        ObjectNode written = MAPPER.createObjectNode();
        if (result instanceof ClaimResult claim) {
            written.put("payout", claim.payout());
            written.put("remainingCap", claim.remainingCap());
        } else {
            written.put("premium", ((QuoteResult) result).premium());
        }
        return written;
    }
}
