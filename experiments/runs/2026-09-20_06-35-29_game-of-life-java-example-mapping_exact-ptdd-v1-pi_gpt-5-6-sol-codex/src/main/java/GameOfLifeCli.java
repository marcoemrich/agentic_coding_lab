import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Set;
import java.util.stream.Collectors;

public final class GameOfLifeCli {
    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        Request request = mapper.readValue(System.in, Request.class);
        Set<Cell> generation = Arrays.stream(request.aliveCells())
                .map(coordinates -> new Cell(coordinates[0], coordinates[1]))
                .collect(Collectors.toUnmodifiableSet());
        generation = applySteps(generation, request.steps());
        int[][] coordinates = generation.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .map(cell -> new int[] {cell.x(), cell.y()})
                .toArray(int[][]::new);
        mapper.writeValue(System.out, new Response(coordinates));
    }

    private static Set<Cell> applySteps(Set<Cell> initialGeneration, int steps) {
        Set<Cell> generation = initialGeneration;
        GameOfLife game = new GameOfLife();
        for (int step = 0; step < steps; step++) {
            generation = game.nextGeneration(generation);
        }
        return generation;
    }

    private record Request(int[][] aliveCells, int steps) {
    }

    private record Response(int[][] aliveCells) {
    }
}
