import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class GameOfLife {

    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        return cellsThatCanChangeState(livingCells).stream()
                .filter(cell -> isAliveNextGeneration(cell, livingCells))
                .collect(Collectors.toSet());
    }

    private Set<Cell> cellsThatCanChangeState(Set<Cell> livingCells) {
        return livingCells.stream()
                .flatMap(cell -> Stream.concat(Stream.of(cell), cell.neighbours().stream()))
                .collect(Collectors.toSet());
    }

    private boolean isAliveNextGeneration(Cell cell, Set<Cell> livingCells) {
        long livingNeighbours = livingNeighbours(cell, livingCells);
        if (livingCells.contains(cell)) {
            return livingNeighbours == 2 || livingNeighbours == 3;
        }
        return livingNeighbours == 3;
    }

    private long livingNeighbours(Cell cell, Set<Cell> livingCells) {
        return cell.neighbours().stream().filter(livingCells::contains).count();
    }
}
