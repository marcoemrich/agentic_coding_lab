import com.fasterxml.jackson.databind.JsonNode;
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
        JsonNode input = mapper.readTree(System.in);
        Set<GameOfLife.Cell> livingCells = new HashSet<>();
        for (JsonNode coordinates : input.get("aliveCells")) {
            livingCells.add(new GameOfLife.Cell(coordinates.get(0).asInt(), coordinates.get(1).asInt()));
        }

        livingCells = applySteps(livingCells, input.get("steps").asInt());

        mapper.writeValue(System.out, new Output(sortedCoordinates(livingCells)));
    }

    private static List<int[]> sortedCoordinates(Set<GameOfLife.Cell> livingCells) {
        List<int[]> coordinates = new ArrayList<>();
        for (GameOfLife.Cell cell : livingCells) {
            coordinates.add(new int[]{cell.x(), cell.y()});
        }
        coordinates.sort(Comparator.<int[]>comparingInt(cell -> cell[0])
                .thenComparingInt(cell -> cell[1]));
        return coordinates;
    }

    private static Set<GameOfLife.Cell> applySteps(Set<GameOfLife.Cell> livingCells, int steps) {
        GameOfLife game = new GameOfLife();
        Set<GameOfLife.Cell> generation = livingCells;
        for (int step = 0; step < steps; step++) {
            generation = game.nextGeneration(generation);
        }
        return generation;
    }

    private record Output(List<int[]> aliveCells) {
    }
}
