import gameoflife.Cell;
import java.util.Set;

/** A CLI request: the living cells to start from, and how many generations to advance. */
record GenerationRequest(Set<Cell> livingCells, int steps) {
}
