package gameoflife;

import java.util.Set;
import java.util.stream.Collectors;

public class GameOfLife {

    public Set<Cell> nextGeneration(Set<Cell> aliveCells) {
        return candidates(aliveCells).stream()
                .filter(cell -> livesOn(cell, aliveCells))
                .collect(Collectors.toUnmodifiableSet());
    }

    private Set<Cell> candidates(Set<Cell> aliveCells) {
        return aliveCells.stream()
                .flatMap(cell -> cell.neighbors().stream())
                .collect(Collectors.toCollection(() -> new java.util.HashSet<>(aliveCells)));
    }

    private boolean livesOn(Cell cell, Set<Cell> aliveCells) {
        long liveNeighbors = cell.neighbors().stream().filter(aliveCells::contains).count();
        return liveNeighbors == 3 || (liveNeighbors == 2 && aliveCells.contains(cell));
    }
}
