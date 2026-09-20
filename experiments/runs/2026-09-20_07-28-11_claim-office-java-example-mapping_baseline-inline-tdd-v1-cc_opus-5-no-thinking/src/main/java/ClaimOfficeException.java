/** Signals a rejected scenario: unknown items, uncovered damages, invalid amounts. */
public class ClaimOfficeException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ClaimOfficeException(String message) {
        super(message);
    }
}
