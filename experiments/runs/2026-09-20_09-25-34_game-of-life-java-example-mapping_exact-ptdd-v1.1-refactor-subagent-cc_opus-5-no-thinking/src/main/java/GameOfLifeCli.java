import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public final class GameOfLifeCli {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final String ALIVE_CELLS = "aliveCells";
    private static final String STEPS = "steps";

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        JsonNode request = MAPPER.readTree(System.in);
        Set<Cell> livingCells = new GameOfLife()
                .advance(readLivingCells(request.get(ALIVE_CELLS)), request.get(STEPS).asInt());
        System.out.print(MAPPER.writeValueAsString(writeLivingCells(livingCells)));
    }

    private static Set<Cell> readLivingCells(JsonNode aliveCells) {
        Set<Cell> livingCells = new LinkedHashSet<>();
        for (JsonNode cell : aliveCells) {
            livingCells.add(new Cell(cell.get(0).asInt(), cell.get(1).asInt()));
        }
        return livingCells;
    }

    private static List<Cell> sortedByXThenY(Set<Cell> livingCells) {
        List<Cell> sorted = new ArrayList<>(livingCells);
        sorted.sort(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y));
        return sorted;
    }

    private static ObjectNode writeLivingCells(Set<Cell> livingCells) {
        ObjectNode response = MAPPER.createObjectNode();
        ArrayNode cells = response.putArray(ALIVE_CELLS);
        for (Cell cell : sortedByXThenY(livingCells)) {
            cells.addArray().add(cell.x()).add(cell.y());
        }
        return response;
    }
}
