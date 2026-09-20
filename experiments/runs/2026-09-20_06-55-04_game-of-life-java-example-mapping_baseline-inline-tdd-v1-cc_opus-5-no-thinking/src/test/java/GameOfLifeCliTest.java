import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

    @Test
    void blinkerAdvancesOneStep() {
        assertEquals("{\"aliveCells\":[[-1,1],[0,1],[1,1]]}",
                run("{\"aliveCells\": [[0,0],[0,1],[0,2]], \"steps\": 1}"));
    }

    @Test
    void blinkerReturnsAfterTwoSteps() {
        assertEquals("{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
                run("{\"aliveCells\": [[0,0],[0,1],[0,2]], \"steps\": 2}"));
    }

    @Test
    void singleCellDiesLeavingEmptyOutput() {
        assertEquals("{\"aliveCells\":[]}", run("{\"aliveCells\": [[0,0]], \"steps\": 1}"));
    }

    @Test
    void missingStepsDefaultsToOneStep() {
        assertEquals("{\"aliveCells\":[]}", run("{\"aliveCells\": [[0,0]]}"));
    }

    @Test
    void zeroStepsEchoesSortedInput() {
        assertEquals("{\"aliveCells\":[[0,1],[1,0]]}",
                run("{\"aliveCells\": [[1,0],[0,1]], \"steps\": 0}"));
    }

    private String run(String input) {
        java.io.InputStream originalIn = System.in;
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
}
