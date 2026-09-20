import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {
    @Test
    void singleCellDies() {
        assertEquals(Set.of(), new GameOfLife().nextGeneration(Set.of(new Cell(0, 0))));
    }

    @Test
    void cellsWithOneNeighborDieFromUnderpopulation() {
        Set<Cell> livingCells = Set.of(new Cell(0, 1), new Cell(1, 1));

        assertEquals(Set.of(), new GameOfLife().nextGeneration(livingCells));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        Cell center = new Cell(0, 0);
        Set<Cell> livingCells = Set.of(new Cell(-1, 0), center, new Cell(1, 0));

        assertTrue(new GameOfLife().nextGeneration(livingCells).contains(center));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        Cell center = new Cell(0, 0);
        Set<Cell> livingCells = Set.of(
                center, new Cell(-1, 0), new Cell(1, 0), new Cell(0, 1));

        assertTrue(new GameOfLife().nextGeneration(livingCells).contains(center));
    }

    @Test
    void picturedSurvivalExampleProducesExpectedGeneration() {
        Cell center = new Cell(1, 1);
        Set<Cell> livingCells = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), center);

        assertTrue(new GameOfLife().nextGeneration(livingCells).contains(center));
    }

    @Test
    void liveCellWithFourNeighborsDiesFromOverpopulation() {
        Cell center = new Cell(0, 0);
        Set<Cell> livingCells = Set.of(
                center,
                new Cell(-1, 0), new Cell(1, 0),
                new Cell(0, -1), new Cell(0, 1));

        assertFalse(new GameOfLife().nextGeneration(livingCells).contains(center));
    }

    @Test
    void picturedOverpopulationExampleProducesExpectedGeneration() {
        Set<Cell> livingCells = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(2, 0),
                new Cell(1, 1),
                new Cell(0, 2), new Cell(1, 2), new Cell(2, 2));

        assertEquals(
                Set.of(
                        new Cell(0, 0), new Cell(1, 0), new Cell(2, 0), new Cell(1, -1),
                        new Cell(0, 2), new Cell(1, 2), new Cell(2, 2), new Cell(1, 3)),
                new GameOfLife().nextGeneration(livingCells));
    }

    @Test
    void deadCellWithExactlyThreeNeighborsIsBorn() {
        Set<Cell> livingCells = Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1));

        assertEquals(
                Set.of(new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1)),
                new GameOfLife().nextGeneration(livingCells));
    }

    @Test
    void blockIsAStillLife() {
        Set<Cell> block = Set.of(
                new Cell(0, 0), new Cell(1, 0), new Cell(0, 1), new Cell(1, 1));

        assertEquals(block, new GameOfLife().nextGeneration(block));
    }

    @Test
    void verticalBlinkerBecomesHorizontal() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));

        assertEquals(
                Set.of(new Cell(-1, 1), new Cell(0, 1), new Cell(1, 1)),
                new GameOfLife().nextGeneration(vertical));
    }

    @Test
    void blinkerReturnsAfterTwoGenerations() {
        Set<Cell> vertical = Set.of(new Cell(0, 0), new Cell(0, 1), new Cell(0, 2));
        GameOfLife game = new GameOfLife();

        assertEquals(vertical, game.nextGeneration(game.nextGeneration(vertical)));
    }

    @Test
    void negativeCoordinatesHaveNoGridBoundary() {
        Set<Cell> vertical = Set.of(new Cell(-2, -3), new Cell(-2, -2), new Cell(-2, -1));

        assertEquals(
                Set.of(new Cell(-3, -2), new Cell(-2, -2), new Cell(-1, -2)),
                new GameOfLife().nextGeneration(vertical));
    }

    @Test
    void cliMatchesSpecifiedJsonExample() throws Exception {
        assertEquals(
                "{\"aliveCells\":[]}",
                runCli("{\"aliveCells\":[[0,0],[1,0]],\"steps\":1}"));
    }

    @Test
    void cliAppliesRequestedNumberOfSteps() throws Exception {
        assertEquals(
                "{\"aliveCells\":[[0,0],[0,1],[0,2]]}",
                runCli("{\"aliveCells\":[[0,0],[0,1],[0,2]],\"steps\":2}"));
    }

    @Test
    void cliSortsOutputByXThenY() throws Exception {
        assertEquals(
                "{\"aliveCells\":[[-1,5],[0,4],[2,-3],[2,1]]}",
                runCli("{\"aliveCells\":[[2,1],[-1,5],[2,-3],[0,4]],\"steps\":0}"));
    }

    private String runCli(String input) throws Exception {
        InputStream originalIn = System.in;
        PrintStream originalOut = System.out;
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(output, true, StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
            return output.toString(StandardCharsets.UTF_8);
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }
    }
}
