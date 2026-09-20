import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** JSON command-line adapter for {@link GameOfLife}. */
public final class GameOfLifeCli {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private GameOfLifeCli() {
    }

    /** Reads a generation request from standard input and writes its result. */
    public static void main(String[] args) throws IOException {
        JsonNode request = MAPPER.readTree(System.in);
        Set<Cell> aliveCells = readCells(request.path("aliveCells"));
        int steps = request.path("steps").asInt();
        GameOfLife game = new GameOfLife();

        for (int step = 0; step < steps; step++) {
            aliveCells = game.nextGeneration(aliveCells);
        }

        List<Cell> sorted = new ArrayList<>(aliveCells);
        sorted.sort(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y));
        List<int[]> coordinates = sorted.stream()
                .map(cell -> new int[] {cell.x(), cell.y()})
                .toList();
        MAPPER.writeValue(System.out, new Response(coordinates));
    }

    private static Set<Cell> readCells(JsonNode coordinates) {
        Set<Cell> cells = new HashSet<>();
        for (JsonNode coordinate : coordinates) {
            cells.add(new Cell(coordinate.get(0).asInt(), coordinate.get(1).asInt()));
        }
        return cells;
    }

    private record Response(List<int[]> aliveCells) {
    }
}
