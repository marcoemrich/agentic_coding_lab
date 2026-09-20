import java.util.HashSet;
import java.util.Set;

public final class GameOfLife {
    private final LifeRules rules = new LifeRules();
    private final Neighborhood neighborhood = new Neighborhood();

    public Set<Cell> nextGeneration(Set<Cell> livingCells) {
        Set<Cell> nextGeneration = new HashSet<>(survivingLivingCells(livingCells));
        nextGeneration.addAll(newlyBornCells(livingCells));
        return Set.copyOf(nextGeneration);
    }

    private Set<Cell> survivingLivingCells(Set<Cell> livingCells) {
        Set<Cell> survivors = new HashSet<>();
        for (Cell cell : livingCells) {
            if (rules.survives(liveNeighborCount(cell, livingCells))) {
                survivors.add(cell);
            }
        }
        return Set.copyOf(survivors);
    }

    private Set<Cell> newlyBornCells(Set<Cell> livingCells) {
        Set<Cell> candidates = birthCandidates(livingCells);
        candidates.removeIf(cell -> !rules.isBorn(liveNeighborCount(cell, livingCells)));
        return candidates;
    }

    private Set<Cell> birthCandidates(Set<Cell> livingCells) {
        Set<Cell> candidates = new HashSet<>();
        for (Cell cell : livingCells) {
            candidates.addAll(neighborhood.around(cell));
        }
        candidates.removeAll(livingCells);
        return candidates;
    }

    private long liveNeighborCount(Cell cell, Set<Cell> livingCells) {
        return neighborhood.around(cell).stream()
                .filter(livingCells::contains)
                .count();
    }
}
