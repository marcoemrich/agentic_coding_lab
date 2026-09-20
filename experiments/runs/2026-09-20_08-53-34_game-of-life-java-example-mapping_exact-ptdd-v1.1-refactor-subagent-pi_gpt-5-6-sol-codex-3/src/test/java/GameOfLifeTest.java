import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class GameOfLifeTest {
    @Test
    void emptyGenerationRemainsEmpty() {
        org.junit.jupiter.api.Assertions.assertEquals(
                java.util.Set.of(), GameOfLife.nextGeneration(java.util.Set.of()));
    }

    @Test
    void singleCellDiesFromUnderpopulation() {
        org.junit.jupiter.api.Assertions.assertEquals(
                java.util.Set.of(),
                GameOfLife.nextGeneration(java.util.Set.of(new GameOfLife.Cell(0, 0))));
    }

    @Test
    void twoAdjacentCellsDieFromUnderpopulation() {
        var alive = java.util.Set.of(new GameOfLife.Cell(0, 1), new GameOfLife.Cell(1, 1));
        org.junit.jupiter.api.Assertions.assertEquals(
                java.util.Set.of(), GameOfLife.nextGeneration(alive));
    }

    @Test
    void liveCellWithTwoNeighborsSurvives() {
        var center = new GameOfLife.Cell(0, 0);
        var alive = java.util.Set.of(
                center, new GameOfLife.Cell(-1, 0), new GameOfLife.Cell(0, 1));
        org.junit.jupiter.api.Assertions.assertTrue(
                GameOfLife.nextGeneration(alive).contains(center));
    }

    @Test
    void liveCellWithThreeNeighborsSurvives() {
        var center = new GameOfLife.Cell(0, 0);
        var alive = java.util.Set.of(
                center,
                new GameOfLife.Cell(-1, 0),
                new GameOfLife.Cell(0, 1),
                new GameOfLife.Cell(1, 0));
        org.junit.jupiter.api.Assertions.assertTrue(
                GameOfLife.nextGeneration(alive).contains(center));
    }

    @Test
    void liveCellWithMoreThanThreeNeighborsDies() {
        var center = new GameOfLife.Cell(1, 1);
        var alive = java.util.Set.of(
                center,
                new GameOfLife.Cell(0, 0),
                new GameOfLife.Cell(1, 0),
                new GameOfLife.Cell(2, 0),
                new GameOfLife.Cell(0, 1));
        org.junit.jupiter.api.Assertions.assertFalse(
                GameOfLife.nextGeneration(alive).contains(center));
    }

    @Test
    void deadCellWithThreeNeighborsBecomesAlive() {
        var alive = java.util.Set.of(
                new GameOfLife.Cell(0, 0),
                new GameOfLife.Cell(1, 0),
                new GameOfLife.Cell(0, 1));
        var expected = java.util.Set.of(
                new GameOfLife.Cell(0, 0),
                new GameOfLife.Cell(1, 0),
                new GameOfLife.Cell(0, 1),
                new GameOfLife.Cell(1, 1));
        org.junit.jupiter.api.Assertions.assertEquals(
                expected, GameOfLife.nextGeneration(alive));
    }

    @Test
    void blinkerMovesHorizontallyAcrossNegativeAndPositiveCoordinates() {
        var vertical = java.util.Set.of(
                new GameOfLife.Cell(0, 0),
                new GameOfLife.Cell(0, 1),
                new GameOfLife.Cell(0, 2));
        var horizontal = java.util.Set.of(
                new GameOfLife.Cell(-1, 1),
                new GameOfLife.Cell(0, 1),
                new GameOfLife.Cell(1, 1));
        org.junit.jupiter.api.Assertions.assertEquals(
                horizontal, GameOfLife.nextGeneration(vertical));
    }

    @Test
    void blinkerReturnsAfterTwoGenerations() {
        var vertical = java.util.Set.of(
                new GameOfLife.Cell(0, 0),
                new GameOfLife.Cell(0, 1),
                new GameOfLife.Cell(0, 2));
        var afterTwo = GameOfLife.nextGeneration(GameOfLife.nextGeneration(vertical));
        org.junit.jupiter.api.Assertions.assertEquals(vertical, afterTwo);
    }

    @Test
    void blockIsAStillLife() {
        var block = java.util.Set.of(
                new GameOfLife.Cell(0, 0),
                new GameOfLife.Cell(1, 0),
                new GameOfLife.Cell(0, 1),
                new GameOfLife.Cell(1, 1));
        org.junit.jupiter.api.Assertions.assertEquals(
                block, GameOfLife.nextGeneration(block));
    }

    @Test
    void cliAppliesOneGeneration() throws Exception {
        org.junit.jupiter.api.Assertions.assertEquals(
                "{\"aliveCells\":[]}",
                runCli("{\"aliveCells\":[[0,0],[1,0]],\"steps\":1}"));
    }

    @Test
    void cliAppliesStepsAndSortsOutput() throws Exception {
        var input = "{\"aliveCells\":[[1,1],[-1,1],[0,1]],\"steps\":2}";
        org.junit.jupiter.api.Assertions.assertEquals(
                "{\"aliveCells\":[[-1,1],[0,1],[1,1]]}", runCli(input));
    }

    private static String runCli(String input) throws Exception {
        var originalIn = System.in;
        var originalOut = System.out;
        var output = new java.io.ByteArrayOutputStream();
        try {
            System.setIn(new java.io.ByteArrayInputStream(
                    input.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
            System.setOut(new java.io.PrintStream(output, true, java.nio.charset.StandardCharsets.UTF_8));
            GameOfLifeCli.main(new String[0]);
            return output.toString(java.nio.charset.StandardCharsets.UTF_8).trim();
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }
    }
}
