import java.util.Set;
import java.util.stream.Stream;

public final class GameOfLife {
    public Set<Cell> nextGeneration(Set<Cell> aliveCells) {
        Stream<Cell> neighboringCells = aliveCells.stream()
                .flatMap(cell -> cell.neighbors().stream());
        return Stream.concat(aliveCells.stream(), neighboringCells)
                .distinct()
                .filter(cell -> aliveCells.contains(cell)
                        ? survives(cell, aliveCells)
                        : comesAlive(cell, aliveCells))
                .collect(java.util.stream.Collectors.toUnmodifiableSet());
    }

    private boolean comesAlive(Cell cell, Set<Cell> aliveCells) {
        return liveNeighborCount(cell, aliveCells) == 3;
    }

    private boolean survives(Cell cell, Set<Cell> aliveCells) {
        long neighbors = liveNeighborCount(cell, aliveCells);
        return neighbors >= 2 && neighbors <= 3;
    }

    private long liveNeighborCount(Cell cell, Set<Cell> aliveCells) {
        return cell.neighbors().stream()
                .filter(aliveCells::contains)
                .count();
    }
}
