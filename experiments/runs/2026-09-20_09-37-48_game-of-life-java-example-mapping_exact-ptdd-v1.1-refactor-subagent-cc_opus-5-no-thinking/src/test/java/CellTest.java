import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import org.junit.jupiter.api.Test;

class CellTest {

    @Test
    void cellIsAValueTypeWithEqualityByCoordinates() {
        assertEquals(new Cell(1, 2), new Cell(1, 2));
        assertEquals(new Cell(1, 2).hashCode(), new Cell(1, 2).hashCode());
        assertNotEquals(new Cell(1, 2), new Cell(2, 1));
    }
}
