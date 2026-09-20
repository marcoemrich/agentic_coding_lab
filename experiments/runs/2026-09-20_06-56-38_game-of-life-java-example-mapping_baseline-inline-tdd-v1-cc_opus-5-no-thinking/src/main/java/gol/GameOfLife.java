package gol;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public final class GameOfLife {

    private GameOfLife() {
    }

    public static Set<Cell> nextGeneration(Set<Cell> aliveCells) {
        return candidates(aliveCells).stream()
                .filter(cell -> isAliveNextGeneration(cell, aliveCells))
                .collect(Collectors.toUnmodifiableSet());
    }

    private static Set<Cell> candidates(Set<Cell> aliveCells) {
        Set<Cell> candidates = new HashSet<>(aliveCells);
        aliveCells.forEach(cell -> candidates.addAll(cell.neighbours()));
        return candidates;
    }

    private static boolean isAliveNextGeneration(Cell cell, Set<Cell> aliveCells) {
        long liveNeighbours = cell.neighbours().stream().filter(aliveCells::contains).count();
        return liveNeighbours == 3 || (liveNeighbours == 2 && aliveCells.contains(cell));
    }
}
