/** Signals a rejected scenario: unknown item types, invalid damages, or unmatched claims. */
public class ClaimOfficeException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ClaimOfficeException(String message) {
        super(message);
    }
}
