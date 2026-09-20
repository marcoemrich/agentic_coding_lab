import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.Set;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

    @Test
    void cliWritesEmptyAliveCellsWhenAllCellsDie() {
        assertEquals("{\"aliveCells\":[]}", runCli("{\"aliveCells\":[[0,0]],\"steps\":1}"));
    }

    private static String runCli(String input) {
        InputStream originalIn = System.in;
        PrintStream originalOut = System.out;
        ByteArrayOutputStream captured = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(captured, true, StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }
        return captured.toString(StandardCharsets.UTF_8).trim();
    }

    @Test
    void cliAppliesOneGenerationStep() {
        String block = "{\"aliveCells\":[[0,0],[1,0],[0,1],[1,1]],\"steps\":1}";

        assertEquals("{\"aliveCells\":[[0,0],[0,1],[1,0],[1,1]]}", runCli(block));
    }

    @Test
    void cliSortsOutputCellsByXThenY() {
        String verticalBlinker = "{\"aliveCells\":[[0,2],[0,0],[0,1]],\"steps\":1}";

        assertEquals("{\"aliveCells\":[[-1,1],[0,1],[1,1]]}", runCli(verticalBlinker));
    }

    @Test
    void cliAppliesNextGenerationStepsTimes() {
        String verticalBlinker = "{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":2}";

        assertEquals("{\"aliveCells\":[[0,0],[0,1],[0,2]]}", runCli(verticalBlinker));
    }

    @Test
    void cliWithZeroStepsEchoesSortedInput() {
        String loneCell = "{\"aliveCells\":[[5,1],[0,0]],\"steps\":0}";

        assertEquals("{\"aliveCells\":[[0,0],[5,1]]}", runCli(loneCell));
    }

    @Test
    void cliWritesOnlyOneJsonObjectToStdout() throws Exception {
        String stdout = runCli("{\"aliveCells\":[[0,0],[1,0],[0,1]],\"steps\":1}");

        JsonParser parser = new ObjectMapper().createParser(stdout);
        JsonNode onlyObject = parser.readValueAsTree();

        assertTrue(onlyObject.isObject());
        assertEquals(Set.of("aliveCells"), Set.copyOf(onlyObject.properties().stream().map(Map.Entry::getKey).toList()));
        assertNull(parser.nextToken());
    }
}
