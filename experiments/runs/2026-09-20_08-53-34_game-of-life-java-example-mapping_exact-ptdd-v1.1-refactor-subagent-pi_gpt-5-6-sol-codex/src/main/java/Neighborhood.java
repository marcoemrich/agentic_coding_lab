import java.util.HashSet;
import java.util.Set;

final class Neighborhood {
    Set<Cell> generationCandidates(Set<Cell> aliveCells) {
        Set<Cell> candidates = new HashSet<>(aliveCells);
        for (Cell cell : aliveCells) {
            candidates.addAll(neighborsOf(cell));
        }
        return candidates;
    }

    long liveNeighborCount(Cell cell, Set<Cell> aliveCells) {
        return neighborsOf(cell).stream()
                .filter(aliveCells::contains)
                .count();
    }

    private Set<Cell> neighborsOf(Cell cell) {
        Set<Cell> neighbors = new HashSet<>();
        for (int xOffset = -1; xOffset <= 1; xOffset++) {
            for (int yOffset = -1; yOffset <= 1; yOffset++) {
                if (xOffset != 0 || yOffset != 0) {
                    neighbors.add(new Cell(cell.x() + xOffset, cell.y() + yOffset));
                }
            }
        }
        return neighbors;
    }
}
