import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.Set;

public final class GameOfLifeCli {

    private static final ObjectMapper JSON = new ObjectMapper();

    private static final Comparator<Cell> BY_X_THEN_Y =
            Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y);

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        JsonNode request = JSON.readTree(System.in);

        Set<Cell> nextGeneration = advance(readAliveCells(request), request.path("steps").asInt(0));

        System.out.print(JSON.writeValueAsString(writeAliveCells(nextGeneration)));
    }

    private static Set<Cell> advance(Set<Cell> aliveCells, int steps) {
        GameOfLife gameOfLife = new GameOfLife();
        Set<Cell> generation = aliveCells;
        for (int step = 0; step < steps; step++) {
            generation = gameOfLife.nextGeneration(generation);
        }
        return generation;
    }

    private static Set<Cell> readAliveCells(JsonNode request) {
        Set<Cell> aliveCells = new LinkedHashSet<>();
        for (JsonNode cell : request.path("aliveCells")) {
            aliveCells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt()));
        }
        return aliveCells;
    }

    private static ObjectNode writeAliveCells(Set<Cell> aliveCells) {
        ObjectNode response = JSON.createObjectNode();
        ArrayNode cells = response.putArray("aliveCells");
        aliveCells.stream()
                .sorted(BY_X_THEN_Y)
                .forEach(cell -> cells.addArray().add(cell.x()).add(cell.y()));
        return response;
    }
}
