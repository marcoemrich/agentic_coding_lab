import java.util.HashSet;
import java.util.Set;

final class Neighborhood {
    Set<Cell> around(Cell cell) {
        Set<Cell> neighbors = new HashSet<>();
        for (int xOffset = -1; xOffset <= 1; xOffset++) {
            for (int yOffset = -1; yOffset <= 1; yOffset++) {
                neighbors.add(new Cell(cell.x() + xOffset, cell.y() + yOffset));
            }
        }
        neighbors.remove(cell);
        return Set.copyOf(neighbors);
    }
}
