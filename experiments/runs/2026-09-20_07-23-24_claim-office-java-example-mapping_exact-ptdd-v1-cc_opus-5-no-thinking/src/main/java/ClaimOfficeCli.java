import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;

/** Reads an MHPCO scenario from stdin and writes its results to stdout. */
public final class ClaimOfficeCli {

    private static final int REJECTED = 1;

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        PrintStream out = new PrintStream(System.out, true, StandardCharsets.UTF_8);
        PrintStream err = new PrintStream(System.err, true, StandardCharsets.UTF_8);
        System.exit(run(System.in, out, err));
    }

    static int run(InputStream in, PrintStream out, PrintStream err) {
        String scenario = readAll(in);
        try {
            out.println(ClaimOffice.run(scenario));
            return 0;
        } catch (IllegalArgumentException rejection) {
            err.println(rejection.getMessage());
            return REJECTED;
        }
    }

    private static String readAll(InputStream in) {
        try {
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
