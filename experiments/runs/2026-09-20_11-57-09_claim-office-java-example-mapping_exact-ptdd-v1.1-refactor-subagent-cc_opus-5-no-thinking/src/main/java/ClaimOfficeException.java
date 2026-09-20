/**
 * The office refuses to process a scenario, with a description of the objection.
 */
public class ClaimOfficeException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ClaimOfficeException(String message) {
        super(message);
    }
}
