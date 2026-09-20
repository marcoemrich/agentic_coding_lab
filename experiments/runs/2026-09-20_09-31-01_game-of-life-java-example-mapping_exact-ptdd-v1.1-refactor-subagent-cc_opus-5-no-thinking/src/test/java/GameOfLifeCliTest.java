import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeCliTest {

    @Test
    void writesEmptyAliveCellsWhenAllCellsDie() throws Exception {
        assertEquals(json("{'aliveCells':[]}"),
                runCliWith(json("{'aliveCells':[[0,0]],'steps':1}")));
    }

    @Test
    void appliesOneGenerationAndSortsByXThenY() throws Exception {
        assertEquals(json("{'aliveCells':[[0,0],[0,1],[1,0],[1,1]]}"),
                runCliWith(json("{'aliveCells':[[0,0],[1,0],[0,1]],'steps':1}")));
    }

    @Test
    void appliesNextGenerationStepsTimes() throws Exception {
        assertEquals(json("{'aliveCells':[[0,0],[0,1],[0,2]]}"),
                runCliWith(json("{'aliveCells':[[0,0],[0,1],[0,2]],'steps':2}")));
    }

    @Test
    void stepsZeroEmitsInputSorted() throws Exception {
        assertEquals(json("{'aliveCells':[[0,0],[1,0]]}"),
                runCliWith(json("{'aliveCells':[[1,0],[0,0]],'steps':0}")));
    }

    @Test
    void writesOnlyOneJsonObjectToStdout() throws Exception {
        String stdout = runCliWith(json("{'aliveCells':[[0,0],[1,0],[0,1]],'steps':1}"));

        JsonNode response = new ObjectMapper().readTree(stdout);
        assertEquals(1, response.size());
        assertTrue(response.has("aliveCells"));
        assertEquals(stdout, response.toString());
    }

    @Test
    void sortsNegativeCoordinatesByXThenY() throws Exception {
        assertEquals(json("{'aliveCells':[[-1,-5],[-1,5],[1,-1]]}"),
                runCliWith(json("{'aliveCells':[[1,-1],[-1,5],[-1,-5]],'steps':0}")));
    }

    /** Reads the example's single-quoted JSON as the double-quoted JSON the CLI speaks. */
    private static String json(String singleQuoted) {
        return singleQuoted.replace('\'', '"');
    }

    /** Runs the CLI with the request on stdin and returns everything it wrote to stdout. */
    private static String runCliWith(String request) throws Exception {
        InputStream originalIn = System.in;
        PrintStream originalOut = System.out;
        ByteArrayOutputStream captured = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(request.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(captured, true, StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }
        return captured.toString(StandardCharsets.UTF_8).trim();
    }
}
