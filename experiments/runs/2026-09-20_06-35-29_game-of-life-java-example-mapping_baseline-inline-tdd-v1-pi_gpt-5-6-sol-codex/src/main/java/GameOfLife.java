import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

public final class GameOfLife {
    public Set<Cell> nextGeneration(Collection<Cell> livingCells) {
        Objects.requireNonNull(livingCells, "livingCells");
        Set<Cell> alive = new HashSet<>(livingCells);
        if (alive.contains(null)) {
            throw new NullPointerException("livingCells must not contain null");
        }

        Map<Cell, Integer> neighborCounts = new HashMap<>();
        for (Cell cell : alive) {
            countNeighbors(cell, neighborCounts);
        }

        Set<Cell> next = new HashSet<>();
        for (Map.Entry<Cell, Integer> entry : neighborCounts.entrySet()) {
            int neighbors = entry.getValue();
            if (neighbors == 3 || (neighbors == 2 && alive.contains(entry.getKey()))) {
                next.add(entry.getKey());
            }
        }
        return Set.copyOf(next);
    }

    private void countNeighbors(Cell cell, Map<Cell, Integer> counts) {
        for (int deltaX = -1; deltaX <= 1; deltaX++) {
            for (int deltaY = -1; deltaY <= 1; deltaY++) {
                if (deltaX == 0 && deltaY == 0) {
                    continue;
                }
                long x = (long) cell.x() + deltaX;
                long y = (long) cell.y() + deltaY;
                if (x >= Integer.MIN_VALUE && x <= Integer.MAX_VALUE
                        && y >= Integer.MIN_VALUE && y <= Integer.MAX_VALUE) {
                    counts.merge(new Cell((int) x, (int) y), 1, Integer::sum);
                }
            }
        }
    }
}
