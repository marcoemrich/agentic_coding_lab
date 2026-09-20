import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class GameOfLife {

    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        return Stream.concat(survivorsOf(livingCells), birthsFrom(livingCells))
                .collect(Collectors.toSet());
    }

    private Stream<Cell> survivorsOf(Set<Cell> livingCells) {
        return livingCells.stream().filter(cell -> survives(cell, livingCells));
    }

    private Stream<Cell> birthsFrom(Set<Cell> livingCells) {
        return deadNeighboursOf(livingCells).filter(cell -> isBorn(cell, livingCells));
    }

    public Set<Cell> generationsAfter(Set<Cell> livingCells, int generations) {
        Set<Cell> generation = livingCells;
        for (int count = 0; count < generations; count++) {
            generation = nextGeneration(generation);
        }
        return generation;
    }

    private boolean survives(Cell cell, Set<Cell> livingCells) {
        long livingNeighbours = livingNeighboursOf(cell, livingCells);
        return livingNeighbours == 2 || livingNeighbours == 3;
    }

    private boolean isBorn(Cell cell, Set<Cell> livingCells) {
        return livingNeighboursOf(cell, livingCells) == 3;
    }

    private Stream<Cell> deadNeighboursOf(Set<Cell> livingCells) {
        return livingCells.stream()
                .flatMap(this::neighboursOf)
                .filter(cell -> !livingCells.contains(cell))
                .distinct();
    }

    private Stream<Cell> neighboursOf(Cell cell) {
        return Stream.of(-1, 0, 1)
                .flatMap(dx -> Stream.of(-1, 0, 1)
                        .filter(dy -> dx != 0 || dy != 0)
                        .map(dy -> new Cell(cell.x() + dx, cell.y() + dy)));
    }

    private long livingNeighboursOf(Cell cell, Set<Cell> livingCells) {
        return neighboursOf(cell).filter(livingCells::contains).count();
    }
}
