import java.util.LinkedHashSet;
import java.util.Set;

public class GameOfLife {

    public Set<Cell> advance(Set<Cell> livingCells, int generations) {
        Set<Cell> current = livingCells;
        for (int generation = 0; generation < generations; generation++) {
            current = nextGeneration(current);
        }
        return current;
    }

    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        Set<Cell> next = new LinkedHashSet<>();
        for (Cell cell : cellsThatMayChange(livingCells)) {
            if (isAliveNextGeneration(cell, livingCells)) {
                next.add(cell);
            }
        }
        return next;
    }

    private boolean isAliveNextGeneration(Cell cell, Set<Cell> livingCells) {
        int livingNeighbours = countLivingNeighbours(cell, livingCells);
        return livingCells.contains(cell)
                ? survives(livingNeighbours)
                : isBorn(livingNeighbours);
    }

    /**
     * On an infinite grid only a living cell or a cell adjacent to one can change state, so
     * these are the only cells the transition rules have to be asked about.
     */
    private Set<Cell> cellsThatMayChange(Set<Cell> livingCells) {
        Set<Cell> mayChange = new LinkedHashSet<>(livingCells);
        for (Cell cell : livingCells) {
            mayChange.addAll(cell.neighbours());
        }
        return mayChange;
    }

    private boolean survives(int livingNeighbours) {
        return livingNeighbours == 2 || livingNeighbours == 3;
    }

    private boolean isBorn(int livingNeighbours) {
        return livingNeighbours == 3;
    }

    private int countLivingNeighbours(Cell cell, Set<Cell> livingCells) {
        int count = 0;
        for (Cell neighbour : cell.neighbours()) {
            if (livingCells.contains(neighbour)) {
                count++;
            }
        }
        return count;
    }
}
