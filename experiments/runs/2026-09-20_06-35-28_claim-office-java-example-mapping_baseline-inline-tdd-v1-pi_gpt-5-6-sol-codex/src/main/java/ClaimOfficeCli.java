import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/** JSON standard-input/standard-output adapter for the claim office. */
public final class ClaimOfficeCli {
    private ClaimOfficeCli() { }

    public static void main(String[] args) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode input = mapper.readTree(System.in);
            if (input == null) {
                throw new IllegalArgumentException("expected a JSON scenario");
            }
            mapper.writeValue(System.out, new ClaimOffice().process(input));
            System.out.println();
        } catch (Exception exception) {
            System.err.println("claim-office: " + exception.getMessage());
            System.exit(1);
        }
    }
}
