import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GameOfLifeCliTest {
    @Test
    void appliesOneStepFromJson() throws Exception {
        assertEquals("{\"aliveCells\":[]}", runCli(
                "{\"aliveCells\":[[0,0],[1,0]],\"steps\":1}"));
    }

    private String runCli(String json) throws Exception {
        InputStream originalInput = System.in;
        PrintStream originalOutput = System.out;
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(output, true, StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
            return output.toString(StandardCharsets.UTF_8);
        } finally {
            System.setIn(originalInput);
            System.setOut(originalOutput);
        }
    }

    @Test
    void sortsOutputCellsByXThenY() throws Exception {
        String input = "{\"aliveCells\":[[1,1],[0,1],[1,0],[0,0]],\"steps\":0}";
        assertEquals("{\"aliveCells\":[[0,0],[0,1],[1,0],[1,1]]}", runCli(input));
    }

    @Test
    void appliesRequestedNumberOfSteps() throws Exception {
        String input = "{\"aliveCells\":[[0,2],[0,0],[0,1]],\"steps\":2}";
        assertEquals("{\"aliveCells\":[[0,0],[0,1],[0,2]]}", runCli(input));
    }
}
