import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {
    @Test
    void appliesOneStepAndWritesJsonOnly() throws Exception {
        assertEquals("{\"aliveCells\":[]}", runCli(
                "{\"aliveCells\":[[0,0]],\"steps\":1}"));
    }

    @Test
    void sortsCellsByXThenY() throws Exception {
        assertEquals("{\"aliveCells\":[[-1,2],[0,-3],[0,1],[2,0]]}", runCli(
                "{\"aliveCells\":[[2,0],[0,1],[-1,2],[0,-3]],\"steps\":0}"));
    }

    @Test
    void appliesMultipleSteps() throws Exception {
        assertEquals("{\"aliveCells\":[[0,0],[0,1],[0,2]]}", runCli(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":2}"));
    }

    private static String runCli(String input) throws Exception {
        InputStream originalIn = System.in;
        PrintStream originalOut = System.out;
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(output, true, StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
            return output.toString(StandardCharsets.UTF_8).trim();
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }
    }
}
