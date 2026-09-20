import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import java.util.Set;

public final class GameOfLifeCli {
    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        Request request = mapper.readValue(System.in, Request.class);
        Set<Cell> aliveCells = CellCoordinatesMapper.toCells(request.aliveCells());
        Set<Cell> result = applySteps(aliveCells, request.steps());
        List<int[]> outputCells = CellCoordinatesMapper.fromCells(result);
        mapper.writeValue(System.out, new Response(outputCells));
    }

    private static Set<Cell> applySteps(Set<Cell> aliveCells, int steps) {
        GameOfLife game = new GameOfLife();
        Set<Cell> generation = aliveCells;
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
