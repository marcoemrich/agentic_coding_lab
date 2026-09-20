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
        JsonNode input = MAPPER.readTree(System.in);
        Set<Cell> aliveCells = readCells(input.path("aliveCells"));
        int steps = input.path("steps").asInt(1);

        for (int step = 0; step < steps; step++) {
            aliveCells = GameOfLife.nextGeneration(aliveCells);
        }

        System.out.println(MAPPER.writeValueAsString(writeCells(aliveCells)));
    }

    private static Set<Cell> readCells(JsonNode node) {
        Set<Cell> cells = new HashSet<>();
        for (JsonNode cell : node) {
            cells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt()));
        }
        return cells;
    }

    private static ObjectNode writeCells(Set<Cell> aliveCells) {
        List<Cell> sorted = aliveCells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .toList();

        ObjectNode result = MAPPER.createObjectNode();
        ArrayNode array = result.putArray("aliveCells");
        for (Cell cell : sorted) {
            array.add(MAPPER.createArrayNode().add(cell.x()).add(cell.y()));
        }
        return result;
    }
}
