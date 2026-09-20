import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/** Calculates generations of Conway's Game of Life on an unbounded grid. */
public final class GameOfLife {
    /**
     * Returns the live cells one generation after {@code aliveCells}.
     * The input is not modified.
     *
     * @param aliveCells cells alive in the current generation
     * @return the live cells in the next generation
     */
    public Set<Cell> nextGeneration(Collection<Cell> aliveCells) {
        Objects.requireNonNull(aliveCells, "aliveCells");
        Set<Cell> current = new HashSet<>(aliveCells);
        Map<Cell, Integer> neighborCounts = new HashMap<>();

        for (Cell cell : current) {
            Objects.requireNonNull(cell, "aliveCells must not contain null");
            countNeighbors(cell, neighborCounts);
        }

        Set<Cell> next = new HashSet<>();
        for (Map.Entry<Cell, Integer> entry : neighborCounts.entrySet()) {
            int count = entry.getValue();
            if (count == 3 || count == 2 && current.contains(entry.getKey())) {
                next.add(entry.getKey());
            }
        }
        return Set.copyOf(next);
    }

    private void countNeighbors(Cell cell, Map<Cell, Integer> counts) {
        for (int xOffset = -1; xOffset <= 1; xOffset++) {
            for (int yOffset = -1; yOffset <= 1; yOffset++) {
                if (xOffset != 0 || yOffset != 0) {
                    Cell neighbor = new Cell(cell.x() + xOffset, cell.y() + yOffset);
                    counts.merge(neighbor, 1, Integer::sum);
                }
            }
        }
    }
}
