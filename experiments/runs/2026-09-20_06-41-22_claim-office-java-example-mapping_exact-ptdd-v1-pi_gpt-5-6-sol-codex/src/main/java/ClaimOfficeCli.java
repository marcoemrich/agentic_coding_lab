import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public final class ClaimOfficeCli {
    private static final ObjectMapper JSON = new ObjectMapper();

    private ClaimOfficeCli() { }

    public static void main(String[] args) {
        int status = execute(System.in, System.out, System.err);
        if (status != 0) {
            System.exit(status);
        }
    }

    static int execute(InputStream input, OutputStream output, OutputStream error) {
        try {
            JsonNode scenario = JSON.readTree(input);
            JSON.writeValue(output, new ClaimOffice().process(scenario));
            return 0;
        } catch (Exception exception) {
            writeError(error, exception);
            return 1;
        }
    }

    private static void writeError(OutputStream error, Exception exception) {
        try {
            String message = exception.getMessage() == null ? exception.getClass().getSimpleName()
                    : exception.getMessage();
            error.write(message.getBytes(StandardCharsets.UTF_8));
        } catch (Exception ignored) {
            // The original failure determines the exit status.
        }
    }
}
