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
    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void appliesTheRequestedNumberOfStepsAndSortsTheResult() throws Exception {
        JsonNode output = runCli("{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":1}");

        assertEquals(mapper.readTree("{\"aliveCells\":[[-1,1],[0,1],[1,1]]}"), output);
    }

    @Test
    void zeroStepsReturnsTheNormalizedInputInCoordinateOrder() throws Exception {
        JsonNode output = runCli("{\"aliveCells\":[[2,-1],[-3,4],[2,-1]],\"steps\":0}");

        assertEquals(mapper.readTree("{\"aliveCells\":[[-3,4],[2,-1]]}"), output);
    }

    @Test
    void canApplyMultipleSteps() throws Exception {
        JsonNode output = runCli("{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":2}");

        assertEquals(mapper.readTree("{\"aliveCells\":[[0,0],[0,1],[0,2]]}"), output);
    }

    private JsonNode runCli(String input) throws Exception {
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
        return mapper.readTree(output.toString(StandardCharsets.UTF_8));
    }
}
