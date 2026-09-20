import java.util.HashSet;
import java.util.Set;

public record Cell(int x, int y) {
    Set<Cell> neighbors() {
        Set<Cell> neighbors = new HashSet<>();
        for (int neighborX = x - 1; neighborX <= x + 1; neighborX++) {
            for (int neighborY = y - 1; neighborY <= y + 1; neighborY++) {
                Cell neighbor = new Cell(neighborX, neighborY);
                if (!equals(neighbor)) {
                    neighbors.add(neighbor);
                }
            }
        }
        return neighbors;
    }
}
