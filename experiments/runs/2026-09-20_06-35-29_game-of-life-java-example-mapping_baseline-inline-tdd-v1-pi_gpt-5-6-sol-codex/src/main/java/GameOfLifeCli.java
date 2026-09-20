import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;

public final class GameOfLifeCli {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        run(System.in, System.out);
    }

    public static void run(InputStream input, OutputStream output) throws IOException {
        JsonNode request = MAPPER.readTree(input);
        if (request == null || !request.isObject()) {
            throw new IllegalArgumentException("input must be a JSON object");
        }

        Set<Cell> cells = readCells(request.get("aliveCells"));
        int steps = readSteps(request.get("steps"));
        GameOfLife game = new GameOfLife();
        for (int step = 0; step < steps; step++) {
            cells = game.nextGeneration(cells);
        }

        ObjectNode response = MAPPER.createObjectNode();
        ArrayNode aliveCells = response.putArray("aliveCells");
        cells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .forEach(cell -> aliveCells.addArray().add(cell.x()).add(cell.y()));
        MAPPER.writeValue(output, response);
    }

    private static Set<Cell> readCells(JsonNode node) {
        if (node == null || !node.isArray()) {
            throw new IllegalArgumentException("aliveCells must be an array");
        }
        Set<Cell> cells = new HashSet<>();
        for (JsonNode coordinates : node) {
            if (!coordinates.isArray() || coordinates.size() != 2
                    || !coordinates.get(0).isInt() || !coordinates.get(1).isInt()) {
                throw new IllegalArgumentException("each cell must contain two integer coordinates");
            }
            cells.add(new Cell(coordinates.get(0).intValue(), coordinates.get(1).intValue()));
        }
        return cells;
    }

    private static int readSteps(JsonNode node) {
        if (node == null || !node.isInt() || node.intValue() < 0) {
            throw new IllegalArgumentException("steps must be a non-negative integer");
        }
        return node.intValue();
    }
}
