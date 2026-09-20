import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gameoflife.Cell;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * The JSON wire format of the Game of Life CLI: the {@code aliveCells} field
 * and the {@code [x, y]} encoding of a single cell.
 */
final class GenerationJson {

    private static final String ALIVE_CELLS = "aliveCells";

    private static final String STEPS = "steps";

    private final ObjectMapper mapper = new ObjectMapper();

    GenerationRequest readRequest(InputStream request) throws IOException {
        JsonNode root = mapper.readTree(request);
        Set<Cell> livingCells = new HashSet<>();
        for (JsonNode cell : root.get(ALIVE_CELLS)) {
            livingCells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt()));
        }
        return new GenerationRequest(livingCells, root.get(STEPS).asInt());
    }

    String writeLivingCells(Set<Cell> livingCells) throws IOException {
        ObjectNode response = mapper.createObjectNode();
        ArrayNode aliveCells = response.putArray(ALIVE_CELLS);
        for (Cell cell : sortedByXThenY(livingCells)) {
            ArrayNode coordinates = aliveCells.addArray();
            coordinates.add(cell.x());
            coordinates.add(cell.y());
        }
        return mapper.writeValueAsString(response);
    }

    private static List<Cell> sortedByXThenY(Set<Cell> livingCells) {
        List<Cell> sorted = new ArrayList<>(livingCells);
        sorted.sort(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y));
        return sorted;
    }
}
