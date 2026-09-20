import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import org.junit.jupiter.api.Test;

class ClaimTest {

    private static Item item(String type, String material, int enchantment) {
        return new Item(type, material, enchantment, false);
    }

    private static Damage damage(String itemType, int amount) {
        return new Damage(itemType, amount);
    }

    private static InsurancePolicy policyOf(Item... items) {
        return new InsurancePolicy(List.of(items));
    }

    @Test
    void insuranceSumIsTheSumOfItemInsuranceValues() {
        assertEquals(0, policyOf(item("sword", "steel", 3), item("amulet", "silver", 1))
                .insuranceSum().compareTo(new java.math.BigDecimal(1600)));
    }

    @Test
    void blockDiscountDoesNotReduceTheInsuranceSum() {
        InsurancePolicy policy = policyOf(
                item("sword", "steel", 3),
                item("rune", null, 0), item("rune", null, 0), item("rune", null, 0));
        assertEquals(0, policy.insuranceSum().compareTo(new java.math.BigDecimal(1750)));
    }

    @Test
    void capIsTwiceTheInsuranceSum() {
        assertEquals(2000, policyOf(item("sword", "steel", 3)).remainingCap().intValueExact());
    }

    @Test
    void standardDamageIsFullyReimbursedMinusDeductible() {
        InsurancePolicy policy = policyOf(item("sword", "steel", 3));
        assertEquals(400, policy.claim(List.of(damage("sword", 500))));
    }

    @Test
    void componentDamageHasNoSpecialClause() {
        InsurancePolicy policy = policyOf(item("rune", null, 0));
        assertEquals(100, policy.claim(List.of(damage("rune", 200))));
    }

    @Test
    void highEnchantmentHalvesDamageBeforeDeductible() {
        InsurancePolicy policy = policyOf(item("sword", "steel", 9));
        assertEquals(400, policy.claim(List.of(damage("sword", 1000))));
    }

    @Test
    void dragonMaterialIsFullyReimbursed() {
        InsurancePolicy policy = policyOf(item("sword", "dragon", 5));
        assertEquals(700, policy.claim(List.of(damage("sword", 800))));
    }

    @Test
    void highEnchantmentWinsOverDragonMaterial() {
        assertEquals(400, policyOf(item("sword", "dragon", 9)).claim(List.of(damage("sword", 1000))));
        assertEquals(400, policyOf(item("sword", "dragon", 8)).claim(List.of(damage("sword", 1000))));
    }

    @Test
    void deductibleAppliesOncePerDamagedItem() {
        InsurancePolicy policy = policyOf(item("sword", "steel", 3), item("amulet", "silver", 1));
        assertEquals(600, policy.claim(List.of(damage("sword", 500), damage("amulet", 300))));
    }

    @Test
    void payoutIsRoundedDownInTheOfficesFavour() {
        // 50% of 901 = 450.5 -> 350.5 after deductible -> 350
        InsurancePolicy policy = policyOf(item("sword", "steel", 9));
        assertEquals(350, policy.claim(List.of(damage("sword", 901))));
    }

    @Test
    void capIsExhaustedAcrossSuccessiveClaims() {
        InsurancePolicy policy = policyOf(item("sword", "steel", 3));
        assertEquals(1400, policy.claim(List.of(damage("sword", 1500))));
        assertEquals(600, policy.remainingCap().intValueExact());
        assertEquals(600, policy.claim(List.of(damage("sword", 1500))));
        assertEquals(0, policy.remainingCap().intValueExact());
    }

    @Test
    void twoItemsOfSameTypeAllowTwoSeparateDamages() {
        InsurancePolicy policy = policyOf(item("sword", "steel", 3), item("sword", "steel", 3));
        assertEquals(800, policy.claim(List.of(damage("sword", 500), damage("sword", 500))));
    }

    @Test
    void moreDamagesOfATypeThanInsuredItemsIsRejected() {
        InsurancePolicy policy = policyOf(item("sword", "steel", 3));
        assertThrows(ClaimOfficeException.class,
                () -> policy.claim(List.of(damage("sword", 500), damage("sword", 500))));
    }

    @Test
    void damageToAnUninsuredItemIsRejected() {
        InsurancePolicy policy = policyOf(item("sword", "steel", 3));
        assertThrows(ClaimOfficeException.class, () -> policy.claim(List.of(damage("amulet", 200))));
        assertThrows(ClaimOfficeException.class, () -> policy.claim(List.of(damage("broomstick", 200))));
    }

    @Test
    void negativeDamageAmountIsRejected() {
        InsurancePolicy policy = policyOf(item("sword", "steel", 3));
        assertThrows(ClaimOfficeException.class, () -> policy.claim(List.of(damage("sword", -200))));
    }
}
