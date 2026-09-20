import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public final class GameOfLife {

    private GameOfLife() {
    }

    public static Set<Cell> nextGeneration(Set<Cell> livingCells) {
        return cellsThatCouldChange(livingCells).stream()
                .filter(cell -> ConwayRules.isAliveNextGeneration(
                        livingCells.contains(cell),
                        livingNeighbourCount(cell, livingCells)))
                .collect(Collectors.toUnmodifiableSet());
    }

    /**
     * The colony that results from applying {@link #nextGeneration} the given
     * number of times. Advancing by zero generations leaves the colony as it is.
     */
    public static Set<Cell> generationsAfter(Set<Cell> livingCells, int generations) {
        Set<Cell> colony = livingCells;
        for (int generation = 0; generation < generations; generation++) {
            colony = nextGeneration(colony);
        }
        return colony;
    }

    private static Set<Cell> cellsThatCouldChange(Set<Cell> livingCells) {
        return livingCells.stream()
                .flatMap(cell -> Stream.concat(Stream.of(cell), cell.neighbours().stream()))
                .collect(Collectors.toUnmodifiableSet());
    }

    private static int livingNeighbourCount(Cell cell, Set<Cell> livingCells) {
        return (int) cell.neighbours().stream().filter(livingCells::contains).count();
    }
}
