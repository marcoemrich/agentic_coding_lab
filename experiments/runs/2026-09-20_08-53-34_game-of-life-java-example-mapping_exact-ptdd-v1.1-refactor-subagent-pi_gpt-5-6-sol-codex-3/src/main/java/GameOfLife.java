import java.util.HashSet;
import java.util.Set;

public final class GameOfLife {
    private GameOfLife() {
    }

    public static Set<Cell> nextGeneration(Set<Cell> aliveCells) {
        Set<Cell> nextGeneration = new HashSet<>();
        for (Cell cell : aliveCells) {
            if (GameOfLifeRules.survives(countLiveNeighbors(cell, aliveCells))) {
                nextGeneration.add(cell);
            }
            addBirthsAround(cell, aliveCells, nextGeneration);
        }
        return Set.copyOf(nextGeneration);
    }

    private static void addBirthsAround(
            Cell cell, Set<Cell> aliveCells, Set<Cell> nextGeneration) {
        for (Cell neighbor : neighborsOf(cell)) {
            if (GameOfLifeRules.isBorn(
                    aliveCells.contains(neighbor), countLiveNeighbors(neighbor, aliveCells))) {
                nextGeneration.add(neighbor);
            }
        }
    }

    private static Set<Cell> neighborsOf(Cell cell) {
        Set<Cell> neighbors = new HashSet<>();
        for (int xOffset = -1; xOffset <= 1; xOffset++) {
            for (int yOffset = -1; yOffset <= 1; yOffset++) {
                if (xOffset != 0 || yOffset != 0) {
                    neighbors.add(new Cell(cell.x() + xOffset, cell.y() + yOffset));
                }
            }
        }
        return neighbors;
    }

    private static int countLiveNeighbors(Cell cell, Set<Cell> aliveCells) {
        int liveNeighbors = 0;
        for (Cell neighbor : neighborsOf(cell)) {
            if (aliveCells.contains(neighbor)) {
                liveNeighbors++;
            }
        }
        return liveNeighbors;
    }

    public record Cell(int x, int y) {
    }
}
