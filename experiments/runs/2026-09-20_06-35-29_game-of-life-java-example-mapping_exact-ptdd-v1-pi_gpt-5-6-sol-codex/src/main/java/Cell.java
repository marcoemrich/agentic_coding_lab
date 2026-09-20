import java.util.HashSet;
import java.util.Set;

public record Cell(int x, int y) {
    public Set<Cell> neighbors() {
        Set<Cell> neighbors = new HashSet<>();
        for (int neighborX = x - 1; neighborX <= x + 1; neighborX++) {
            for (int neighborY = y - 1; neighborY <= y + 1; neighborY++) {
                Cell candidate = new Cell(neighborX, neighborY);
                if (!equals(candidate)) {
                    neighbors.add(candidate);
                }
            }
        }
        return Set.copyOf(neighbors);
    }

}
