import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

public final class GameOfLife {
    public Set<Cell> nextGeneration(Collection<Cell> livingCells) {
        Objects.requireNonNull(livingCells, "livingCells");
        Set<Cell> alive = Set.copyOf(livingCells);
        Map<Cell, Integer> neighborCounts = countLivingNeighbors(alive);
        Set<Cell> next = new HashSet<>();

        neighborCounts.forEach((cell, count) -> {
            if (count == 3 || count == 2 && alive.contains(cell)) {
                next.add(cell);
            }
        });
        return Set.copyOf(next);
    }

    private Map<Cell, Integer> countLivingNeighbors(Set<Cell> alive) {
        Map<Cell, Integer> counts = new HashMap<>();
        for (Cell cell : alive) {
            addNeighbors(cell, counts);
        }
        return counts;
    }

    private void addNeighbors(Cell cell, Map<Cell, Integer> counts) {
        for (int deltaX = -1; deltaX <= 1; deltaX++) {
            for (int deltaY = -1; deltaY <= 1; deltaY++) {
                if (deltaX != 0 || deltaY != 0) {
                    addNeighbor(cell, deltaX, deltaY, counts);
                }
            }
        }
    }

    private void addNeighbor(Cell cell, int deltaX, int deltaY, Map<Cell, Integer> counts) {
        long x = (long) cell.x() + deltaX;
        long y = (long) cell.y() + deltaY;
        if (x >= Integer.MIN_VALUE && x <= Integer.MAX_VALUE
                && y >= Integer.MIN_VALUE && y <= Integer.MAX_VALUE) {
            counts.merge(new Cell((int) x, (int) y), 1, Integer::sum);
        }
    }
}
