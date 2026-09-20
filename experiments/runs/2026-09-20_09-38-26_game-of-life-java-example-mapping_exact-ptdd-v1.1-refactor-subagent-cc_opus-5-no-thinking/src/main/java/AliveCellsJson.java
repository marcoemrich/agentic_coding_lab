import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gameoflife.Cell;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Translates between the CLI's JSON wire representation and living cells.
 * Owns the "aliveCells" key, the [x, y] pair encoding, and the emitted cell order.
 */
class AliveCellsJson {

    private static final String ALIVE_CELLS = "aliveCells";

    private static final String STEPS = "steps";

    private static final Comparator<Cell> EMITTED_ORDER =
            Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y);

    private final ObjectMapper objectMapper = new ObjectMapper();

    GenerationRequest readRequest(InputStream input) throws IOException {
        JsonNode request = objectMapper.readTree(input);
        Set<Cell> aliveCells = new LinkedHashSet<>();
        for (JsonNode cell : request.get(ALIVE_CELLS)) {
            aliveCells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt()));
        }
        return new GenerationRequest(aliveCells, request.get(STEPS).asInt());
    }

    void writeAliveCells(OutputStream output, Set<Cell> aliveCells) throws IOException {
        ObjectNode response = objectMapper.createObjectNode();
        ArrayNode cells = response.putArray(ALIVE_CELLS);
        aliveCells.stream()
                .sorted(EMITTED_ORDER)
                .forEach(cell -> cells.addArray().add(cell.x()).add(cell.y()));
        objectMapper.writeValue(output, response);
    }
}
