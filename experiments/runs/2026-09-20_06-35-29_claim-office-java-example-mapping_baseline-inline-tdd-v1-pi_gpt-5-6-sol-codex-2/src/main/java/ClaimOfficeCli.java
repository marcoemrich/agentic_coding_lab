import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/** JSON stdin/stdout entry point for the MHPCO claim office. */
public final class ClaimOfficeCli {
    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode input = mapper.readTree(System.in);
            JsonNode output = new ClaimOffice(mapper).process(input);
            mapper.writeValue(System.out, output);
            System.out.println();
        } catch (Exception exception) {
            System.err.println("Error: " + errorMessage(exception));
            System.exit(1);
        }
    }

    private static String errorMessage(Exception exception) {
        String message = exception.getMessage();
        return message == null || message.isBlank() ? exception.getClass().getSimpleName() : message;
    }
}
