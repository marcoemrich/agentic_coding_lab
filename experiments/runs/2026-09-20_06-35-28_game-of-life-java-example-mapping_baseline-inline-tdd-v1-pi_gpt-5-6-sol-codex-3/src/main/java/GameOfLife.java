import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/** Computes generations of Conway's Game of Life on an unbounded sparse grid. */
public final class GameOfLife {
    /**
     * Computes one generation without imposing any bounds on the coordinates.
     *
     * @param aliveCells the cells alive in the current generation
     * @return an immutable set containing the cells alive in the next generation
     */
    public Set<Cell> nextGeneration(Collection<Cell> aliveCells) {
        Objects.requireNonNull(aliveCells, "aliveCells");
        Set<Cell> current = new HashSet<>(aliveCells);
        Map<Cell, Integer> neighborCounts = new HashMap<>();

        for (Cell cell : current) {
            countNeighbors(cell, neighborCounts);
        }

        Set<Cell> next = new HashSet<>();
        for (Map.Entry<Cell, Integer> candidate : neighborCounts.entrySet()) {
            int count = candidate.getValue();
            if (count == 3 || count == 2 && current.contains(candidate.getKey())) {
                next.add(candidate.getKey());
            }
        }
        return Set.copyOf(next);
    }

    private static void countNeighbors(Cell cell, Map<Cell, Integer> neighborCounts) {
        for (int deltaX = -1; deltaX <= 1; deltaX++) {
            for (int deltaY = -1; deltaY <= 1; deltaY++) {
                if (deltaX != 0 || deltaY != 0) {
                    Cell neighbor = new Cell(cell.x() + deltaX, cell.y() + deltaY);
                    neighborCounts.merge(neighbor, 1, Integer::sum);
                }
            }
        }
    }
}
