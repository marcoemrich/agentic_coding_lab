import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gameoflife.Cell;
import gameoflife.GameOfLife;
import java.io.IOException;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class GameOfLifeCli {

    private static final String ALIVE_CELLS = "aliveCells";
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        JsonNode request = MAPPER.readTree(System.in);
        Set<Cell> cells = readCells(request.path(ALIVE_CELLS));
        int steps = request.path("steps").asInt(1);
        GameOfLife game = new GameOfLife();
        for (int step = 0; step < steps; step++) {
            cells = game.nextGeneration(cells);
        }
        System.out.print(MAPPER.writeValueAsString(toJson(cells)));
    }

    private static Set<Cell> readCells(JsonNode aliveCells) {
        Set<Cell> cells = new LinkedHashSet<>();
        for (JsonNode cell : aliveCells) {
            cells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt()));
        }
        return cells;
    }

    private static ObjectNode toJson(Set<Cell> cells) {
        List<Cell> sorted = cells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .collect(Collectors.toList());
        ObjectNode root = MAPPER.createObjectNode();
        ArrayNode array = root.putArray(ALIVE_CELLS);
        for (Cell cell : sorted) {
            array.addArray().add(cell.x()).add(cell.y());
        }
        return root;
    }
}
