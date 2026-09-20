import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GameOfLifeCliTest {
    @Test
    void appliesSpecifiedJsonRequest() throws IOException {
        assertEquals("{\"aliveCells\":[]}", runCli(
                "{\"aliveCells\":[[0,0],[1,0]],\"steps\":1}"));
    }

    private String runCli(String json) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        GameOfLifeCli.run(new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8)), output);
        return output.toString(StandardCharsets.UTF_8);
    }

    private Set<String> aliveCells(String json) throws IOException {
        Set<String> coordinates = new HashSet<>();
        JsonNode cells = new ObjectMapper().readTree(json).get("aliveCells");
        cells.forEach(cell -> coordinates.add(cell.toString()));
        return coordinates;
    }

    @Test
    void appliesMultipleSteps() throws IOException {
        String output = runCli(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":2}");
        assertEquals(Set.of("[0,0]", "[0,1]", "[0,2]"), aliveCells(output));
    }

    @Test
    void sortsOutputByXThenY() throws IOException {
        assertEquals("{\"aliveCells\":[[-1,5],[0,0],[1,-1],[1,2]]}", runCli(
                "{\"aliveCells\":[[1,2],[-1,5],[1,-1],[0,0]],\"steps\":0}"));
    }
}
