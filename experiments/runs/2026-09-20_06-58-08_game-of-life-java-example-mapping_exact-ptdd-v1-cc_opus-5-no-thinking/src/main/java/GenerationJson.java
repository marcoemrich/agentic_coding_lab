import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.Set;

/** Translates between the JSON wire format and the game's living cells. */
final class GenerationJson {

    private static final ObjectMapper JSON = new ObjectMapper();

    private final JsonNode request;

    private GenerationJson(JsonNode request) {
        this.request = request;
    }

    static GenerationJson readRequest(InputStream source) throws IOException {
        return new GenerationJson(JSON.readTree(source));
    }

    Set<Cell> livingCells() {
        Set<Cell> livingCells = new LinkedHashSet<>();
        for (JsonNode cell : request.get("aliveCells")) {
            livingCells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt()));
        }
        return livingCells;
    }

    int steps() {
        return request.get("steps").asInt();
    }

    static String writeGeneration(Set<Cell> livingCells) throws IOException {
        ArrayNode aliveCells = JSON.createArrayNode();
        livingCells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .forEach(cell -> aliveCells.add(JSON.createArrayNode().add(cell.x()).add(cell.y())));
        ObjectNode response = JSON.createObjectNode();
        response.set("aliveCells", aliveCells);
        return JSON.writeValueAsString(response);
    }
}
