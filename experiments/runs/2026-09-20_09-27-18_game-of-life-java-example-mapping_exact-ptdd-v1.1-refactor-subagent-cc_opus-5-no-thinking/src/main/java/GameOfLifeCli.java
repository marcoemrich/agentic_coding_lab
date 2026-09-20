/**
 * Process entry point: reads one generation request from stdin and writes the
 * resulting colony to stdout. Owns no domain knowledge of its own.
 */
public final class GameOfLifeCli {

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws Exception {
        GenerationRequest request = GameOfLifeJson.readRequest(System.in);
        System.out.print(GameOfLifeJson.writeColony(
                GameOfLife.generationsAfter(request.livingCells(), request.generations())));
    }
}
