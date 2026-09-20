import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {
    @Test
    void appliesStepsAndWritesCellsSortedByXThenY() throws Exception {
        assertEquals(
                "{\"aliveCells\":[[-1,1],[0,1],[1,1]]}",
                execute("{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":1}"));
    }

    @Test
    void appliesMoreThanOneStep() throws Exception {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
                execute("{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":2}"));
    }

    @Test
    void writesAnEmptyGeneration() throws Exception {
        assertEquals(
                "{\"aliveCells\":[]}",
                execute("{\"aliveCells\":[[0,0]],\"steps\":1}"));
    }

    private String execute(String input) throws Exception {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        GameOfLifeCli.run(
                new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)), output);
        return output.toString(StandardCharsets.UTF_8);
    }
}
