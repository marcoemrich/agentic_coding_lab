import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class GameOfLifeCli {
    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode input = mapper.readTree(System.in);
        Set<Cell> livingCells = readAliveCells(input);
        Set<Cell> resultingCells = applySteps(livingCells, input.get("steps").asInt());

        writeAliveCells(mapper, resultingCells);
    }

    private static Set<Cell> applySteps(Set<Cell> livingCells, int steps) {
        GameOfLife game = new GameOfLife();
        Set<Cell> resultingCells = livingCells;
        for (int step = 0; step < steps; step++) {
            resultingCells = game.nextGeneration(resultingCells);
        }
        return resultingCells;
    }

    private static Set<Cell> readAliveCells(JsonNode input) {
        Set<Cell> livingCells = new HashSet<>();
        for (JsonNode coordinates : input.get("aliveCells")) {
            livingCells.add(new Cell(coordinates.get(0).asInt(), coordinates.get(1).asInt()));
        }
        return livingCells;
    }

    private static void writeAliveCells(ObjectMapper mapper, Set<Cell> livingCells) throws Exception {
        mapper.writeValue(System.out, Map.of("aliveCells", sortedCoordinates(livingCells)));
    }

    private static List<List<Integer>> sortedCoordinates(Set<Cell> livingCells) {
        return livingCells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .map(cell -> List.of(cell.x(), cell.y()))
                .toList();
    }
}
