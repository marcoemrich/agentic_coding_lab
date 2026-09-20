import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class GameOfLife {

    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        return livingCellsAndTheirNeighbours(livingCells).stream()
                .filter(cell -> isAliveNextGeneration(cell, livingCells))
                .collect(Collectors.toUnmodifiableSet());
    }

    private Set<Cell> livingCellsAndTheirNeighbours(Set<Cell> livingCells) {
        return livingCells.stream()
                .flatMap(cell -> Stream.concat(Stream.of(cell), neighboursOf(cell)))
                .collect(Collectors.toUnmodifiableSet());
    }

    private boolean isAliveNextGeneration(Cell cell, Set<Cell> livingCells) {
        long livingNeighbours = countLivingNeighbours(cell, livingCells);
        return livingCells.contains(cell)
                ? survives(livingNeighbours)
                : isBorn(livingNeighbours);
    }

    private boolean survives(long livingNeighbours) {
        return livingNeighbours == 2 || livingNeighbours == 3;
    }

    private boolean isBorn(long livingNeighbours) {
        return livingNeighbours == 3;
    }

    private long countLivingNeighbours(Cell cell, Set<Cell> livingCells) {
        return neighboursOf(cell).filter(livingCells::contains).count();
    }

    private Stream<Cell> neighboursOf(Cell cell) {
        return Stream.of(-1, 0, 1)
                .flatMap(
                        dx ->
                                Stream.of(-1, 0, 1)
                                        .filter(dy -> dx != 0 || dy != 0)
                                        .map(dy -> new Cell(cell.x() + dx, cell.y() + dy)));
    }
}
