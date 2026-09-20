import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Set;
import java.util.stream.Collectors;

public final class GameOfLifeCli {
    private static final ObjectMapper JSON = new ObjectMapper();

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        Request request = JSON.readValue(System.in, Request.class);
        Set<GameOfLife.Cell> aliveCells = Arrays.stream(request.aliveCells())
                .map(coordinates -> new GameOfLife.Cell(coordinates[0], coordinates[1]))
                .collect(Collectors.toSet());
        Set<GameOfLife.Cell> generation = applyGenerations(aliveCells, request.steps());
        JSON.writeValue(System.out, new Response(sortedCoordinates(generation)));
    }

    private static int[][] sortedCoordinates(Set<GameOfLife.Cell> aliveCells) {
        return aliveCells.stream()
                .sorted(Comparator.comparingInt(GameOfLife.Cell::x)
                        .thenComparingInt(GameOfLife.Cell::y))
                .map(cell -> new int[] {cell.x(), cell.y()})
                .toArray(int[][]::new);
    }

    private static Set<GameOfLife.Cell> applyGenerations(
            Set<GameOfLife.Cell> aliveCells, int steps) {
        Set<GameOfLife.Cell> generation = aliveCells;
        for (int step = 0; step < steps; step++) {
            generation = GameOfLife.nextGeneration(generation);
        }
        return generation;
    }

    private record Request(int[][] aliveCells, int steps) {
    }

    private record Response(int[][] aliveCells) {
    }
}
