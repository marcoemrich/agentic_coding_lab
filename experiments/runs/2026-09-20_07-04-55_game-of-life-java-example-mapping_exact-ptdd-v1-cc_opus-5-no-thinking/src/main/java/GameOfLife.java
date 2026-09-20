import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class GameOfLife {

    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        return candidates(livingCells).stream()
                .filter(cell -> isAliveNextGeneration(cell, livingCells))
                .collect(Collectors.toSet());
    }

    private Set<Cell> candidates(Set<Cell> livingCells) {
        return livingCells.stream()
                .flatMap(cell -> Stream.concat(Stream.of(cell), cell.neighbours().stream()))
                .collect(Collectors.toSet());
    }

    private boolean isAliveNextGeneration(Cell cell, Set<Cell> livingCells) {
        long livingNeighbours = countLivingNeighbours(cell, livingCells);
        return livingCells.contains(cell) ? survives(livingNeighbours) : isBorn(livingNeighbours);
    }

    private boolean survives(long livingNeighbours) {
        return livingNeighbours == 2 || livingNeighbours == 3;
    }

    private boolean isBorn(long livingNeighbours) {
        return livingNeighbours == 3;
    }

    private long countLivingNeighbours(Cell cell, Set<Cell> livingCells) {
        return cell.neighbours().stream().filter(livingCells::contains).count();
    }
}
