/** Signals that a scenario violates the MHPCO's rules and must be rejected. */
class ClaimOfficeException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    ClaimOfficeException(String message) {
        super(message);
    }
}
