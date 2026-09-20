import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public final class GameOfLife {
    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        Set<Cell> candidates = new HashSet<>();
        for (Cell cell : livingCells) {
            addCellAndNeighbors(cell, candidates);
        }
        return candidates.stream()
                .filter(cell -> livesInNextGeneration(cell, livingCells))
                .collect(Collectors.toUnmodifiableSet());
    }

    private void addCellAndNeighbors(Cell cell, Set<Cell> candidates) {
        for (int xOffset = -1; xOffset <= 1; xOffset++) {
            for (int yOffset = -1; yOffset <= 1; yOffset++) {
                candidates.add(new Cell(cell.x() + xOffset, cell.y() + yOffset));
            }
        }
    }

    private boolean livesInNextGeneration(Cell cell, Set<Cell> livingCells) {
        long liveNeighbors = livingCells.stream()
                .filter(other -> isNeighbor(cell, other))
                .count();
        return survives(cell, liveNeighbors, livingCells)
                || isBorn(cell, liveNeighbors, livingCells);
    }

    private boolean survives(Cell cell, long liveNeighbors, Set<Cell> livingCells) {
        return livingCells.contains(cell) && (liveNeighbors == 2 || liveNeighbors == 3);
    }

    private boolean isBorn(Cell cell, long liveNeighbors, Set<Cell> livingCells) {
        return !livingCells.contains(cell) && liveNeighbors == 3;
    }

    private boolean isNeighbor(Cell cell, Cell other) {
        int xDistance = Math.abs(cell.x() - other.x());
        int yDistance = Math.abs(cell.y() - other.y());
        return (xDistance != 0 || yDistance != 0) && xDistance <= 1 && yDistance <= 1;
    }
}
