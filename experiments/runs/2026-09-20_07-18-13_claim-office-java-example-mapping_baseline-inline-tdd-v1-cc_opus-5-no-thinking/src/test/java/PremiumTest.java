import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

class PremiumTest {

    @Test
    void emptyItemListCostsOnlyTheProcessingFee() {
        assertEquals(5, quote(0, List.of()));
    }

    @Test
    void chargesTheBasePremiumOfEachItemType() {
        assertEquals(100 + 10 + 5, quote(0, List.of(Item.of("sword"))));
        assertEquals(60 + 6 + 5, quote(0, List.of(Item.of("amulet"))));
        assertEquals(80 + 8 + 5, quote(0, List.of(Item.of("staff"))));
        assertEquals(40 + 4 + 5, quote(0, List.of(Item.of("potion"))));
    }

    private static int quote(int years, List<Item> items) {
        return new ClaimOffice(new Customer(years)).quote(items).premium();
    }
}
