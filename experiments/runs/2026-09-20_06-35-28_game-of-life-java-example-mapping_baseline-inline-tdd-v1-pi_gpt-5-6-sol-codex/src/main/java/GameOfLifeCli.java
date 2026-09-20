import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** JSON standard-input/standard-output entry point for the Game of Life. */
public final class GameOfLifeCli {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final Comparator<Cell> CELL_ORDER = Comparator
            .comparingInt(Cell::x)
            .thenComparingInt(Cell::y);

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        JsonNode request = JSON.readTree(System.in);
        Set<Cell> cells = readCells(request);
        int steps = readSteps(request);

        GameOfLife game = new GameOfLife();
        for (int step = 0; step < steps; step++) {
            cells = game.nextGeneration(cells);
        }

        List<int[]> coordinates = cells.stream()
                .sorted(CELL_ORDER)
                .map(cell -> new int[] {cell.x(), cell.y()})
                .toList();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("aliveCells", coordinates);
        JSON.writeValue(System.out, response);
    }

    private static Set<Cell> readCells(JsonNode request) {
        if (request == null || !request.isObject()) {
            throw new IllegalArgumentException("input must be a JSON object");
        }
        JsonNode coordinates = request.get("aliveCells");
        if (coordinates == null || !coordinates.isArray()) {
            throw new IllegalArgumentException("aliveCells must be an array");
        }

        List<Cell> cells = new ArrayList<>();
        for (JsonNode coordinate : coordinates) {
            if (!coordinate.isArray() || coordinate.size() != 2
                    || !isInt(coordinate.get(0)) || !isInt(coordinate.get(1))) {
                throw new IllegalArgumentException(
                        "each aliveCells entry must contain two integers");
            }
            cells.add(new Cell(coordinate.get(0).intValue(), coordinate.get(1).intValue()));
        }
        return Set.copyOf(cells);
    }

    private static int readSteps(JsonNode request) {
        JsonNode steps = request.get("steps");
        if (!isInt(steps) || steps.intValue() < 0) {
            throw new IllegalArgumentException("steps must be a non-negative integer");
        }
        return steps.intValue();
    }

    private static boolean isInt(JsonNode value) {
        return value != null && value.isIntegralNumber() && value.canConvertToInt();
    }
}
