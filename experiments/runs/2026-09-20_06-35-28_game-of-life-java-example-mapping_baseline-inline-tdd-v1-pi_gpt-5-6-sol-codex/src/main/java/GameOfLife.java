import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/** Computes generations of Conway's Game of Life on a sparse, unbounded grid. */
public final class GameOfLife {
    /**
     * Computes one generation without mutating the supplied collection.
     * Duplicate coordinates, if supplied, represent one living cell.
     *
     * @param livingCells coordinates alive in the current generation
     * @return the living coordinates in the next generation
     */
    public Set<Cell> nextGeneration(Collection<Cell> livingCells) {
        Objects.requireNonNull(livingCells, "livingCells");
        Set<Cell> alive = new HashSet<>(livingCells);
        if (alive.contains(null)) {
            throw new NullPointerException("livingCells must not contain null");
        }

        Map<Cell, Integer> neighborCounts = new HashMap<>();
        for (Cell cell : alive) {
            for (int deltaX = -1; deltaX <= 1; deltaX++) {
                for (int deltaY = -1; deltaY <= 1; deltaY++) {
                    if (deltaX != 0 || deltaY != 0) {
                        addNeighbor(neighborCounts, cell, deltaX, deltaY);
                    }
                }
            }
        }

        Set<Cell> next = new HashSet<>();
        for (Map.Entry<Cell, Integer> entry : neighborCounts.entrySet()) {
            int neighbors = entry.getValue();
            if (neighbors == 3 || neighbors == 2 && alive.contains(entry.getKey())) {
                next.add(entry.getKey());
            }
        }
        return next;
    }

    private static void addNeighbor(Map<Cell, Integer> counts, Cell cell,
                                    int deltaX, int deltaY) {
        long x = (long) cell.x() + deltaX;
        long y = (long) cell.y() + deltaY;
        if (x >= Integer.MIN_VALUE && x <= Integer.MAX_VALUE
                && y >= Integer.MIN_VALUE && y <= Integer.MAX_VALUE) {
            counts.merge(new Cell((int) x, (int) y), 1, Integer::sum);
        }
    }
}
