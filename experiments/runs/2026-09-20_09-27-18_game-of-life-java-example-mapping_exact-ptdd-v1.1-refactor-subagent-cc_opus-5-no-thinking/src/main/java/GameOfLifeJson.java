import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;

/**
 * Translates between the external JSON representation and the domain's cells.
 * Sole owner of the wire format.
 */
public final class GameOfLifeJson {

    private static final ObjectMapper JSON = new ObjectMapper();

    /** The order cells appear in on the wire: by column, then by row within a column. */
    private static final Comparator<Cell> WIRE_ORDER =
            Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y);

    private GameOfLifeJson() {
    }

    public static GenerationRequest readRequest(InputStream source) throws IOException {
        JsonNode request = JSON.readTree(source);
        return new GenerationRequest(
                readLivingCells(request.get("aliveCells")),
                request.get("steps").asInt());
    }

    public static String writeColony(Set<Cell> livingCells) {
        ObjectNode response = JSON.createObjectNode();
        ArrayNode aliveCells = response.putArray("aliveCells");
        livingCells.stream()
                .sorted(WIRE_ORDER)
                .forEach(cell -> aliveCells.addArray().add(cell.x()).add(cell.y()));
        return response.toString();
    }

    private static Set<Cell> readLivingCells(JsonNode aliveCells) {
        Set<Cell> livingCells = new HashSet<>();
        for (JsonNode cell : aliveCells) {
            livingCells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt()));
        }
        return livingCells;
    }
}
