import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

final class CellCoordinatesMapper {
    private CellCoordinatesMapper() {
    }

    static Set<Cell> toCells(List<int[]> coordinates) {
        return coordinates.stream()
                .map(coordinate -> new Cell(coordinate[0], coordinate[1]))
                .collect(Collectors.toSet());
    }

    static List<int[]> fromCells(Set<Cell> cells) {
        return cells.stream()
                .sorted(Comparator.comparingInt(Cell::x).thenComparingInt(Cell::y))
                .map(cell -> new int[]{cell.x(), cell.y()})
                .toList();
    }
}
