package gameoflife;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class GameOfLife {

    private static final int MINIMUM_NEIGHBOURS_TO_SURVIVE = 2;
    private static final int MAXIMUM_NEIGHBOURS_TO_SURVIVE = 3;
    private static final int NEIGHBOURS_REQUIRED_FOR_BIRTH = 3;

    /** Applies {@link #nextGeneration} the given number of times, starting from the given cells. */
    public Set<Cell> generationsAfter(Set<Cell> livingCells, int generations) {
        Set<Cell> cells = livingCells;
        for (int generation = 0; generation < generations; generation++) {
            cells = nextGeneration(cells);
        }
        return cells;
    }

    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        return candidates(livingCells).stream()
                .filter(cell -> isAliveNextGeneration(cell, livingCells))
                .collect(Collectors.toSet());
    }

    private Set<Cell> candidates(Set<Cell> livingCells) {
        Set<Cell> candidates = new HashSet<>(livingCells);
        livingCells.forEach(cell -> candidates.addAll(cell.neighbours()));
        return candidates;
    }

    private boolean isAliveNextGeneration(Cell cell, Set<Cell> livingCells) {
        int livingNeighbours = livingNeighbourCount(cell, livingCells);
        return livingCells.contains(cell)
                ? survives(livingNeighbours)
                : isBorn(livingNeighbours);
    }

    private boolean survives(int livingNeighbours) {
        return livingNeighbours >= MINIMUM_NEIGHBOURS_TO_SURVIVE
                && livingNeighbours <= MAXIMUM_NEIGHBOURS_TO_SURVIVE;
    }

    private boolean isBorn(int livingNeighbours) {
        return livingNeighbours == NEIGHBOURS_REQUIRED_FOR_BIRTH;
    }

    private int livingNeighbourCount(Cell cell, Set<Cell> livingCells) {
        return (int) cell.neighbours().stream()
                .filter(livingCells::contains)
                .count();
    }
}
