import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

    @Test
    void cliEmitsEmptyGenerationForSingleCell() {
        assertEquals(
                "{\"aliveCells\":[]}",
                runCli("{\"aliveCells\": [[0, 0]], \"steps\": 1}"));
    }

    private static String runCli(String input) {
        return runCliRaw(input).trim();
    }

    private static String runCliRaw(String input) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        GameOfLifeCli.run(
                new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)),
                new PrintStream(output, true, StandardCharsets.UTF_8));
        return output.toString(StandardCharsets.UTF_8);
    }

    @Test
    void cliAppliesStepsTimes() {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
                runCli("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 2}"));
    }

    @Test
    void cliWithZeroStepsReturnsInputCells() {
        assertEquals(
                "{\"aliveCells\":[[0,0],[5,5]]}",
                runCli("{\"aliveCells\": [[5, 5], [0, 0]], \"steps\": 0}"));
    }

    @Test
    void cliEmitsCellsSortedByXThenY() {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[1,0],[1,1]]}",
                runCli("{\"aliveCells\": [[1, 1], [0, 1], [1, 0], [0, 0]], \"steps\": 1}"));
    }

    @Test
    void cliWritesOnlyOneJsonObject() {
        // Uses the untrimmed variant, so a stray newline or extra output is visible.
        assertEquals(
                "{\"aliveCells\":[]}",
                runCliRaw("{\"aliveCells\": [[0, 0]], \"steps\": 1}"));
    }

    @Test
    void cliHandlesEmptyInput() {
        assertEquals(
                "{\"aliveCells\":[]}", runCli("{\"aliveCells\": [], \"steps\": 1}"));
    }
}
