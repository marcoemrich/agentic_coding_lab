import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

    @Test
    void writesEmptyAliveCellsWhenEverythingDies() {
        assertEquals("{\"aliveCells\":[]}", run("{\"aliveCells\": [[0, 0]], \"steps\": 1}"));
    }

    @Test
    void appliesOneGeneration() {
        String output = run("{\"aliveCells\": [[0, 0], [1, 0], [0, 1], [1, 1]], \"steps\": 1}");

        assertEquals("{\"aliveCells\":[[0,0],[0,1],[1,0],[1,1]]}", output);
    }

    @Test
    void sortsEmittedCellsByXThenY() {
        // Two 2x2 blocks, at the origin and at (5, 5), fed in scrambled order. Blocks are
        // still lifes, so all eight cells survive and the output differs from the input
        // only by the emitted order, spanning four distinct x groups.
        String output = run("{\"aliveCells\": ["
                + "[6, 6], [1, 1], [5, 5], [0, 0], [6, 5], [1, 0], [5, 6], [0, 1]"
                + "], \"steps\": 1}");

        assertEquals("{\"aliveCells\":"
                + "[[0,0],[0,1],[1,0],[1,1],[5,5],[5,6],[6,5],[6,6]]}", output);
    }

    @Test
    void appliesNextGenerationStepsTimes() {
        String output = run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 2}");

        assertEquals("{\"aliveCells\":[[0,0],[0,1],[0,2]]}", output);
    }

    @Test
    void writesNothingElseToStandardOutput() throws Exception {
        InputStream originalIn = System.in;
        PrintStream originalOut = System.out;
        ByteArrayOutputStream captured = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(
                    "{\"aliveCells\": [[0, 0]], \"steps\": 1}".getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(captured, true, StandardCharsets.UTF_8));

            GameOfLifeCli.main(new String[0]);
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }

        assertEquals("{\"aliveCells\":[]}", captured.toString(StandardCharsets.UTF_8));
    }

    private static String run(String input) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        new GameOfLifeCli().run(
                new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)), output);
        return output.toString(StandardCharsets.UTF_8);
    }
}
