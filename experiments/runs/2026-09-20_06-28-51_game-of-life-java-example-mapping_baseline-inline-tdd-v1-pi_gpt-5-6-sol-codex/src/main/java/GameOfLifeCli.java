import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public final class GameOfLifeCli {
    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        Request request = mapper.readValue(System.in, Request.class);
        Set<Cell> alive = toCells(request.aliveCells());
        if (request.steps() < 0) {
            throw new IllegalArgumentException("steps must not be negative");
        }

        GameOfLife game = new GameOfLife();
        for (int step = 0; step < request.steps(); step++) {
            alive = game.nextGeneration(alive);
        }

        mapper.writeValue(System.out, new Response(toCoordinates(alive)));
    }

    private static Set<Cell> toCells(List<int[]> coordinates) {
        Set<Cell> cells = new HashSet<>();
        for (int[] coordinate : coordinates) {
            if (coordinate.length != 2) {
                throw new IllegalArgumentException("Each cell must contain an x and y coordinate");
            }
            cells.add(new Cell(coordinate[0], coordinate[1]));
        }
        return cells;
    }

    private static List<int[]> toCoordinates(Set<Cell> cells) {
        List<Cell> sorted = new ArrayList<>(cells);
        sorted.sort(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y));
        return sorted.stream().map(cell -> new int[]{cell.x(), cell.y()}).toList();
    }

    private record Request(List<int[]> aliveCells, int steps) {
    }

    private record Response(List<int[]> aliveCells) {
    }
}
