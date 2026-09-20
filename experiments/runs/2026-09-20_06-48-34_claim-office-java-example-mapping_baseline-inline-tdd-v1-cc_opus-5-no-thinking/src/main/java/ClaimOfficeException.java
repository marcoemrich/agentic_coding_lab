/** Signals a scenario the MHPCO refuses to process. */
public class ClaimOfficeException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ClaimOfficeException(String message) {
        super(message);
    }
}
