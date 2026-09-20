import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

    private static String run(String input) throws Exception {
        InputStream originalIn = System.in;
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

    /**
     * The emitted cells as an order-independent set, so that a test about which cells are
     * emitted does not also re-pin the emission order owned by {@link
     * #cliEmitsCellsSortedByXThenY()}.
     */
    private static Set<String> emittedCells(String input) throws Exception {
        Set<String> cells = new LinkedHashSet<>();
        for (JsonNode cell : new ObjectMapper().readTree(run(input)).get("aliveCells")) {
            cells.add(cell.toString());
        }
        return cells;
    }

    @Test
    void cliWritesEmptyAliveCellsWhenEverythingDies() throws Exception {
        assertEquals("{\"aliveCells\":[]}", run("{\"aliveCells\": [[0, 0]], \"steps\": 1}"));
    }

    @Test
    void cliAppliesOneGeneration() throws Exception {
        assertEquals(
                Set.of("[0,0]", "[1,0]", "[0,1]", "[1,1]"),
                emittedCells("{\"aliveCells\": [[0, 0], [1, 0], [0, 1]], \"steps\": 1}"));
    }

    @Test
    void cliEmitsCellsSortedByXThenY() throws Exception {
        assertEquals(
                "{\"aliveCells\":[[-1,1],[0,1],[1,1]]}",
                run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 1}"));
    }

    @Test
    void cliAppliesTheRequestedNumberOfSteps() throws Exception {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
                run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 2}"));
    }

    @Test
    void cliWithZeroStepsEchoesTheSortedInput() throws Exception {
        assertEquals(
                "{\"aliveCells\":[[0,0],[1,1]]}",
                run("{\"aliveCells\": [[1, 1], [0, 0]], \"steps\": 0}"));
    }
}
