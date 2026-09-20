import java.util.LinkedHashSet;
import java.util.Set;

public class GameOfLife {

    private static final int MINIMUM_NEIGHBORS_TO_SURVIVE = 2;
    private static final int MAXIMUM_NEIGHBORS_TO_SURVIVE = 3;
    private static final int NEIGHBORS_REQUIRED_FOR_BIRTH = 3;

    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        Set<Cell> nextGeneration = new LinkedHashSet<>();
        for (Cell cell : candidates(livingCells)) {
            if (isAliveNextGeneration(cell, livingCells)) {
                nextGeneration.add(cell);
            }
        }
        return nextGeneration;
    }

    private Set<Cell> candidates(Set<Cell> livingCells) {
        Set<Cell> candidates = new LinkedHashSet<>(livingCells);
        for (Cell livingCell : livingCells) {
            candidates.addAll(livingCell.neighbors());
        }
        return candidates;
    }

    private boolean isAliveNextGeneration(Cell cell, Set<Cell> livingCells) {
        int neighbors = livingNeighborCount(cell, livingCells);
        if (livingCells.contains(cell)) {
            return survives(neighbors);
        }
        return isBorn(neighbors);
    }

    private boolean survives(int livingNeighbors) {
        return livingNeighbors >= MINIMUM_NEIGHBORS_TO_SURVIVE
                && livingNeighbors <= MAXIMUM_NEIGHBORS_TO_SURVIVE;
    }

    private boolean isBorn(int livingNeighbors) {
        return livingNeighbors == NEIGHBORS_REQUIRED_FOR_BIRTH;
    }

    private int livingNeighborCount(Cell cell, Set<Cell> livingCells) {
        int count = 0;
        for (Cell neighbor : cell.neighbors()) {
            if (livingCells.contains(neighbor)) {
                count++;
            }
        }
        return count;
    }
}
