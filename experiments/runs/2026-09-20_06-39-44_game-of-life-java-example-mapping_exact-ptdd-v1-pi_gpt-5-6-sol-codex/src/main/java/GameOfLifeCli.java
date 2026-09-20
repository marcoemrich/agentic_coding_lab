import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class GameOfLifeCli {
    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        run(System.in, System.out);
    }

    static void run(InputStream input, OutputStream output) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        Request request = mapper.readValue(input, Request.class);
        Set<Cell> livingCells = request.aliveCells().stream()
                .map(coordinates -> new Cell(coordinates[0], coordinates[1]))
                .collect(Collectors.toSet());

        Set<Cell> generation = advance(livingCells, request.steps());

        List<int[]> outputCells = generation.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .map(cell -> new int[] {cell.x(), cell.y()})
                .toList();
        mapper.writeValue(output, new Response(outputCells));
    }

    private static Set<Cell> advance(Set<Cell> initialGeneration, int steps) {
        GameOfLife game = new GameOfLife();
        Set<Cell> generation = initialGeneration;
        for (int step = 0; step < steps; step++) {
            generation = game.nextGeneration(generation);
        }
        return generation;
    }

    private record Request(List<int[]> aliveCells, int steps) {
    }

    private record Response(List<int[]> aliveCells) {
    }
}
