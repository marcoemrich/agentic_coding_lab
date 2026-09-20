package gameoflife;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public final class GameOfLife {

    private static final List<Cell> OFFSETS = IntStream.rangeClosed(-1, 1)
            .boxed()
            .flatMap(dx -> IntStream.rangeClosed(-1, 1).mapToObj(dy -> new Cell(dx, dy)))
            .filter(offset -> offset.x() != 0 || offset.y() != 0)
            .toList();

    private GameOfLife() {
    }

    public static Set<Cell> nextGeneration(Set<Cell> aliveCells) {
        return candidates(aliveCells)
                .filter(cell -> isAliveNextGeneration(cell, aliveCells))
                .collect(Collectors.toUnmodifiableSet());
    }

    private static Stream<Cell> candidates(Set<Cell> aliveCells) {
        return Stream.concat(aliveCells.stream(), aliveCells.stream().flatMap(GameOfLife::neighboursOf))
                .distinct();
    }

    private static boolean isAliveNextGeneration(Cell cell, Set<Cell> aliveCells) {
        long liveNeighbours = neighboursOf(cell).filter(aliveCells::contains).count();
        return liveNeighbours == 3 || (liveNeighbours == 2 && aliveCells.contains(cell));
    }

    private static Stream<Cell> neighboursOf(Cell cell) {
        return OFFSETS.stream().map(offset -> new Cell(cell.x() + offset.x(), cell.y() + offset.y()));
    }
}
