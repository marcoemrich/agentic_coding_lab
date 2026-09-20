import java.util.HashSet;
import java.util.Set;

public class GameOfLife {

    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        Set<Cell> nextGeneration = new HashSet<>();
        for (Cell cell : cellsThatCouldChange(livingCells)) {
            if (isAliveNextGeneration(cell, livingCells)) {
                nextGeneration.add(cell);
            }
        }
        return nextGeneration;
    }

    private Set<Cell> cellsThatCouldChange(Set<Cell> livingCells) {
        Set<Cell> candidates = new HashSet<>(livingCells);
        for (Cell cell : livingCells) {
            candidates.addAll(cell.neighbours());
        }
        return candidates;
    }

    private boolean isAliveNextGeneration(Cell cell, Set<Cell> livingCells) {
        int livingNeighbours = livingNeighboursOf(cell, livingCells);
        if (livingCells.contains(cell)) {
            return survives(livingNeighbours);
        }
        return isBorn(livingNeighbours);
    }

    private boolean survives(int livingNeighbours) {
        return livingNeighbours == 2 || livingNeighbours == 3;
    }

    private boolean isBorn(int livingNeighbours) {
        return livingNeighbours == 3;
    }

    private int livingNeighboursOf(Cell cell, Set<Cell> livingCells) {
        int count = 0;
        for (Cell neighbour : cell.neighbours()) {
            if (livingCells.contains(neighbour)) {
                count++;
            }
        }
        return count;
    }
}
