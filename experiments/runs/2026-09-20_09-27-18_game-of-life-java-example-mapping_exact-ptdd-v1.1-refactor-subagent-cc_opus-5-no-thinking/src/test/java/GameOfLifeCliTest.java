import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

    @Test
    void writesEmptyResultForDyingPair() {
        assertEquals(
                "{\"aliveCells\":[]}",
                runCli("{\"aliveCells\": [[0, 0], [1, 0]], \"steps\": 1}"));
    }

    @Test
    void appliesNextGenerationStepsTimes() {
        String output = runCli("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 2}");

        assertEquals(Set.of(List.of(0, 0), List.of(0, 1), List.of(0, 2)), emittedCells(output));
    }

    @Test
    void emitsCellsSortedByXThenY() {
        assertEquals(
                "{\"aliveCells\":[[-1,1],[0,1],[1,1]]}",
                runCli("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 1}"));
    }

    @Test
    void stepsZeroEchoesInputSorted() {
        assertEquals(
                "{\"aliveCells\":[[0,0],[1,1]]}",
                runCli("{\"aliveCells\": [[1, 1], [0, 0]], \"steps\": 0}"));
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

    private static Set<List<Integer>> emittedCells(String output) {
        try {
            JsonNode aliveCells = new ObjectMapper().readTree(output).get("aliveCells");
            Set<List<Integer>> cells = new HashSet<>();
            for (JsonNode cell : aliveCells) {
                cells.add(List.of(cell.get(0).asInt(), cell.get(1).asInt()));
            }
            return cells;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
