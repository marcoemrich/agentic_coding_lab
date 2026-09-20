import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

    @Test
    void cliEmitsEmptyAliveCellsForADyingSingleCell() {
        assertEquals("{\"aliveCells\":[]}", run("{\"aliveCells\":[[0,0]],\"steps\":1}"));
    }

    private static String run(String input) {
        return runRaw(input).trim();
    }

    private static String runRaw(String input) {
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
        return captured.toString(StandardCharsets.UTF_8);
    }

    @Test
    void cliAppliesOneGeneration() {
        assertEquals(
                "{\"aliveCells\":[[-1,1],[0,1],[1,1]]}",
                run("{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":1}"));
    }

    @Test
    void cliAppliesMultipleSteps() {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
                run("{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":2}"));
    }

    @Test
    void cliEmitsCellsSortedByXThenY() {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[1,0],[1,1]]}",
                run("{\"aliveCells\":[[1,1],[0,1],[1,0],[0,0]],\"steps\":0}"));
    }

    @Test
    void cliWritesOnlyTheJsonObjectToStdout() {
        assertEquals(
                "{\"aliveCells\":[[0,1],[1,1],[2,1]]}",
                runRaw("{\"aliveCells\":[[1,0],[1,1],[1,2]],\"steps\":1}"));
    }
}
