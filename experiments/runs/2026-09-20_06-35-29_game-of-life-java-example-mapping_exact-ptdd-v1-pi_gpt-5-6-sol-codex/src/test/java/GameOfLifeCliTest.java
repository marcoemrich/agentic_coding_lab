import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {
    @Test
    void appliesTheSpecifiedJsonRequest() throws Exception {
        String request = "{\"aliveCells\":[[0,0],[1,0]],\"steps\":1}";

        assertEquals("{\"aliveCells\":[]}", runCli(request));
    }

    @Test
    void appliesMultipleStepsAndSortsCoordinates() throws Exception {
        String request = "{\"aliveCells\":[[11,11],[0,2],[10,11],[0,0],"
                + "[11,10],[0,1],[10,10]],\"steps\":2}";
        String expected = "{\"aliveCells\":[[0,0],[0,1],[0,2],"
                + "[10,10],[10,11],[11,10],[11,11]]}";

        assertEquals(expected, runCli(request));
    }

    private String runCli(String request) throws IOException, InterruptedException {
        String java = System.getProperty("java.home") + "/bin/java";
        Process process = new ProcessBuilder(
                java, "-cp", System.getProperty("java.class.path"), "GameOfLifeCli")
                .start();
        process.getOutputStream().write(request.getBytes(StandardCharsets.UTF_8));
        process.getOutputStream().close();
        String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        String error = new String(process.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
        assertEquals(0, process.waitFor(), error);
        return output.trim();
    }
}
