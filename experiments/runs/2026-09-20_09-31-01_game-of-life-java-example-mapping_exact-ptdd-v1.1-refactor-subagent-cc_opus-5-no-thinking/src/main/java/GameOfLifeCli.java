import gameoflife.GameOfLife;
import java.io.IOException;

public final class GameOfLifeCli {

    private GameOfLifeCli() {
    }

    public static void main(String[] args) throws IOException {
        GenerationJson json = new GenerationJson();
        GameOfLife game = new GameOfLife();

        GenerationRequest request = json.readRequest(System.in);

        System.out.println(json.writeLivingCells(
                game.advance(request.livingCells(), request.steps())));
    }
}
