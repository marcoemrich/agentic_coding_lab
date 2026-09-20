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
    void cliWritesNextGenerationAsJson() {
        String output = run("{\"aliveCells\": [[0, 0], [1, 0]], \"steps\": 1}");

        assertEquals("{\"aliveCells\":[]}", output.trim());
    }

    private static String run(String input) {
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
    void cliEmitsCellsSortedByXThenY() {
        String output = run("{\"aliveCells\": [[0, 2], [0, 1], [0, 0]], \"steps\": 1}");

        assertEquals("{\"aliveCells\":[[-1,1],[0,1],[1,1]]}", output.trim());
    }

    @Test
    void cliAppliesStepsTimes() {
        String output = run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 2}");

        assertEquals("{\"aliveCells\":[[0,0],[0,1],[0,2]]}", output.trim());
    }

    @Test
    void cliWithZeroStepsEchoesInput() {
        String output = run("{\"aliveCells\": [[1, 0], [0, 0]], \"steps\": 0}");

        assertEquals("{\"aliveCells\":[[0,0],[1,0]]}", output.trim());
    }

    @Test
    void cliWritesOnlyTheJsonObjectToStdout() {
        String output = run("{\"aliveCells\": [[0, 0], [1, 0], [0, 1]], \"steps\": 1}");

        assertEquals("{\"aliveCells\":[[0,0],[0,1],[1,0],[1,1]]}", output);
    }
}
