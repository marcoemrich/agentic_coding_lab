import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class GameOfLifeCli {
    private static final ObjectMapper JSON = new ObjectMapper();

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        Request request = JSON.readValue(System.in, Request.class);
        List<int[]> cells = aliveCellsAfterRequestedSteps(request);
        cells.sort(Comparator.comparingInt((int[] cell) -> cell[0])
                .thenComparingInt(cell -> cell[1]));
        JSON.writeValue(System.out, new Response(cells));
    }

    private static List<int[]> aliveCellsAfterRequestedSteps(Request request) {
        Set<Cell> livingCells = request.aliveCells().stream()
                .map(coordinates -> new Cell(coordinates[0], coordinates[1]))
                .collect(Collectors.toSet());
        Set<Cell> evolvedCells = applyRequestedSteps(livingCells, request.steps());
        List<int[]> coordinates = evolvedCells.stream()
                .map(cell -> new int[]{cell.x(), cell.y()})
                .toList();
        return new ArrayList<>(coordinates);
    }

    private static Set<Cell> applyRequestedSteps(Set<Cell> livingCells, int steps) {
        GameOfLife game = new GameOfLife();
        for (int step = 0; step < steps; step++) {
            livingCells = game.nextGeneration(livingCells);
        }
        return livingCells;
    }

    private record Request(List<int[]> aliveCells, int steps) {
    }

    private record Response(List<int[]> aliveCells) {
    }
}
