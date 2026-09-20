import java.util.HashSet;
import java.util.Set;

public record Cell(int x, int y) {

    /**
     * The eight coordinates surrounding this cell on the infinite grid.
     * Adjacency is the model's only topological knowledge.
     */
    public Set<Cell> neighbours() {
        Set<Cell> neighbours = new HashSet<>();
        for (int dx = -1; dx <= 1; dx++) {
            for (int dy = -1; dy <= 1; dy++) {
                boolean isSelf = dx == 0 && dy == 0;
                if (!isSelf) {
                    neighbours.add(new Cell(x + dx, y + dy));
                }
            }
        }
        return Set.copyOf(neighbours);
    }
}
