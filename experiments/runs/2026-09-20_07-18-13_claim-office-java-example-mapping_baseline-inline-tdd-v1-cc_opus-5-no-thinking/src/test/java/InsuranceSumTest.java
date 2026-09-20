import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

/** The cap is twice the insurance sum, built from unmodified item values only. */
class InsuranceSumTest {

    @Test
    void addsUpTheUnmodifiedValuesOfAllItems() {
        assertEquals(3200, cap(List.of(Item.of("sword"), Item.of("amulet"))));
        assertEquals(4000, cap(List.of(Item.of("sword"), Item.of("sword"))));
    }

    @Test
    void ignoresPremiumModifiersAndBlockDiscounts() {
        assertEquals(2000, cap(List.of(new Item("sword", "steel", 3, true))));
        assertEquals(3500, cap(List.of(Item.of("sword"), Item.of("rune"), Item.of("rune"), Item.of("rune"))));
    }

    private static int cap(List<Item> items) {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        office.quote(items);
        return office.claim(0, List.of()).remainingCap();
    }
}
