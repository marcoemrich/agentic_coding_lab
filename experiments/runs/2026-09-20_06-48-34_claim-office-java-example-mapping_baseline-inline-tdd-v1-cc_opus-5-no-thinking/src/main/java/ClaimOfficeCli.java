import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.io.PrintStream;

/** Reads a scenario as JSON from stdin and writes the results as JSON to stdout. */
public final class ClaimOfficeCli {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        System.exit(run(System.in, System.out, System.err));
    }

    /** Runs one scenario; returns the process exit status. */
    public static int run(InputStream in, PrintStream out, PrintStream err) {
        try {
            out.print(MAPPER.writeValueAsString(new ScenarioRunner().run(MAPPER.readTree(in))));
            out.flush();
            return 0;
        } catch (ClaimOfficeException e) {
            err.println(e.getMessage());
            return 1;
        } catch (Exception e) {
            err.println("invalid scenario: " + e.getMessage());
            return 1;
        }
    }
}
