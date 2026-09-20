import gameoflife.GameOfLife;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UncheckedIOException;

public class GameOfLifeCli {

    private final AliveCellsJson aliveCellsJson = new AliveCellsJson();

    private final GameOfLife gameOfLife = new GameOfLife();

    public static void main(String[] args) {
        new GameOfLifeCli().run(System.in, System.out);
    }

    public void run(InputStream input, OutputStream output) {
        try {
            GenerationRequest request = aliveCellsJson.readRequest(input);
            aliveCellsJson.writeAliveCells(
                    output, gameOfLife.generationsAfter(request.aliveCells(), request.steps()));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
