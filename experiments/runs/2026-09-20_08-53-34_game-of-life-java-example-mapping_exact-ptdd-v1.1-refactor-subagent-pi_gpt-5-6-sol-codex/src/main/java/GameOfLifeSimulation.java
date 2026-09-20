import java.util.Set;

final class GameOfLifeSimulation {
    private final GameOfLife game = new GameOfLife();

    Set<Cell> afterSteps(Set<Cell> aliveCells, int steps) {
        Set<Cell> currentGeneration = aliveCells;
        for (int step = 0; step < steps; step++) {
            currentGeneration = game.nextGeneration(currentGeneration);
        }
        return currentGeneration;
    }
}
