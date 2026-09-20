import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class GameOfLifeCli {
    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        Request request = mapper.readValue(System.in, Request.class);
        Set<Cell> livingCells = toCells(request.aliveCells());
        Set<Cell> result = advance(livingCells, request.steps());
        mapper.writeValue(System.out, new Response(toCoordinates(result)));
    }

    private static Set<Cell> advance(Set<Cell> livingCells, int steps) {
        GameOfLife game = new GameOfLife();
        Set<Cell> generation = livingCells;
        for (int step = 0; step < steps; step++) {
            generation = game.nextGeneration(generation);
        }
        return generation;
    }

    private static Set<Cell> toCells(List<List<Integer>> coordinates) {
        return coordinates.stream()
                .map(pair -> new Cell(pair.get(0), pair.get(1)))
                .collect(Collectors.toSet());
    }

    private static List<List<Integer>> toCoordinates(Set<Cell> cells) {
        return cells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .map(cell -> List.of(cell.x(), cell.y()))
                .toList();
    }

    private record Request(List<List<Integer>> aliveCells, int steps) {
    }

    private record Response(List<List<Integer>> aliveCells) {
    }
}
