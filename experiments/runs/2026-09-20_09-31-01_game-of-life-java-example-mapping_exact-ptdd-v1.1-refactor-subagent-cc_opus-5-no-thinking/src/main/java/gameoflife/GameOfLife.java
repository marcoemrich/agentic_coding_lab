package gameoflife;

import java.util.HashSet;
import java.util.Set;

public class GameOfLife {

    public Set<Cell> advance(Set<Cell> livingCells, int generations) {
        Set<Cell> population = livingCells;
        for (int generation = 0; generation < generations; generation++) {
            population = nextGeneration(population);
        }
        return population;
    }

    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        Set<Cell> nextGeneration = new HashSet<>();
        for (Cell cell : cellsThatCanChange(livingCells)) {
            if (isAliveNextGeneration(cell, livingCells)) {
                nextGeneration.add(cell);
            }
        }
        return nextGeneration;
    }

    private Set<Cell> cellsThatCanChange(Set<Cell> livingCells) {
        Set<Cell> cells = new HashSet<>(livingCells);
        for (Cell cell : livingCells) {
            cells.addAll(cell.neighbours());
        }
        return cells;
    }

    private boolean isAliveNextGeneration(Cell cell, Set<Cell> livingCells) {
        int livingNeighbours = countLivingNeighbours(cell, livingCells);
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
