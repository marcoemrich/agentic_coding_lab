import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

    @Test
    void writesEmptyAliveCellsWhenEverythingDies() {
        assertEquals("{\"aliveCells\":[]}", run("{\"aliveCells\": [[0, 0]], \"steps\": 1}"));
    }

    private static String run(String input) {
        return runCapturingRawOutput(input).trim();
    }

    @Test
    void writesNextGenerationForOneStep() {
        String response = run("{\"aliveCells\": [[0, 0], [1, 0], [0, 1], [1, 1]], \"steps\": 1}");

        assertEquals(
                Set.of(List.of(0, 0), List.of(1, 0), List.of(0, 1), List.of(1, 1)),
                aliveCellsIn(response));
    }

    private static Set<List<Integer>> aliveCellsIn(String response) {
        try {
            Set<List<Integer>> cells = new HashSet<>();
            for (JsonNode cell : new ObjectMapper().readTree(response).get("aliveCells")) {
                cells.add(List.of(cell.get(0).asInt(), cell.get(1).asInt()));
            }
            return cells;
        } catch (Exception e) {
            throw new IllegalStateException("not a valid response: " + response, e);
        }
    }

    @Test
    void emitsCellsSortedByXThenY() {
        assertEquals(
                "{\"aliveCells\":[[-1,1],[0,1],[1,1]]}",
                run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 1}"));
    }

    @Test
    void appliesNextGenerationStepsTimes() {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
                run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 2}"));
    }

    @Test
    void writesInputGenerationWhenStepsIsZero() {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
                run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 0}"));
    }

    @Test
    void writesOnlyOneJsonObjectToStdout() {
        String stdout = runCapturingRawOutput(
                "{\"aliveCells\": [[0, 0], [1, 0], [0, 1]], \"steps\": 1}");

        assertEquals("{\"aliveCells\":[[0,0],[0,1],[1,0],[1,1]]}", stdout);
    }

    private static String runCapturingRawOutput(String input) {
        ByteArrayOutputStream captured = new ByteArrayOutputStream();
        new GameOfLifeCli().run(
                new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)),
                new PrintStream(captured, true, StandardCharsets.UTF_8));
        return captured.toString(StandardCharsets.UTF_8);
    }
}
