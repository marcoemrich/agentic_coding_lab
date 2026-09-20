import java.util.Set;

/**
 * A request to advance a colony of living cells by a number of generations.
 * Domain data, free of any wire format.
 */
public record GenerationRequest(Set<Cell> livingCells, int generations) {
}
