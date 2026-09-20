package gameoflife;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {

  @Test
  void singleCellDies() {
    assertEquals(Set.of(), GameOfLife.nextGeneration(Set.of(new Cell(0, 0))));
  }

  @Test
  void pairOfCellsDiesOfUnderpopulation() {
    assertEquals(Set.of(), GameOfLife.nextGeneration(Set.of(new Cell(0, 1), new Cell(1, 1))));
  }

  @Test
  void liveCellWithTwoNeighboursSurvives() {
    Set<Cell> alive = Set.of(new Cell(0, 1), new Cell(1, 1), new Cell(2, 1));

    assertTrue(GameOfLife.nextGeneration(alive).contains(new Cell(1, 1)));
  }

  @Test
  void liveCellWithThreeNeighboursSurvives() {
    Set<Cell> alive =
        Set.of(new Cell(0, 1), new Cell(1, 1), new Cell(2, 1), new Cell(1, 0));

    assertTrue(GameOfLife.nextGeneration(alive).contains(new Cell(1, 1)));
  }

  @Test
  void liveCellWithFourNeighboursDiesOfOverpopulation() {
    Set<Cell> alive =
        Set.of(
            new Cell(0, 1), new Cell(1, 1), new Cell(2, 1),
            new Cell(1, 0), new Cell(1, 2));

    assertFalse(GameOfLife.nextGeneration(alive).contains(new Cell(1, 1)));
  }

  @Test
  void deadCellWithExactlyThreeNeighboursIsBorn() {
    Set<Cell> alive = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

    assertEquals(
        Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1)),
        GameOfLife.nextGeneration(alive));
  }

  @Test
  void blinkerOscillates() {
    Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
    Set<Cell> horizontal = Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1));

    assertEquals(horizontal, GameOfLife.nextGeneration(vertical));
    assertEquals(vertical, GameOfLife.nextGeneration(horizontal));
  }

  @Test
  void blockIsStillLife() {
    Set<Cell> block =
        Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

    assertEquals(block, GameOfLife.nextGeneration(block));
  }

  @Test
  void emptyGridStaysEmpty() {
    assertEquals(Set.of(), GameOfLife.nextGeneration(Set.of()));
  }

  @Test
  void gridIsInfiniteInNegativeDirections() {
    Set<Cell> block =
        Set.of(
            new Cell(-101, -100), new Cell(-100, -100),
            new Cell(-101, -101), new Cell(-100, -101));

    assertEquals(block, GameOfLife.nextGeneration(block));
  }
}
