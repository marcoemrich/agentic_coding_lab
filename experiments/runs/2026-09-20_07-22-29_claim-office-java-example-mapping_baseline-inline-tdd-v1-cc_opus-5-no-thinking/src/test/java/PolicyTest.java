import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import org.junit.jupiter.api.Test;

/** A policy tracks its insurance sum and the cap remaining across successive claims. */
class PolicyTest {

    private static final Item SWORD = new Item("sword", "steel", 3, false);
    private static final Item AMULET = new Item("amulet", "silver", 1, false);

    private static Policy policyOf(Item... items) {
        return new Policy(List.of(items));
    }

    private static Damage damage(String itemType, int amount) {
        return new Damage(itemType, amount);
    }

    @Test
    void theInsuranceSumIsTheSumOfTheItemValues() {
        assertEquals(1600, policyOf(SWORD, AMULET).insuranceSum());
    }

    @Test
    void theCapIsTwiceTheInsuranceSum() {
        assertEquals(3200, policyOf(SWORD, AMULET).remainingCap());
    }

    @Test
    void theBlockDiscountDoesNotLowerTheInsuranceSum() {
        Item rune = new Item("rune", null, 0, false);
        assertEquals(1750, policyOf(SWORD, rune, rune, rune).insuranceSum());
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        assertEquals(2000, policyOf(new Item("sword", "steel", 3, true)).remainingCap());
    }

    @Test
    void twoSwordsAreInsuredTwice() {
        Policy policy = policyOf(SWORD, SWORD);
        assertEquals(2000, policy.insuranceSum());
        assertEquals(4000, policy.remainingCap());
    }

    @Test
    void theDeductibleAppliesOncePerDamagedItem() {
        Policy policy = policyOf(SWORD, AMULET);
        assertEquals(600, policy.settle(List.of(damage("sword", 500), damage("amulet", 300))));
    }

    @Test
    void eachDamageEntryOfTheSameTypeGetsItsOwnDeductible() {
        Policy policy = policyOf(SWORD, SWORD);
        assertEquals(800, policy.settle(List.of(damage("sword", 500), damage("sword", 500))));
    }

    @Test
    void theCapIsExhaustedAcrossSuccessiveClaims() {
        Policy policy = policyOf(SWORD);
        assertEquals(1400, policy.settle(List.of(damage("sword", 1500))));
        assertEquals(600, policy.remainingCap());
        assertEquals(600, policy.settle(List.of(damage("sword", 1500))));
        assertEquals(0, policy.remainingCap());
    }

    @Test
    void moreDamagesOfATypeThanInsuredAreRejected() {
        Policy policy = policyOf(SWORD);
        assertThrows(ClaimOfficeException.class,
                () -> policy.settle(List.of(damage("sword", 100), damage("sword", 100))));
    }

    @Test
    void damageToAnItemOutsideThePolicyIsRejected() {
        Policy policy = policyOf(SWORD);
        assertThrows(ClaimOfficeException.class, () -> policy.settle(List.of(damage("amulet", 300))));
        assertThrows(ClaimOfficeException.class, () -> policy.settle(List.of(damage("broomstick", 300))));
    }

    @Test
    void negativeDamageIsRejected() {
        Policy policy = policyOf(SWORD);
        assertThrows(ClaimOfficeException.class, () -> policy.settle(List.of(damage("sword", -200))));
    }
}
