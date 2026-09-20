import gameoflife.Cell;
import java.util.Set;

/** One CLI request: the living cells to start from, and how many generations to apply. */
record GenerationRequest(Set<Cell> aliveCells, int steps) {
}
