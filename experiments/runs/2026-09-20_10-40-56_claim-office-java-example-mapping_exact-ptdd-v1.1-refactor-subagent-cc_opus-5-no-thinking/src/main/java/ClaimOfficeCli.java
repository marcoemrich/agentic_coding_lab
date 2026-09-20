import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;

/**
 * The {@code claim-office} command line executable.
 *
 * <p>Reads a scenario document from stdin, works it through, and writes the
 * results document to stdout and nothing else. The MHPCO refuses a scenario
 * it cannot work through — a document it cannot read, or one its own rules
 * reject — by writing the reason to stderr, leaving stdout empty, and exiting
 * non-zero. Defers reading, settling and writing to the domain behind it.
 */
public final class ClaimOfficeCli {

    private static final int REFUSED = 1;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private ClaimOfficeCli() {
    }

    public static int run(InputStream in, PrintStream out, PrintStream err) {
        String results;
        try {
            results = ResultsWriter.document(
                    ScenarioReader.scenarioOf(MAPPER.readTree(in)).settle());
        } catch (IOException | RejectedScenario refused) {
            err.println(refused.getMessage());
            return REFUSED;
        }
        out.print(results);
        return 0;
    }

    public static void main(String[] args) {
        System.exit(run(System.in, System.out, System.err));
    }
}
