import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import org.junit.jupiter.api.Test;

class PolicyClaimTest {

    private static Item sword(String material, int enchantment) {
        return new Item("sword", material, enchantment, false);
    }

    private static Policy policyOf(Item... items) {
        return new Policy(List.of(items));
    }

    private static Damage damage(String itemType, int amount) {
        return new Damage(itemType, amount);
    }

    private static ClaimResult claim(Policy policy, Damage... damages) {
        return policy.settle(new Incident("dragon attack", List.of(damages)));
    }

    @Test
    void insuranceSumIsTheSumOfItemInsuranceValues() {
        assertEquals(1600, policyOf(sword("steel", 3), new Item("amulet", "silver", 2, false))
                .insuranceSum());
    }

    @Test
    void capIsTwiceTheInsuranceSum() {
        assertEquals(3200, policyOf(sword("steel", 3), new Item("amulet", "silver", 2, false))
                .cap());
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        assertEquals(2000, policyOf(new Item("sword", "steel", 3, true)).cap());
    }

    @Test
    void blockDiscountDoesNotLowerTheInsuranceSum() {
        Item rune = new Item("rune", null, null, false);
        assertEquals(1750, policyOf(sword("steel", 3), rune, rune, rune).insuranceSum());
    }

    @Test
    void regularSwordIsFullyReimbursedMinusTheDeductible() {
        assertEquals(400, claim(policyOf(sword("steel", 3)), damage("sword", 500)).payout());
    }

    @Test
    void runeDamageHasNoSpecialClause() {
        Item rune = new Item("rune", null, null, false);
        assertEquals(100, claim(policyOf(rune), damage("rune", 200)).payout());
    }

    @Test
    void highEnchantmentHalvesTheDamageBeforeTheDeductible() {
        assertEquals(400, claim(policyOf(sword("steel", 9)), damage("sword", 1000)).payout());
    }

    @Test
    void dragonMaterialAloneIsFullyReimbursed() {
        assertEquals(700, claim(policyOf(sword("dragon", 5)), damage("sword", 800)).payout());
    }

    @Test
    void halfRuleWinsOverDragonMaterialAtEnchantmentNine() {
        assertEquals(400, claim(policyOf(sword("dragon", 9)), damage("sword", 1000)).payout());
    }

    @Test
    void halfRuleAppliesAtExactlyEnchantmentEightEvenForDragonMaterial() {
        assertEquals(400, claim(policyOf(sword("dragon", 8)), damage("sword", 1000)).payout());
    }

    @Test
    void theDeductibleAppliesOncePerDamagedItem() {
        Policy policy = policyOf(sword("steel", 3), new Item("amulet", "silver", 2, false));
        assertEquals(600, claim(policy, damage("sword", 500), damage("amulet", 300)).payout());
    }

    @Test
    void damageBelowTheDeductibleYieldsNoPayout() {
        assertEquals(0, claim(policyOf(sword("steel", 3)), damage("sword", 80)).payout());
    }

    @Test
    void twoSwordsAreInsuredSeparately() {
        Policy policy = policyOf(sword("steel", 3), sword("steel", 3));
        assertEquals(2000, policy.insuranceSum());
        assertEquals(4000, policy.cap());
        assertEquals(800, claim(policy, damage("sword", 500), damage("sword", 500)).payout());
    }

    @Test
    void moreDamagesOfATypeThanInsuredItemsIsRejected() {
        Policy policy = policyOf(sword("steel", 3));
        assertThrows(ClaimOfficeException.class,
                () -> claim(policy, damage("sword", 500), damage("sword", 500)));
    }

    @Test
    void damageToAnItemOutsideThePolicyIsRejected() {
        Policy policy = policyOf(sword("steel", 3));
        assertThrows(ClaimOfficeException.class, () -> claim(policy, damage("amulet", 200)));
    }

    @Test
    void damageToAnUnknownItemTypeIsRejected() {
        Policy policy = policyOf(sword("steel", 3));
        assertThrows(ClaimOfficeException.class, () -> claim(policy, damage("broomstick", 200)));
    }

    @Test
    void negativeDamageIsRejected() {
        Policy policy = policyOf(sword("steel", 3));
        assertThrows(ClaimOfficeException.class, () -> claim(policy, damage("sword", -200)));
    }

    @Test
    void successiveClaimsExhaustTheCap() {
        Policy policy = policyOf(sword("steel", 3));
        ClaimResult first = claim(policy, damage("sword", 1500));
        assertEquals(1400, first.payout());
        assertEquals(600, first.remainingCap());

        ClaimResult second = claim(policy, damage("sword", 1500));
        assertEquals(600, second.payout());
        assertEquals(0, second.remainingCap());
    }
}
