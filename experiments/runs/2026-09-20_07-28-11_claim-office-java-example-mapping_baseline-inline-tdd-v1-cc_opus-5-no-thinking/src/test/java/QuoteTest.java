import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

class QuoteTest {

    private static final Customer NEWCOMER = new Customer(0);

    private static Item item(String type, String material, int enchantment, boolean cursed) {
        return new Item(type, material, enchantment, cursed);
    }

    private static int premium(Customer customer, int contractNumber, List<Item> items) {
        return Quote.premium(customer, contractNumber, items);
    }

    @Test
    void emptyItemListCostsOnlyTheProcessingFee() {
        assertEquals(5, premium(NEWCOMER, 1, List.of()));
    }

    @Test
    void cursedItemAddsFiftyPercentOfItsOwnBasePremium() {
        List<Item> cursedSwordAndPlainAmulet = List.of(
                item("sword", "steel", 3, true),
                item("amulet", "silver", 2, false));
        // policy base 160 (100 + 60); curse adds 50 = 50% of the sword's base only,
        // not of the policy total, so the premium before fee is 210 for a newcomer's
        // first contract: 160 + 50 + 16 first insurance = 226, + 5 fee.
        assertEquals(231, premium(NEWCOMER, 1, cursedSwordAndPlainAmulet));
    }

    @Test
    void loyaltyDiscountAppliesFromExactlyTwoYears() {
        List<Item> sword = List.of(item("sword", "steel", 3, false));
        // 100 base + 10 first insurance + 5 fee, minus 20 loyalty once it applies
        assertEquals(115, premium(new Customer(1), 1, sword));
        assertEquals(95, premium(new Customer(2), 1, sword));
    }

    @Test
    void highEnchantmentSurchargeAppliesFromExactlyLevelFive() {
        assertEquals(115, premium(NEWCOMER, 1, List.of(item("sword", "steel", 4, false))));
        assertEquals(145, premium(NEWCOMER, 1, List.of(item("sword", "steel", 5, false))));
    }

    @Test
    void cursedAndHighlyEnchantedItemCarriesBothSurcharges() {
        // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee
        assertEquals(195, premium(NEWCOMER, 1, List.of(item("sword", "steel", 5, true))));
    }

    @Test
    void premiumIsRoundedUpInTheOfficesFavour() {
        // 3 moonstones block at 60, +30% enchantment on 25 each = 22.5,
        // +6 first insurance, +5 fee => 93.5 -> 94
        List<Item> enchantedBlock = List.of(
                item("moonstone", null, 5, false),
                item("moonstone", null, 5, false),
                item("moonstone", null, 5, false));
        assertEquals(94, premium(NEWCOMER, 1, enchantedBlock));
    }

    @Test
    void newcomerWithCursedSwordPays165() {
        assertEquals(165, premium(NEWCOMER, 1, List.of(item("sword", "steel", 3, true))));
    }

    @Test
    void longStandingCustomersSecondContractPays160() {
        assertEquals(160, premium(new Customer(3), 2, List.of(item("sword", "steel", 7, true))));
    }
}
