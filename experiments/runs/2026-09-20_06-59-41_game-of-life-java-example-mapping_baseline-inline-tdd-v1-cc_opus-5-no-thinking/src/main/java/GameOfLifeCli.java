import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gameoflife.Cell;
import gameoflife.GameOfLife;
import java.io.IOException;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public final class GameOfLifeCli {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        JsonNode request = MAPPER.readTree(System.in);
        Set<Cell> cells = readCells(request.path("aliveCells"));
        int steps = request.path("steps").asInt(1);
        for (int step = 0; step < steps; step++) {
            cells = GameOfLife.nextGeneration(cells);
        }
        System.out.print(MAPPER.writeValueAsString(toJson(cells)));
    }

    private static Set<Cell> readCells(JsonNode aliveCells) {
        Set<Cell> cells = new HashSet<>();
        aliveCells.forEach(cell -> cells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt())));
        return cells;
    }

    private static ObjectNode toJson(Set<Cell> cells) {
        List<Cell> sorted = cells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .toList();
        ObjectNode result = MAPPER.createObjectNode();
        ArrayNode array = result.putArray("aliveCells");
        sorted.forEach(cell -> array.addArray().add(cell.x()).add(cell.y()));
        return result;
    }
}
