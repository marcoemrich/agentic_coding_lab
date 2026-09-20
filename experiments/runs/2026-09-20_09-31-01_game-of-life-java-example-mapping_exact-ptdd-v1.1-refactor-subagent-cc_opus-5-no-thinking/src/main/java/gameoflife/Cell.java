package gameoflife;

import java.util.ArrayList;
import java.util.List;

public record Cell(int x, int y) {

    public List<Cell> neighbours() {
        List<Cell> neighbours = new ArrayList<>(8);
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
