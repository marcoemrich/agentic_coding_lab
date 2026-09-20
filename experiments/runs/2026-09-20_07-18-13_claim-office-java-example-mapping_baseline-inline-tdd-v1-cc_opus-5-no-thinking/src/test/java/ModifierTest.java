import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

/** Item-specific surcharges apply to the affected item, policy-wide ones to the total. */
class ModifierTest {

    private static final Item PLAIN_AMULET = new Item("amulet", "silver", 2, false);

    @Test
    void appliesTheCurseSurchargeOnlyToTheCursedItem() {
        // 160 G base + 50 G curse + 16 G first insurance (10 % of 160 G) + 5 G fee
        Item cursedSword = new Item("sword", "steel", 3, true);
        assertEquals(231, quote(0, List.of(cursedSword, PLAIN_AMULET)));
    }

    @Test
    void chargesThirtyPercentFromEnchantmentFive() {
        assertEquals(100 + 30 + 10 + 5, quote(0, List.of(sword(5, false))));
        assertEquals(100 + 10 + 5, quote(0, List.of(sword(4, false))));
    }

    @Test
    void stacksCurseAndHighEnchantmentOnTheSameItem() {
        // 100 G base + 50 G curse + 30 G enchantment + 10 G first insurance + 5 G fee
        assertEquals(195, quote(0, List.of(sword(5, true))));
    }

    @Test
    void grantsTheLoyaltyDiscountFromTwoYears() {
        assertEquals(100 - 20 + 10 + 5, quote(2, List.of(sword(3, false))));
        assertEquals(100 + 10 + 5, quote(1, List.of(sword(3, false))));
    }

    @Test
    void pricesTheNewcomerWithACursedSword() {
        assertEquals(165, quote(0, List.of(new Item("sword", "steel", 3, true))));
    }

    @Test
    void pricesTheLongStandingCustomersSecondContract() {
        ClaimOffice office = new ClaimOffice(new Customer(3));
        Item cursedSword = new Item("sword", "steel", 7, true);
        office.quote(List.of(PLAIN_AMULET));
        assertEquals(160, office.quote(List.of(cursedSword)).premium());
    }

    private static Item sword(int enchantment, boolean cursed) {
        return new Item("sword", "steel", enchantment, cursed);
    }

    private static int quote(int years, List<Item> items) {
        return new ClaimOffice(new Customer(years)).quote(items).premium();
    }
}
