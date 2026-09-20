package gameoflife;

import java.util.List;
import java.util.stream.IntStream;
import java.util.stream.Stream;

/** A cell on the infinite grid, identified by its integer coordinates. */
public record Cell(int x, int y) {

  private static final List<int[]> OFFSETS =
      IntStream.rangeClosed(-1, 1)
          .boxed()
          .flatMap(dx -> IntStream.rangeClosed(-1, 1).mapToObj(dy -> new int[] {dx, dy}))
          .filter(offset -> offset[0] != 0 || offset[1] != 0)
          .toList();

  /** The eight cells surrounding this one. */
  public Stream<Cell> neighbours() {
    return OFFSETS.stream().map(offset -> new Cell(x + offset[0], y + offset[1]));
  }
}
