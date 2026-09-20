import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    @Test
    void appliesRequestedStepsAndSortsCoordinates() throws Exception {
        JsonNode actual = runCli(
                "{\"aliveCells\":[[0,2],[0,0],[0,1]],\"steps\":1}");

        assertEquals(
                JSON.readTree("{\"aliveCells\":[[-1,1],[0,1],[1,1]]}"),
                actual);
    }

    @Test
    void appliesMoreThanOneGeneration() throws Exception {
        JsonNode actual = runCli(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":2}");

        assertEquals(
                JSON.readTree("{\"aliveCells\":[[0,0],[0,1],[0,2]]}"),
                actual);
    }

    @Test
    void zeroStepsOnlyNormalizesAndSortsTheInput() throws Exception {
        JsonNode actual = runCli(
                "{\"aliveCells\":[[2,-1],[-3,4],[2,-1]],\"steps\":0}");

        assertEquals(
                JSON.readTree("{\"aliveCells\":[[-3,4],[2,-1]]}"),
                actual);
    }

    private static JsonNode runCli(String input) throws Exception {
        InputStream originalIn = System.in;
        PrintStream originalOut = System.out;
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(output, true, StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }
        return JSON.readTree(output.toString(StandardCharsets.UTF_8));
    }
}
