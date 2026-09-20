package gameoflife;

import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/** Conway's Game of Life on an infinite grid, tracking only the living cells. */
public final class GameOfLife {

  private GameOfLife() {
  }

  /** Returns the cells alive in the generation following {@code aliveCells}. */
  public static Set<Cell> nextGeneration(Set<Cell> aliveCells) {
    return neighbourCounts(aliveCells).entrySet().stream()
        .filter(entry -> isAliveInNextGeneration(entry.getKey(), entry.getValue(), aliveCells))
        .map(Map.Entry::getKey)
        .collect(Collectors.toUnmodifiableSet());
  }

  /** Counts, for every cell adjacent to a living cell, how many living neighbours it has. */
  private static Map<Cell, Long> neighbourCounts(Set<Cell> aliveCells) {
    return aliveCells.stream()
        .flatMap(Cell::neighbours)
        .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
  }

  private static boolean isAliveInNextGeneration(Cell cell, long neighbours, Set<Cell> aliveCells) {
    return neighbours == 3 || (neighbours == 2 && aliveCells.contains(cell));
  }
}
