import java.io.InputStream;
import java.io.PrintStream;

/**
 * The claim-office executable: it reports one scenario's results, and answers
 * the exit status the scenario earns.
 *
 * All this decides is what the executable writes where and what it exits with:
 * the results document on stdout and nothing else when the office accepts the
 * scenario, the office's reason on stderr and a non-zero status when it refuses.
 * Reading the scenario and spelling the results is the
 * {@link ScenarioProtocol}'s business, so a schema revision touches none of
 * this, and a revision to how a refusal is reported touches no field name.
 */
public class ClaimOfficeCli {

    private static final int ACCEPTED = 0;
    private static final int REJECTED = 1;

    private final ScenarioProtocol protocol = new ScenarioProtocol();

    /**
     * The executable reads one scenario from standard input, answers on
     * standard output, and exits with the status its report answers.
     */
    public static void main(String[] args) {
        System.exit(new ClaimOfficeCli().report(System.in, System.out, System.err));
    }

    /**
     * Reports the scenario's results, answering the exit status the office
     * exits with: nothing but the results document on stdout when the office
     * accepts the scenario, nothing but the refusal's reason on stderr when it
     * refuses.
     */
    public int report(InputStream scenario, PrintStream results, PrintStream rejection) {
        try {
            results.print(protocol.resultsFor(scenario));
            return ACCEPTED;
        } catch (RejectedScenario refusal) {
            rejection.println(refusal.getMessage());
            return REJECTED;
        }
    }
}
