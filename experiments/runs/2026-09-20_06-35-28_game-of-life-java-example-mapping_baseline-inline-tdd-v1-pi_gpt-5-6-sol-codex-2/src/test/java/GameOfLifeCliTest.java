import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {
    @Test
    void appliesStepsAndWritesSortedJson() throws Exception {
        assertEquals("{\"aliveCells\":[[-1,1],[0,1],[1,1]]}", runCli(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":1}"));
    }

    @Test
    void supportsZeroStepsAndSortsByXThenY() throws Exception {
        assertEquals("{\"aliveCells\":[[-2,3],[0,-1],[0,2]]}", runCli(
                "{\"aliveCells\":[[0,2],[-2,3],[0,-1]],\"steps\":0}"));
    }

    @Test
    void appliesMultipleSteps() throws Exception {
        assertEquals("{\"aliveCells\":[[0,0],[0,1],[0,2]]}", runCli(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":2}"));
    }

    private String runCli(String input) throws Exception {
        var originalIn = System.in;
        var originalOut = System.out;
        var output = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(output, true, StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }
        return output.toString(StandardCharsets.UTF_8);
    }
}
