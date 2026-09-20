import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

/** The worked examples from the MHPCO rule book, end to end. */
class SpecExamplesTest {

    private static int payoutOf(String material, int enchantment, int damage) {
        Policy policy = new Policy(List.of(new Item("sword", material, enchantment, false)));
        return policy.settle(List.of(new Damage("sword", damage)));
    }

    @Test
    void dragonSwordWithEnchantmentEight() {
        assertEquals(400, payoutOf("dragon", 8, 1000));
    }

    @Test
    void dragonSwordWithEnchantmentNine() {
        assertEquals(400, payoutOf("dragon", 9, 1000));
    }

    @Test
    void dragonSwordWithEnchantmentFive() {
        assertEquals(700, payoutOf("dragon", 5, 800));
    }

    @Test
    void steelSwordWithEnchantmentNine() {
        assertEquals(400, payoutOf("steel", 9, 1000));
    }

    @Test
    void regularSword() {
        assertEquals(400, payoutOf("steel", 3, 500));
    }

    @Test
    void aDragonAttackOnTwoInsuredItems() {
        Policy policy = new Policy(List.of(
                new Item("sword", "steel", 3, false),
                new Item("amulet", "silver", 2, false)));
        assertEquals(600,
                policy.settle(List.of(new Damage("sword", 500), new Damage("amulet", 300))));
        assertEquals(2600, policy.remainingCap());
    }

    @Test
    void aRuneIsReimbursedMinusTheDeductible() {
        Policy policy = new Policy(List.of(new Item("rune", null, 0, false)));
        assertEquals(100, policy.settle(List.of(new Damage("rune", 200))));
    }

    @Test
    void theCapOfACursedSwordIsBasedOnTheUnmodifiedInsuranceValue() {
        Item cursedSword = new Item("sword", "steel", 3, true);
        assertEquals(165, Premium.quote(new Customer(0), 0, List.of(cursedSword)));
        assertEquals(2000, new Policy(List.of(cursedSword)).remainingCap());
    }
}
