import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

class PremiumCalculatorTest {

    private static final Customer NEWCOMER = new Customer(0);

    private static Item sword(String material, int enchantment, boolean cursed) {
        return new Item("sword", material, enchantment, cursed);
    }

    private static Item plain(String type) {
        return new Item(type, "steel", 1, false);
    }

    private static int premium(Customer customer, int previousContracts, Item... items) {
        return PremiumCalculator.premium(customer, previousContracts, List.of(items));
    }

    @Test
    void emptyItemListCostsOnlyTheProcessingFee() {
        assertEquals(5, premium(NEWCOMER, 0));
    }

    @Test
    void plainSwordForNewcomerAddsFirstInsuranceSurchargeAndFee() {
        // 100 base + 10 first insurance + 5 fee
        assertEquals(115, premium(NEWCOMER, 0, sword("steel", 3, false)));
    }

    @Test
    void newcomerWithACursedSword() {
        // 100 base + 50 curse + 10 first insurance = 160 + 5 fee
        assertEquals(165, premium(NEWCOMER, 0, sword("steel", 3, true)));
    }

    @Test
    void longStandingCustomersSecondContract() {
        // 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first - 15 follow-up = 155 + 5
        assertEquals(160, premium(new Customer(3), 1, sword("steel", 7, true)));
    }

    @Test
    void curseSurchargeAppliesOnlyToTheCursedItemsBasePremium() {
        // base 160 + 50 curse on the sword + 16 first insurance = 226 + 5 fee
        assertEquals(231, premium(NEWCOMER, 0, sword("steel", 3, true), plain("amulet")));
    }

    @Test
    void enchantmentExactlyFiveTriggersTheHighEnchantmentSurcharge() {
        // 100 base + 30 enchantment + 10 first insurance = 140 + 5 fee
        assertEquals(145, premium(NEWCOMER, 0, sword("steel", 5, false)));
    }

    @Test
    void enchantmentFourDoesNotTriggerTheSurcharge() {
        assertEquals(115, premium(NEWCOMER, 0, sword("steel", 4, false)));
    }

    @Test
    void enchantmentExactlyFiveAndCursedTriggersBothSurcharges() {
        // 100 base + 50 curse + 30 enchantment + 10 first insurance = 190 + 5 fee
        assertEquals(195, premium(NEWCOMER, 0, sword("steel", 5, true)));
    }

    @Test
    void exactlyTwoYearsGrantsTheLoyaltyDiscount() {
        // 100 base - 20 loyalty + 10 first insurance = 90 + 5 fee
        assertEquals(95, premium(new Customer(2), 0, sword("steel", 3, false)));
    }

    @Test
    void oneYearGrantsNoLoyaltyDiscount() {
        assertEquals(115, premium(new Customer(1), 0, sword("steel", 3, false)));
    }

    @Test
    void componentBlockDiscountAppliesToThePolicyBasePremium() {
        Item rune = new Item("rune", null, null, false);
        // block base 60 + 6 first insurance = 66 + 5 fee
        assertEquals(71, premium(NEWCOMER, 0, rune, rune, rune));
    }
}
