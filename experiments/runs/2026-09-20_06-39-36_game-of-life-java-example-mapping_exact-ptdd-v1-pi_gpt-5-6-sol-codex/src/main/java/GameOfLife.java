import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public final class GameOfLife {
    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        return generationCandidates(livingCells).stream()
                .filter(cell -> willBeAlive(cell, livingCells))
                .collect(Collectors.toUnmodifiableSet());
    }

    private Set<Cell> generationCandidates(Set<Cell> livingCells) {
        Set<Cell> candidates = new HashSet<>(livingCells);
        for (Cell cell : livingCells) {
            for (int x = cell.x() - 1; x <= cell.x() + 1; x++) {
                for (int y = cell.y() - 1; y <= cell.y() + 1; y++) {
                    candidates.add(new Cell(x, y));
                }
            }
        }
        return candidates;
    }

    private boolean willBeAlive(Cell cell, Set<Cell> livingCells) {
        if (livingCells.contains(cell)) {
            return survives(cell, livingCells);
        }
        return isBorn(cell, livingCells);
    }

    private boolean isBorn(Cell cell, Set<Cell> livingCells) {
        return liveNeighborCount(cell, livingCells) == 3;
    }

    private boolean survives(Cell cell, Set<Cell> livingCells) {
        int neighborCount = liveNeighborCount(cell, livingCells);
        return neighborCount >= 2 && neighborCount <= 3;
    }

    private int liveNeighborCount(Cell cell, Set<Cell> livingCells) {
        int count = 0;
        for (int x = cell.x() - 1; x <= cell.x() + 1; x++) {
            for (int y = cell.y() - 1; y <= cell.y() + 1; y++) {
                if ((x != cell.x() || y != cell.y()) && livingCells.contains(new Cell(x, y))) {
                    count++;
                }
            }
        }
        return count;
    }
}
