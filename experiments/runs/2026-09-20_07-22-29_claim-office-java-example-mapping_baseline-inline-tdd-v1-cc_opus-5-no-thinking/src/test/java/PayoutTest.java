import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

/** The payout for a single damaged item: special clauses first, then the deductible. */
class PayoutTest {

    private static int payout(Item item, int damage) {
        return Claims.itemPayout(item, BigDecimal.valueOf(damage)).intValueExact();
    }

    private static Item sword(String material, int enchantment) {
        return new Item("sword", material, enchantment, false);
    }

    @Test
    void aRegularItemIsReimbursedMinusTheDeductible() {
        assertEquals(400, payout(sword("steel", 3), 500));
    }

    @Test
    void aComponentWithoutEnchantmentOrMaterialHasNoSpecialClause() {
        assertEquals(100, payout(new Item("rune", null, 0, false), 200));
    }

    @Test
    void enchantmentEightIsReimbursedAtHalf() {
        assertEquals(400, payout(sword("steel", 8), 1000));
    }

    @Test
    void enchantmentNineIsReimbursedAtHalf() {
        assertEquals(400, payout(sword("steel", 9), 1000));
    }

    @Test
    void dragonMaterialIsFullyReimbursed() {
        assertEquals(700, payout(sword("dragon", 5), 800));
    }

    @Test
    void theHalfRuleWinsOverDragonMaterial() {
        assertEquals(400, payout(sword("dragon", 9), 1000));
        assertEquals(400, payout(sword("dragon", 8), 1000));
    }

    @Test
    void aDamageBelowTheDeductibleDoesNotPayOut() {
        assertEquals(0, payout(sword("steel", 3), 60));
    }

    @Test
    void payoutsAreRoundedDownInTheOfficesFavour() {
        assertEquals(350, Claims.roundPayout(new BigDecimal("350.5")));
    }
}
