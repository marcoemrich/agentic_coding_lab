import java.util.HashSet;
import java.util.Set;

public final class GameOfLife {
    private final LifeRules lifeRules = new LifeRules();

    public Set<Cell> nextGeneration(Set<Cell> aliveCells) {
        Set<Cell> nextGeneration = new HashSet<>();
        for (Cell cell : possibleNextGenerationCells(aliveCells)) {
            long liveNeighbors = liveNeighborCount(cell, aliveCells);
            if (lifeRules.isAliveInNextGeneration(
                    aliveCells.contains(cell), liveNeighbors)) {
                nextGeneration.add(cell);
            }
        }
        return nextGeneration;
    }

    private Set<Cell> possibleNextGenerationCells(Set<Cell> aliveCells) {
        Set<Cell> possibleCells = new HashSet<>(aliveCells);
        for (Cell cell : aliveCells) {
            possibleCells.addAll(cell.neighbors());
        }
        return possibleCells;
    }

    private long liveNeighborCount(Cell cell, Set<Cell> aliveCells) {
        return cell.neighbors().stream()
                .filter(aliveCells::contains)
                .count();
    }

}
