import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

    @Test
    void emptyInputProducesEmptyOutput() {
        assertEquals("{\"aliveCells\":[]}", run("{\"aliveCells\": [], \"steps\": 1}"));
    }

    private static String run(String stdin) {
        InputStream originalIn = System.in;
        PrintStream originalOut = System.out;
        ByteArrayOutputStream captured = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(stdin.getBytes(StandardCharsets.UTF_8)));
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

    @Test
    void appliesOneGenerationToTheGivenCells() {
        assertEquals(
                "{\"aliveCells\":[]}", run("{\"aliveCells\": [[0, 0], [1, 0]], \"steps\": 1}"));
    }

    @Test
    void emitsCellsSortedByXThenY() {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[1,0],[1,1]]}",
                run("{\"aliveCells\": [[1, 1], [0, 1], [1, 0], [0, 0]], \"steps\": 1}"));
    }

    @Test
    void appliesNextGenerationStepsTimes() {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
                run("{\"aliveCells\": [[0, 0], [0, 1], [0, 2]], \"steps\": 2}"));
    }

    @Test
    void zeroStepsReturnsInputUnchanged() {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
                run("{\"aliveCells\": [[0, 2], [0, 0], [0, 1]], \"steps\": 0}"));
    }

    @Test
    void writesOnlyTheSingleJsonObjectToStdout() throws IOException {
        String stdout = run("{\"aliveCells\": [[0, 0], [1, 0], [0, 1]], \"steps\": 1}");

        JsonNode emitted = new ObjectMapper().readTree(stdout);
        assertTrue(emitted.isObject());
        List<String> fieldNames = new ArrayList<>();
        emitted.fieldNames().forEachRemaining(fieldNames::add);
        assertEquals(List.of("aliveCells"), fieldNames);
        assertEquals("{\"aliveCells\":[[0,0],[0,1],[1,0],[1,1]]}", stdout);
    }
}
