import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

/** Reads a scenario as JSON from stdin and writes the results as JSON to stdout. */
public final class ClaimOfficeCli {

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        try (InputStream in = System.in) {
            String input = new String(in.readAllBytes(), StandardCharsets.UTF_8);
            PrintStream out = new PrintStream(System.out, true, StandardCharsets.UTF_8);
            out.println(ScenarioRunner.run(input));
        } catch (ClaimOfficeException | IOException e) {
            System.err.println("claim rejected: " + e.getMessage());
            System.exit(1);
        }
    }
}
