import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/** Translates between the JSON wire format and the Game of Life domain. */
final class GenerationJson {

    private static final String ALIVE_CELLS = "aliveCells";
    private static final String STEPS = "steps";

    private final ObjectMapper mapper = new ObjectMapper();

    JsonNode readRequest(InputStream source) throws IOException {
        return mapper.readTree(source);
    }

    int readSteps(JsonNode request) {
        return request.get(STEPS).asInt();
    }

    Set<Cell> readAliveCells(JsonNode request) {
        Set<Cell> cells = new LinkedHashSet<>();
        for (JsonNode cell : request.get(ALIVE_CELLS)) {
            cells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt()));
        }
        return cells;
    }

    String writeAliveCells(Set<Cell> cells) throws IOException {
        ObjectNode response = mapper.createObjectNode();
        ArrayNode aliveCells = response.putArray(ALIVE_CELLS);
        for (Cell cell : inEmissionOrder(cells)) {
            ArrayNode pair = aliveCells.addArray();
            pair.add(cell.x());
            pair.add(cell.y());
        }
        return mapper.writeValueAsString(response);
    }

    private List<Cell> inEmissionOrder(Set<Cell> cells) {
        return cells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .toList();
    }
}
