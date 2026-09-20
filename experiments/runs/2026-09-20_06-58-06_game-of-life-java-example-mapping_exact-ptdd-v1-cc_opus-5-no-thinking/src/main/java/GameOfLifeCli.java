import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.util.Set;

public final class GameOfLifeCli {

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        GenerationJson json = new GenerationJson();
        JsonNode request = json.readRequest(System.in);
        Set<Cell> cells = json.readAliveCells(request);
        Set<Cell> result = new GameOfLife().generationsAfter(cells, json.readSteps(request));
        System.out.print(json.writeAliveCells(result));
    }
}
