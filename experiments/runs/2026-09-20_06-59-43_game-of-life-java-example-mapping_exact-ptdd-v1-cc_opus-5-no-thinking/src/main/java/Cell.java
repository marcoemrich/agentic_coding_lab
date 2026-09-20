import java.util.HashSet;
import java.util.Set;

public record Cell(int x, int y) {

    public Set<Cell> neighbours() {
        Set<Cell> neighbours = new HashSet<>();
        for (int dx = -1; dx <= 1; dx++) {
            for (int dy = -1; dy <= 1; dy++) {
                if (dx != 0 || dy != 0) {
                    neighbours.add(new Cell(x + dx, y + dy));
                }
            }
        }
        return neighbours;
    }
}
