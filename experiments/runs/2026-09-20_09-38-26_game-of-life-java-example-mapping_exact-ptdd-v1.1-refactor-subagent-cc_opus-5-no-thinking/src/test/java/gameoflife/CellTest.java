package gameoflife;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class CellTest {

    @Test
    void cellsWithSameCoordinatesAreEqual() {
        assertEquals(new Cell(2, -3), new Cell(2, -3));
        assertEquals(new Cell(2, -3).hashCode(), new Cell(2, -3).hashCode());
    }

    @Test
    void cellExposesItsCoordinates() {
        Cell cell = new Cell(2, -3);

        assertEquals(2, cell.x());
        assertEquals(-3, cell.y());
    }
}
