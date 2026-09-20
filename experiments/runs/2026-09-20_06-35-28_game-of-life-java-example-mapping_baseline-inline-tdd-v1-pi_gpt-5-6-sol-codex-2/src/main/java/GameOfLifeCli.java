import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/** JSON command-line adapter for {@link GameOfLife}. */
public final class GameOfLifeCli {
    private static final ObjectMapper JSON = new ObjectMapper();

    private GameOfLifeCli() {
    }

    /** Reads one request from stdin and writes one response to stdout. */
    public static void main(String[] args) throws IOException {
        Request request = JSON.readValue(System.in, Request.class);
        if (request.aliveCells() == null) {
            throw new IllegalArgumentException("aliveCells is required");
        }
        if (request.steps() < 0) {
            throw new IllegalArgumentException("steps must not be negative");
        }

        Set<Cell> cells = parseCells(request.aliveCells());
        GameOfLife game = new GameOfLife();
        for (int step = 0; step < request.steps(); step++) {
            cells = game.nextGeneration(cells);
        }

        Cell[] sorted = cells.toArray(Cell[]::new);
        Arrays.sort(sorted, (left, right) -> {
            int xComparison = Integer.compare(left.x(), right.x());
            return xComparison != 0 ? xComparison : Integer.compare(left.y(), right.y());
        });
        int[][] coordinates = new int[sorted.length][2];
        for (int index = 0; index < sorted.length; index++) {
            coordinates[index][0] = sorted[index].x();
            coordinates[index][1] = sorted[index].y();
        }
        JSON.writeValue(System.out, new Response(coordinates));
    }

    private static Set<Cell> parseCells(int[][] coordinates) {
        Set<Cell> cells = new HashSet<>();
        for (int[] coordinate : coordinates) {
            if (coordinate == null || coordinate.length != 2) {
                throw new IllegalArgumentException("each cell must contain exactly x and y");
            }
            cells.add(new Cell(coordinate[0], coordinate[1]));
        }
        return cells;
    }

    private record Request(int[][] aliveCells, int steps) {
    }

    private record Response(int[][] aliveCells) {
    }
}
