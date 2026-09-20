/**
 * The MHPCO refuses to work a scenario through: the whole claim or quote is
 * rejected and nothing is settled.
 */
final class RejectedScenario extends RuntimeException {

    private static final long serialVersionUID = 1L;

    RejectedScenario(String reason) {
        super(reason);
    }
}
