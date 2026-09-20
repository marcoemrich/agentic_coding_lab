import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/** JSON standard-input command line entry point for the claim office. */
public final class ClaimOfficeCli {
    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        ObjectMapper json = new ObjectMapper();
        try {
            JsonNode scenario = json.readTree(System.in);
            JsonNode result = new ClaimOffice().process(scenario);
            json.writeValue(System.out, result);
            System.out.println();
        } catch (Exception exception) {
            System.err.println("Error: " + safeMessage(exception));
            System.exit(1);
        }
    }

    private static String safeMessage(Exception exception) {
        String message = exception.getMessage();
        return message == null ? exception.getClass().getSimpleName() : message;
    }
}
