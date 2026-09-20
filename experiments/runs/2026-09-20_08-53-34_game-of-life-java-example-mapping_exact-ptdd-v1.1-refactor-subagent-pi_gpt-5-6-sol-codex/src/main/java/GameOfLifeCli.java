import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public final class GameOfLifeCli {
    private static final ObjectMapper JSON = new ObjectMapper();

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        run(System.in, System.out);
    }

    static void run(InputStream input, OutputStream output) throws IOException {
        Request request = JSON.readValue(input, Request.class);
        Set<Cell> aliveCells = new LinkedHashSet<>();
        for (int[] coordinates : request.aliveCells()) {
            aliveCells.add(new Cell(coordinates[0], coordinates[1]));
        }

        Set<Cell> resultingCells = new GameOfLifeSimulation()
                .afterSteps(aliveCells, request.steps());

        JSON.writeValue(output, new Response(coordinatesSortedByXThenY(resultingCells)));
    }

    private static List<int[]> coordinatesSortedByXThenY(Set<Cell> aliveCells) {
        return aliveCells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .map(cell -> new int[]{cell.x(), cell.y()})
                .toList();
    }

    private record Response(List<int[]> aliveCells) {
    }

    private record Request(int[][] aliveCells, int steps) {
        private Request {
            aliveCells = Arrays.copyOf(aliveCells, aliveCells.length);
        }
    }
}
