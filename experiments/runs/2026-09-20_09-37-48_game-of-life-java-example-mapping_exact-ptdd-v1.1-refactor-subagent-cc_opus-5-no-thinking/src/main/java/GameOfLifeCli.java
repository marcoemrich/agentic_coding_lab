import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.io.UncheckedIOException;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.Set;

public final class GameOfLifeCli {

    private static final ObjectMapper JSON = new ObjectMapper();
    private static final Comparator<Cell> BY_X_THEN_Y =
            Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y);

    private GameOfLifeCli() {}

    public static void main(String[] args) {
        run(System.in, System.out);
    }

    public static void run(InputStream input, PrintStream output) {
        try {
            JsonNode request = JSON.readTree(input);
            Set<Cell> livingCells = readLivingCells(request.get("aliveCells"));
            int steps = request.get("steps").asInt();

            output.print(writeLivingCells(advance(livingCells, steps)));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private static Set<Cell> advance(Set<Cell> livingCells, int steps) {
        GameOfLife gameOfLife = new GameOfLife();
        Set<Cell> generation = livingCells;
        for (int step = 0; step < steps; step++) {
            generation = gameOfLife.nextGeneration(generation);
        }
        return generation;
    }

    private static Set<Cell> readLivingCells(JsonNode aliveCells) {
        Set<Cell> livingCells = new LinkedHashSet<>();
        for (JsonNode cell : aliveCells) {
            livingCells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt()));
        }
        return livingCells;
    }

    private static String writeLivingCells(Set<Cell> livingCells) {
        ObjectNode response = JSON.createObjectNode();
        ArrayNode aliveCells = response.putArray("aliveCells");
        for (Cell cell : livingCells.stream().sorted(BY_X_THEN_Y).toList()) {
            ArrayNode coordinates = aliveCells.addArray();
            coordinates.add(cell.x());
            coordinates.add(cell.y());
        }
        return response.toString();
    }
}
