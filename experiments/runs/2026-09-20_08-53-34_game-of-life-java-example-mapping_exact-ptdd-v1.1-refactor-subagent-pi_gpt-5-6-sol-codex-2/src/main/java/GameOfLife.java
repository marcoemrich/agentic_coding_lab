import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public final class GameOfLife {
    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        Map<Cell, Integer> livingNeighborCounts = new HashMap<>();
        for (Cell livingCell : livingCells) {
            countNeighborsOf(livingCell, livingNeighborCounts);
        }
        return livingNeighborCounts.entrySet().stream()
                .filter(entry -> LifeRules.willBeAlive(
                        livingCells.contains(entry.getKey()), entry.getValue()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toUnmodifiableSet());
    }


    private void countNeighborsOf(Cell cell, Map<Cell, Integer> livingNeighborCounts) {
        for (int xOffset = -1; xOffset <= 1; xOffset++) {
            for (int yOffset = -1; yOffset <= 1; yOffset++) {
                if (xOffset != 0 || yOffset != 0) {
                    Cell neighbor = new Cell(cell.x() + xOffset, cell.y() + yOffset);
                    livingNeighborCounts.merge(neighbor, 1, Integer::sum);
                }
            }
        }
    }
}
