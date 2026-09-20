import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

/**
 * Reads a scenario from stdin and writes the office's results to stdout.
 *
 * When the office objects to the scenario it writes nothing to stdout: the objection is
 * described on stderr and reported as a failing exit status, so that a caller is never left
 * reading results the office refused to give.
 */
public final class ClaimOfficeCli {

    private static final int OBJECTION_STATUS = 1;

    private static final int SETTLED_STATUS = 0;

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        System.exit(run());
    }

    /**
     * How the office reports the outcome of a scenario at the console.
     *
     * The results are written out only once they exist in full, because an objection raised
     * anywhere in the scenario withdraws the whole document: the office would rather say
     * nothing than have a caller read a partial answer as a complete one.
     */
    public static int run() {
        String results;
        try {
            results = resultsFor(scenarioDocument());
        } catch (ClaimOfficeException objection) {
            printTo(System.err, objection.getMessage());
            return OBJECTION_STATUS;
        }
        printTo(System.out, results);
        return SETTLED_STATUS;
    }

    /**
     * The office's answer to a scenario document: read in the office's terms, worked
     * through, and written back in the terms the document was sent in.
     */
    private static String resultsFor(String document) {
        ScenarioJson correspondence = new ScenarioJson();
        Scenario scenario = correspondence.readScenario(document);
        return correspondence.writeResults(new ClaimOffice().run(scenario));
    }

    private static String scenarioDocument() {
        try (InputStream in = System.in) {
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException unreadable) {
            throw new ClaimOfficeException("The scenario could not be read: " + unreadable.getMessage());
        }
    }

    private static void printTo(OutputStream stream, String line) {
        new PrintStream(stream, true, StandardCharsets.UTF_8).println(line);
    }
}
