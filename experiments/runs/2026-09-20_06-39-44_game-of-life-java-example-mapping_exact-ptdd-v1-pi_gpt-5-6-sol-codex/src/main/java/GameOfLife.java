import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public final class GameOfLife {
    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        Set<Cell> nextGeneration = livingCells.stream()
                .filter(cell -> survives(cell, livingCells))
                .collect(Collectors.toCollection(HashSet::new));
        birthCandidates(livingCells).stream()
                .filter(candidate -> isBorn(candidate, livingCells))
                .forEach(nextGeneration::add);
        return Set.copyOf(nextGeneration);
    }

    private Set<Cell> birthCandidates(Set<Cell> livingCells) {
        return livingCells.stream()
                .flatMap(cell -> IntStream.rangeClosed(-1, 1)
                        .boxed()
                        .flatMap(xOffset -> IntStream.rangeClosed(-1, 1)
                                .mapToObj(yOffset -> new Cell(
                                        cell.x() + xOffset, cell.y() + yOffset))))
                .collect(Collectors.toUnmodifiableSet());
    }

    private boolean isBorn(Cell candidate, Set<Cell> livingCells) {
        return !livingCells.contains(candidate)
                && liveNeighborCount(candidate, livingCells) == 3;
    }

    private boolean survives(Cell cell, Set<Cell> livingCells) {
        long neighborCount = liveNeighborCount(cell, livingCells);
        return neighborCount >= 2 && neighborCount <= 3;
    }

    private long liveNeighborCount(Cell cell, Set<Cell> livingCells) {
        return livingCells.stream()
                .filter(other -> !cell.equals(other))
                .filter(other -> Math.abs((long) cell.x() - other.x()) <= 1
                        && Math.abs((long) cell.y() - other.y()) <= 1)
                .count();
    }
}
