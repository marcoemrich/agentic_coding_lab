import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

/** The full premium: base, item surcharges, policy modifiers, fee, rounding. */
class QuotePremiumTest {

    private static final Customer NEWCOMER = new Customer(0);
    private static final Customer LOYAL = new Customer(2);

    private static int premium(Customer customer, int previousContracts, Item... items) {
        return Premium.quote(customer, previousContracts, List.of(items));
    }

    private static Item sword(int enchantment, boolean cursed) {
        return new Item("sword", "steel", enchantment, cursed);
    }

    @Test
    void anEmptyItemListCostsOnlyTheProcessingFee() {
        assertEquals(5, premium(NEWCOMER, 0));
    }

    @Test
    void aFirstInsuranceAddsTenPercentOfThePolicyBase() {
        assertEquals(115, premium(NEWCOMER, 0, sword(3, false)));
    }

    @Test
    void exactlyTwoYearsEarnTheLoyaltyDiscount() {
        assertEquals(95, premium(LOYAL, 0, sword(3, false)));
    }

    @Test
    void oneYearIsNotYetLoyal() {
        assertEquals(115, premium(new Customer(1), 0, sword(3, false)));
    }

    @Test
    void everyContractAfterTheFirstIsDiscounted() {
        assertEquals(100, premium(NEWCOMER, 1, sword(3, false)));
    }

    @Test
    void newcomerWithACursedSword() {
        assertEquals(165, premium(NEWCOMER, 0, sword(3, true)));
    }

    @Test
    void longStandingCustomersSecondContract() {
        assertEquals(160, premium(new Customer(3), 1, sword(7, true)));
    }

    @Test
    void theCursedSurchargeIsBasedOnTheCursedItemOnly() {
        Item plainAmulet = new Item("amulet", "silver", 1, false);
        assertEquals(231, premium(NEWCOMER, 0, sword(3, true), plainAmulet));
    }

    @Test
    void premiumsAreRoundedUpInTheOfficesFavour() {
        assertEquals(198, Premium.roundPremium(new java.math.BigDecimal("197.5")));
    }

    @Test
    void unknownItemTypesAreRejected() {
        org.junit.jupiter.api.Assertions.assertThrows(ClaimOfficeException.class,
                () -> premium(NEWCOMER, 0, new Item("broomstick", null, 0, false)));
    }
}
