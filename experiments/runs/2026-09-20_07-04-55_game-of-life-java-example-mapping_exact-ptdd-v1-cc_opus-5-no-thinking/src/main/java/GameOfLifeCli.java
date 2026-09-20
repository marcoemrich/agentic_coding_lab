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

public final class GameOfLifeCli {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        JsonNode request = MAPPER.readTree(System.in);
        Set<Cell> livingCells = readAliveCells(request);
        int steps = request.path("steps").asInt(1);

        System.out.print(MAPPER.writeValueAsString(writeAliveCells(advance(livingCells, steps))));
    }

    private static Set<Cell> advance(Set<Cell> livingCells, int steps) {
        GameOfLife gameOfLife = new GameOfLife();
        Set<Cell> generation = livingCells;
        for (int step = 0; step < steps; step++) {
            generation = gameOfLife.nextGeneration(generation);
        }
        return generation;
    }

    private static Set<Cell> readAliveCells(JsonNode request) {
        Set<Cell> livingCells = new LinkedHashSet<>();
        for (JsonNode cell : request.path("aliveCells")) {
            livingCells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt()));
        }
        return livingCells;
    }

    private static ObjectNode writeAliveCells(Set<Cell> livingCells) {
        ObjectNode response = MAPPER.createObjectNode();
        ArrayNode cells = response.putArray("aliveCells");
        for (Cell cell : inReadingOrder(livingCells)) {
            cells.addArray().add(cell.x()).add(cell.y());
        }
        return response;
    }

    private static List<Cell> inReadingOrder(Set<Cell> livingCells) {
        return livingCells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .toList();
    }
}
