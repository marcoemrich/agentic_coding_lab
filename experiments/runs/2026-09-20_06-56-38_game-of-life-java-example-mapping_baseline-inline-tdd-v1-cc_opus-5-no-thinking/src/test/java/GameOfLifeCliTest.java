import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

    private String run(String input) throws Exception {
        java.io.InputStream originalIn = System.in;
        PrintStream originalOut = System.out;
        ByteArrayOutputStream captured = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(captured, true, StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }
        return captured.toString(StandardCharsets.UTF_8).trim();
    }

    @Test
    void advancesBlinkerOneStepSorted() throws Exception {
        assertEquals("{\"aliveCells\":[[-1,1],[0,1],[1,1]]}",
                run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 1}"));
    }

    @Test
    void appliesMultipleSteps() throws Exception {
        assertEquals("{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
                run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 2}"));
    }

    @Test
    void emptyInputStaysEmpty() throws Exception {
        assertEquals("{\"aliveCells\":[]}", run("{\"aliveCells\": [], \"steps\": 1}"));
    }

    @Test
    void missingStepsDefaultsToOneStep() throws Exception {
        assertEquals("{\"aliveCells\":[]}", run("{\"aliveCells\": [[0, 0]]}"));
    }

    @Test
    void sortsByXThenY() throws Exception {
        assertEquals("{\"aliveCells\":[[0,0],[0,1],[1,0],[1,1]]}",
                run("{\"aliveCells\": [[1, 1], [0, 1], [1, 0], [0, 0]], \"steps\": 1}"));
    }
}
