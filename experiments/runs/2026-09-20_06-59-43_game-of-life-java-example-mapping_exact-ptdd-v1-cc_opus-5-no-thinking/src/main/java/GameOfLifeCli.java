import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class GameOfLifeCli {

    private static final ObjectMapper JSON = new ObjectMapper();

    public static void main(String[] args) {
        new GameOfLifeCli().run(System.in, System.out);
    }

    public void run(InputStream input, PrintStream output) {
        try {
            JsonNode request = JSON.readTree(input);
            Set<Cell> livingCells = readCells(request.get("aliveCells"));
            output.print(writeCells(advance(livingCells, request.get("steps").asInt())));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private Set<Cell> advance(Set<Cell> livingCells, int steps) {
        GameOfLife gameOfLife = new GameOfLife();
        Set<Cell> generation = livingCells;
        for (int step = 0; step < steps; step++) {
            generation = gameOfLife.nextGeneration(generation);
        }
        return generation;
    }

    private Set<Cell> readCells(JsonNode aliveCells) {
        Set<Cell> cells = new HashSet<>();
        for (JsonNode cell : aliveCells) {
            cells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt()));
        }
        return cells;
    }

    private String writeCells(Set<Cell> livingCells) {
        ObjectNode response = JSON.createObjectNode();
        ArrayNode aliveCells = response.putArray("aliveCells");
        for (Cell cell : sortedByPosition(livingCells)) {
            aliveCells.addArray().add(cell.x()).add(cell.y());
        }
        return response.toString();
    }

    private List<Cell> sortedByPosition(Set<Cell> livingCells) {
        List<Cell> sorted = new ArrayList<>(livingCells);
        sorted.sort(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y));
        return sorted;
    }
}
