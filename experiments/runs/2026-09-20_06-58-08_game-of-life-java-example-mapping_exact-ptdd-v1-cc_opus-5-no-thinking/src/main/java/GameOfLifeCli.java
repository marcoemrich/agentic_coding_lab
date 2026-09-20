import java.io.IOException;
import java.util.Set;

public final class GameOfLifeCli {

    private GameOfLifeCli() {}

    public static void main(String[] args) throws IOException {
        GenerationJson request = GenerationJson.readRequest(System.in);
        Set<Cell> result = advance(request.livingCells(), request.steps());
        System.out.print(GenerationJson.writeGeneration(result));
    }

    private static Set<Cell> advance(Set<Cell> livingCells, int generations) {
        GameOfLife gameOfLife = new GameOfLife();
        Set<Cell> current = livingCells;
        for (int generation = 0; generation < generations; generation++) {
            current = gameOfLife.nextGeneration(current);
        }
        return current;
    }
}
