import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

public final class ClaimOfficeCli {
    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        int status = execute(System.in, System.out, System.err);
        if (status != 0) {
            System.exit(status);
        }
    }

    public static int execute(InputStream input, PrintStream output, PrintStream error) {
        try {
            writeResult(input, output);
            return 0;
        } catch (Exception exception) {
            error.println(exception.getMessage());
            return 1;
        }
    }

    private static void writeResult(InputStream input, PrintStream output) throws Exception {
        String scenario = new String(input.readAllBytes(), StandardCharsets.UTF_8);
        output.print(ClaimOffice.process(scenario));
    }
}
