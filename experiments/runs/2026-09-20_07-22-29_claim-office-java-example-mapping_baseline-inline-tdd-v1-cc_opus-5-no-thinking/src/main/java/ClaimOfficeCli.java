import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

/** Command-line entry point of the MHPCO claim office. */
public final class ClaimOfficeCli {

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        System.exit(execute(System.in, System.out, System.err));
    }

    /**
     * Runs one scenario. The results are written to {@code out} only when the whole
     * scenario was processed successfully; a rejected scenario writes to {@code err}
     * and reports a non-zero status.
     */
    static int execute(InputStream in, PrintStream out, PrintStream err) {
        String results;
        try {
            results = Scenario.run(new String(in.readAllBytes(), StandardCharsets.UTF_8));
        } catch (ClaimOfficeException e) {
            err.println(e.getMessage());
            return 1;
        } catch (IOException e) {
            err.println("could not read the scenario: " + e.getMessage());
            return 1;
        }
        out.println(results);
        return 0;
    }
}
