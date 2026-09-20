import java.util.LinkedHashSet;
import java.util.Set;

public record Cell(int x, int y) {

    public Set<Cell> neighbors() {
        Set<Cell> neighbors = new LinkedHashSet<>();
        for (int dx = -1; dx <= 1; dx++) {
            for (int dy = -1; dy <= 1; dy++) {
                if (dx != 0 || dy != 0) {
                    neighbors.add(new Cell(x + dx, y + dy));
                }
            }
        }
        return neighbors;
    }
}
