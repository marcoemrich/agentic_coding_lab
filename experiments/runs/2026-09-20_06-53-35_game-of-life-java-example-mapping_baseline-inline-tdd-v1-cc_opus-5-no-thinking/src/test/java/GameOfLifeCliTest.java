import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

    private String run(String input) throws Exception {
        InputStreamSwap swap = new InputStreamSwap(input);
        try {
            GameOfLifeCli.main(new String[0]);
        } finally {
            swap.restore();
        }
        return swap.output();
    }

    private static final class InputStreamSwap {
        private final java.io.InputStream originalIn = System.in;
        private final PrintStream originalOut = System.out;
        private final ByteArrayOutputStream captured = new ByteArrayOutputStream();

        InputStreamSwap(String input) {
            System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(captured, true, StandardCharsets.UTF_8));
        }

        void restore() {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }

        String output() {
            return captured.toString(StandardCharsets.UTF_8).trim();
        }
    }

    @Test
    void advancesBlockByOneStep() throws Exception {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[1,0],[1,1]]}",
                run("{\"aliveCells\": [[0,0],[1,0],[0,1],[1,1]], \"steps\": 1}"));
    }

    @Test
    void advancesBlinkerByTwoStepsSortedByXThenY() throws Exception {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
                run("{\"aliveCells\": [[0,0],[0,1],[0,2]], \"steps\": 2}"));
    }

    @Test
    void emitsEmptyListForDyingSingleCell() throws Exception {
        assertEquals("{\"aliveCells\":[]}", run("{\"aliveCells\": [[0,0]], \"steps\": 1}"));
    }

    @Test
    void defaultsToOneStepWhenStepsMissing() throws Exception {
        assertEquals("{\"aliveCells\":[]}", run("{\"aliveCells\": [[0,0]]}"));
    }
}
