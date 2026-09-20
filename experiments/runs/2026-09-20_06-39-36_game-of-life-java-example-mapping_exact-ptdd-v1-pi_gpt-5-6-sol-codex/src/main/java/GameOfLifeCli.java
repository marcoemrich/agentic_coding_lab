import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public final class GameOfLifeCli {
    private static final ObjectMapper JSON = new ObjectMapper();

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        run(System.in, System.out);
    }

    static void run(InputStream input, OutputStream output) throws IOException {
        Request request = JSON.readValue(input, Request.class);
        Set<Cell> livingCells = evolve(toCells(request.aliveCells()), request.steps());
        JSON.writeValue(output, Map.of("aliveCells", toSortedCoordinates(livingCells)));
    }

    private static List<List<Integer>> toSortedCoordinates(Set<Cell> livingCells) {
        return livingCells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .map(cell -> List.of(cell.x(), cell.y()))
                .toList();
    }

    private static Set<Cell> evolve(Set<Cell> livingCells, int steps) {
        GameOfLife game = new GameOfLife();
        Set<Cell> generation = livingCells;
        for (int step = 0; step < steps; step++) {
            generation = game.nextGeneration(generation);
        }
        return generation;
    }

    private static Set<Cell> toCells(List<List<Integer>> coordinates) {
        return coordinates.stream()
                .map(coordinate -> new Cell(coordinate.get(0), coordinate.get(1)))
                .collect(Collectors.toSet());
    }

    private record Request(List<List<Integer>> aliveCells, int steps) {
    }
}
