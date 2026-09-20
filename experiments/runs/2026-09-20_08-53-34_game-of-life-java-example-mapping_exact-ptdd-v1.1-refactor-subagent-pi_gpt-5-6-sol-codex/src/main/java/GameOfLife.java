import java.util.Set;
import java.util.stream.Collectors;

public final class GameOfLife {
    private final CellFate cellFate = new CellFate();
    private final Neighborhood neighborhood = new Neighborhood();

    public Set<Cell> nextGeneration(Set<Cell> aliveCells) {
        return neighborhood.generationCandidates(aliveCells).stream()
                .filter(cell -> livesInNextGeneration(cell, aliveCells))
                .collect(Collectors.toUnmodifiableSet());
    }

    private boolean livesInNextGeneration(Cell cell, Set<Cell> aliveCells) {
        long liveNeighbors = neighborhood.liveNeighborCount(cell, aliveCells);
        return cellFate.isAliveInNextGeneration(aliveCells.contains(cell), liveNeighbors);
    }

}
