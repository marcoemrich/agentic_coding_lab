import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gol.Cell;
import gol.GameOfLife;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public final class GameOfLifeCli {

    private static final String ALIVE_CELLS = "aliveCells";
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        JsonNode request = MAPPER.readTree(System.in);
        Set<Cell> cells = readCells(request.get(ALIVE_CELLS));
        for (int step = 0; step < steps(request); step++) {
            cells = GameOfLife.nextGeneration(cells);
        }
        System.out.print(MAPPER.writeValueAsString(toJson(cells)));
    }

    private static int steps(JsonNode request) {
        JsonNode steps = request.get("steps");
        return steps == null || steps.isNull() ? 1 : steps.asInt();
    }

    private static Set<Cell> readCells(JsonNode aliveCells) {
        if (aliveCells == null || aliveCells.isNull()) {
            return Set.of();
        }
        return StreamSupport.stream(aliveCells.spliterator(), false)
                .map(cell -> new Cell(cell.get(0).asInt(), cell.get(1).asInt()))
                .collect(Collectors.toUnmodifiableSet());
    }

    private static ObjectNode toJson(Set<Cell> cells) {
        List<Cell> sorted = cells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .toList();
        ObjectNode response = MAPPER.createObjectNode();
        ArrayNode array = response.putArray(ALIVE_CELLS);
        sorted.forEach(cell -> array.addArray().add(cell.x()).add(cell.y()));
        return response;
    }
}
