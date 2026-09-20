import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GameOfLifeCliTest {
    @Test
    void appliesOneStepFromJson() throws Exception {
        assertEquals("{\"aliveCells\":[]}", runCli(
                "{\"aliveCells\":[[0,0],[1,0]],\"steps\":1}"));
    }

    @Test
    void appliesMultipleStepsAndSortsOutput() throws Exception {
        assertEquals("{\"aliveCells\":[[-1,1],[0,1],[1,1]]}", runCli(
                "{\"aliveCells\":[[1,1],[-1,1],[0,1]],\"steps\":2}"));
    }

    private String runCli(String input) throws Exception {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        GameOfLifeCli.run(
                new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)), output);
        return output.toString(StandardCharsets.UTF_8);
    }

    @Test
    void zeroStepsSortsUnchangedCells() throws Exception {
        assertEquals("{\"aliveCells\":[[-1,4],[0,0],[2,-2],[2,-1]]}", runCli(
                "{\"aliveCells\":[[2,-1],[-1,4],[2,-2],[0,0]],\"steps\":0}"));
    }
}
