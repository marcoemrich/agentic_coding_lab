package gameoflife;

import java.util.HashSet;
import java.util.Set;

public final class GameOfLife {

    private GameOfLife() {
    }

    public static Set<Cell> nextGeneration(Set<Cell> aliveCells) {
        Set<Cell> next = new HashSet<>();
        for (Cell candidate : candidates(aliveCells)) {
            if (isAliveNextGeneration(candidate, aliveCells)) {
                next.add(candidate);
            }
        }
        return next;
    }

    private static Set<Cell> candidates(Set<Cell> aliveCells) {
        Set<Cell> candidates = new HashSet<>(aliveCells);
        for (Cell cell : aliveCells) {
            candidates.addAll(cell.neighbors());
        }
        return candidates;
    }

    private static boolean isAliveNextGeneration(Cell cell, Set<Cell> aliveCells) {
        long count = liveNeighborCount(cell, aliveCells);
        return aliveCells.contains(cell) ? count == 2 || count == 3 : count == 3;
    }

    private static long liveNeighborCount(Cell cell, Set<Cell> aliveCells) {
        return cell.neighbors().stream().filter(aliveCells::contains).count();
    }
}
