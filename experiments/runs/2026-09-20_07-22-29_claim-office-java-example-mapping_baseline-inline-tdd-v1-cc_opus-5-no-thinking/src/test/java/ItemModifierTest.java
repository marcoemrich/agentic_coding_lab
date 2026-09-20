import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;

/** Cursed and highly enchanted items are surcharged on their own base premium. */
class ItemModifierTest {

    private static BigDecimal surcharges(Item... items) {
        return Premium.itemSurcharges(List.of(items));
    }

    private static Item sword(int enchantment, boolean cursed) {
        return new Item("sword", "steel", enchantment, cursed);
    }

    @Test
    void aPlainItemIsNotSurcharged() {
        assertEquals(0, surcharges(sword(3, false)).compareTo(BigDecimal.ZERO));
    }

    @Test
    void aCursedItemAddsHalfItsBasePremium() {
        assertEquals(0, surcharges(sword(3, true)).compareTo(BigDecimal.valueOf(50)));
    }

    @Test
    void enchantmentFourIsNotHighlyEnchanted() {
        assertEquals(0, surcharges(sword(4, false)).compareTo(BigDecimal.ZERO));
    }

    @Test
    void enchantmentFiveAddsThirtyPercent() {
        assertEquals(0, surcharges(sword(5, false)).compareTo(BigDecimal.valueOf(30)));
    }

    @Test
    void cursedAndHighlyEnchantedStack() {
        assertEquals(0, surcharges(sword(5, true)).compareTo(BigDecimal.valueOf(80)));
    }

    @Test
    void surchargesApplyPerItemNotToThePolicyTotal() {
        Item cursedSword = sword(3, true);
        Item plainAmulet = new Item("amulet", "silver", 1, false);
        assertEquals(0, surcharges(cursedSword, plainAmulet).compareTo(BigDecimal.valueOf(50)));
    }

    @Test
    void componentsCanBeSurchargedOnTheirOwnBasePremium() {
        assertEquals(0,
                surcharges(new Item("rune", null, 0, true)).compareTo(BigDecimal.valueOf(12.5)));
    }
}
