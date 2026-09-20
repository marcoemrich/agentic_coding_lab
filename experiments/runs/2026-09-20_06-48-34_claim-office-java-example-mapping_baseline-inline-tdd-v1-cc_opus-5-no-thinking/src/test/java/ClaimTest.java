import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import org.junit.jupiter.api.Test;

class ClaimTest {

    private static final Item STEEL_SWORD = new Item("sword", "steel", 3, false);

    @Test
    void standardDamageIsFullyReimbursedMinusTheDeductible() {
        Policy policy = policyOf(STEEL_SWORD);
        assertEquals(400, policy.claim(damages("sword", 500)).payout());
    }

    @Test
    void componentsHaveNoSpecialClauses() {
        Policy policy = policyOf(new Item("rune", null, 0, false));
        assertEquals(100, policy.claim(damages("rune", 200)).payout());
    }

    @Test
    void highEnchantmentIsReimbursedAtHalfBeforeTheDeductible() {
        Policy policy = policyOf(new Item("sword", "steel", 9, false));
        assertEquals(400, policy.claim(damages("sword", 1000)).payout());
    }

    @Test
    void highEnchantmentStartsAtLevelEight() {
        assertEquals(400, policyOf(new Item("sword", "steel", 8, false)).claim(damages("sword", 1000)).payout());
        assertEquals(900, policyOf(new Item("sword", "steel", 7, false)).claim(damages("sword", 1000)).payout());
    }

    @Test
    void dragonMaterialAloneIsFullyReimbursed() {
        Policy policy = policyOf(new Item("sword", "dragon", 5, false));
        assertEquals(700, policy.claim(damages("sword", 800)).payout());
    }

    @Test
    void theHalvingRuleWinsOverDragonMaterial() {
        assertEquals(400, policyOf(new Item("sword", "dragon", 9, false)).claim(damages("sword", 1000)).payout());
        assertEquals(400, policyOf(new Item("sword", "dragon", 8, false)).claim(damages("sword", 1000)).payout());
    }

    @Test
    void theDeductibleAppliesOncePerDamagedItem() {
        Policy policy = policyOf(STEEL_SWORD, new Item("amulet", "silver", 1, false));
        List<Damage> damages = List.of(new Damage("sword", 500), new Damage("amulet", 300));
        assertEquals(600, policy.claim(damages).payout());
    }

    @Test
    void theCapIsTwiceTheInsuranceSum() {
        Policy policy = policyOf(STEEL_SWORD);
        assertEquals(new ClaimResult(1400, 600), policy.claim(damages("sword", 1500)));
        assertEquals(new ClaimResult(600, 0), policy.claim(damages("sword", 1500)));
    }

    @Test
    void theInsuranceSumAddsUpTheItemsUnmodifiedValues() {
        Policy policy = policyOf(STEEL_SWORD, new Item("amulet", "silver", 1, false));
        assertEquals(3200, policy.remainingCap());
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        assertEquals(2000, policyOf(new Item("sword", "steel", 3, true)).remainingCap());
    }

    @Test
    void theBlockDiscountDoesNotLowerTheInsuranceSum() {
        Policy policy = policyOf(STEEL_SWORD, rune(), rune(), rune());
        assertEquals(3500, policy.remainingCap());
    }

    @Test
    void eachDamageEntryOfTheSameTypeGetsItsOwnDeductible() {
        Policy policy = policyOf(STEEL_SWORD, STEEL_SWORD);
        assertEquals(4000, policy.remainingCap());
        List<Damage> damages = List.of(new Damage("sword", 500), new Damage("sword", 300));
        assertEquals(600, policy.claim(damages).payout());
    }

    @Test
    void damageToAnItemOutsideThePolicyIsRejected() {
        Policy policy = policyOf(STEEL_SWORD);
        assertThrows(ClaimOfficeException.class, () -> policy.claim(damages("amulet", 200)));
        assertThrows(ClaimOfficeException.class, () -> policy.claim(damages("broomstick", 200)));
    }

    @Test
    void moreDamagesOfATypeThanInsuredItemsIsRejected() {
        Policy policy = policyOf(STEEL_SWORD);
        List<Damage> damages = List.of(new Damage("sword", 200), new Damage("sword", 200));
        assertThrows(ClaimOfficeException.class, () -> policy.claim(damages));
    }

    @Test
    void negativeDamageAmountsAreRejected() {
        Policy policy = policyOf(STEEL_SWORD);
        assertThrows(ClaimOfficeException.class, () -> policy.claim(damages("sword", -200)));
    }

    @Test
    void fractionalPayoutsAreRoundedDownInTheOfficesFavour() {
        // halved damage of 901 G is 450.5 G; the deductible leaves 350.5 G
        Policy policy = policyOf(new Item("sword", "steel", 9, false));
        assertEquals(350, policy.claim(damages("sword", 901)).payout());
    }

    private static Item rune() {
        return new Item("rune", null, 0, false);
    }

    private static Policy policyOf(Item... items) {
        return new Policy(List.of(items));
    }

    private static List<Damage> damages(String itemType, int amount) {
        return List.of(new Damage(itemType, amount));
    }
}
