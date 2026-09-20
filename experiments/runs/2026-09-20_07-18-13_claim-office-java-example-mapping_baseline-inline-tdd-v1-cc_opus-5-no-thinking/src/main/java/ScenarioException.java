/** Signals a scenario the MHPCO refuses to process. */
public class ScenarioException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ScenarioException(String message) {
        super(message);
    }
}
