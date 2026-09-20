import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gameoflife.Cell;
import gameoflife.GameOfLife;
import java.io.IOException;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Comparator;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/** Reads one JSON generation from stdin and writes the advanced generation to stdout. */
public final class GameOfLifeCli {

  private static final ObjectMapper MAPPER = new ObjectMapper();

  private static final Comparator<Cell> BY_X_THEN_Y =
      Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y);

  private GameOfLifeCli() {
  }

  public static void main(String[] args) throws IOException {
    JsonNode request = MAPPER.readTree(System.in);

    Set<Cell> result =
        Stream.iterate(readAliveCells(request), GameOfLife::nextGeneration)
            .skip(readSteps(request))
            .findFirst()
            .orElseThrow();

    PrintStream out = new PrintStream(System.out, true, StandardCharsets.UTF_8);
    out.println(MAPPER.writeValueAsString(toJson(result)));
  }

  private static int readSteps(JsonNode request) {
    return request.hasNonNull("steps") ? request.get("steps").asInt() : 1;
  }

  private static Set<Cell> readAliveCells(JsonNode request) {
    return nodes(request.path("aliveCells"))
        .map(cell -> new Cell(cell.get(0).asInt(), cell.get(1).asInt()))
        .collect(Collectors.toUnmodifiableSet());
  }

  private static Stream<JsonNode> nodes(JsonNode array) {
    return StreamSupport.stream(array.spliterator(), false);
  }

  private static ObjectNode toJson(Set<Cell> alive) {
    ArrayNode cells = MAPPER.createArrayNode();
    alive.stream().sorted(BY_X_THEN_Y).map(GameOfLifeCli::toPair).forEach(cells::add);

    ObjectNode response = MAPPER.createObjectNode();
    response.set("aliveCells", cells);
    return response;
  }

  private static ArrayNode toPair(Cell cell) {
    ArrayNode pair = MAPPER.createArrayNode();
    pair.add(cell.x());
    pair.add(cell.y());
    return pair;
  }
}
