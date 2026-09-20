import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public final class GameOfLife {
    public record Cell(int x, int y) {
    }

    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        Map<Cell, Integer> liveNeighborCounts = countLiveNeighbors(livingCells);
        Set<Cell> nextGeneration = new HashSet<>();
        for (Map.Entry<Cell, Integer> entry : liveNeighborCounts.entrySet()) {
            if (livesInNextGeneration(entry.getKey(), entry.getValue(), livingCells)) {
                nextGeneration.add(entry.getKey());
            }
        }
        return nextGeneration;
    }

    private Map<Cell, Integer> countLiveNeighbors(Set<Cell> livingCells) {
        Map<Cell, Integer> counts = new HashMap<>();
        for (Cell livingCell : livingCells) {
            for (int xOffset = -1; xOffset <= 1; xOffset++) {
                for (int yOffset = -1; yOffset <= 1; yOffset++) {
                    if (xOffset != 0 || yOffset != 0) {
                        Cell neighbor = new Cell(livingCell.x() + xOffset, livingCell.y() + yOffset);
                        counts.merge(neighbor, 1, Integer::sum);
                    }
                }
            }
        }
        return counts;
    }

    private boolean livesInNextGeneration(Cell cell, int liveNeighbors, Set<Cell> livingCells) {
        return livingCells.contains(cell) ? survives(liveNeighbors) : liveNeighbors == 3;
    }

    private boolean survives(long liveNeighbors) {
        return liveNeighbors == 2 || liveNeighbors == 3;
    }
}
