import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/** JSON stdin/stdout command-line adapter for the claim office. */
public final class ClaimOfficeCli {
    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode scenario = mapper.readTree(System.in);
            mapper.writeValue(System.out, new ClaimOffice().process(scenario));
            System.out.println();
        } catch (Exception exception) {
            System.err.println("claim-office: " + exception.getMessage());
            System.exit(1);
        }
    }
}
