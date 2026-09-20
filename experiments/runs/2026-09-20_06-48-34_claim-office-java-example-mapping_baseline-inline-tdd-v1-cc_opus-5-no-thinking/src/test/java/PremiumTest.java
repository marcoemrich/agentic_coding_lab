import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import org.junit.jupiter.api.Test;

class PremiumTest {

    private static final int FEE = 5;

    private static Item item(String type) {
        return new Item(type, null, 0, false);
    }

    @Test
    void emptyItemListCostsOnlyTheProcessingFee() {
        assertEquals(FEE, quote(List.of()));
    }

    @Test
    void plainMainItemsCostTheirBasePremiumPlusFee() {
        assertEquals(firstContract(100, 0), quote(List.of(item("sword"))));
        assertEquals(firstContract(60, 0), quote(List.of(item("amulet"))));
        assertEquals(firstContract(80, 0), quote(List.of(item("staff"))));
        assertEquals(firstContract(40, 0), quote(List.of(item("potion"))));
    }

    @Test
    void threeAlikeComponentsFormADiscountedBlock() {
        assertEquals(firstContract(50, 0), quote(components("rune", 2)));
        assertEquals(firstContract(60, 0), quote(components("rune", 3)));
    }

    @Test
    void aBlockRequiresExactlyThreeComponentsOfAType() {
        assertEquals(firstContract(100, 0), quote(components("rune", 4)));
        assertEquals(firstContract(175, 0), quote(components("rune", 7)));
    }

    @Test
    void onlyComponentsOfTheSameTypeAreAlike() {
        List<Item> mixed = new java.util.ArrayList<>(components("rune", 2));
        mixed.addAll(components("moonstone", 1));
        assertEquals(firstContract(75, 0), quote(mixed));
    }

    @Test
    void eachComponentTypeFormsItsOwnBlocks() {
        List<Item> mixed = new java.util.ArrayList<>(components("rune", 3));
        mixed.addAll(components("moonstone", 3));
        assertEquals(firstContract(120, 0), quote(mixed));
    }

    @Test
    void cursedItemsCarryAFiftyPercentRiskSurcharge() {
        assertEquals(firstContract(100, 50), quote(List.of(sword(3, true))));
    }

    @Test
    void highEnchantmentAddsThirtyPercentFromLevelFive() {
        assertEquals(firstContract(100, 0), quote(List.of(sword(4, false))));
        assertEquals(firstContract(100, 30), quote(List.of(sword(5, false))));
    }

    @Test
    void curseAndHighEnchantmentStackOnTheSameItem() {
        assertEquals(firstContract(100, 80), quote(List.of(sword(5, true))));
    }

    @Test
    void itemModifiersApplyOnlyToTheAffectedItem() {
        assertEquals(firstContract(160, 50), quote(List.of(sword(3, true), item("amulet"))));
    }

    @Test
    void newcomerWithACursedSwordPaysTheFirstInsuranceSurcharge() {
        assertEquals(165, new PremiumCalculator().quote(List.of(sword(3, true)), new Customer(0), 0));
    }

    @Test
    void longStandingCustomersSecondContractCombinesAllModifiers() {
        assertEquals(160, new PremiumCalculator().quote(List.of(sword(7, true)), new Customer(3), 1));
    }

    @Test
    void loyaltyDiscountAppliesFromExactlyTwoYears() {
        assertEquals(100 + 10 + FEE, new PremiumCalculator().quote(List.of(sword(3, false)), new Customer(1), 0));
        assertEquals(100 - 20 + 10 + FEE, new PremiumCalculator().quote(List.of(sword(3, false)), new Customer(2), 0));
    }

    private static Item sword(int enchantment, boolean cursed) {
        return new Item("sword", "steel", enchantment, cursed);
    }

    private static List<Item> components(String type, int count) {
        List<Item> items = new java.util.ArrayList<>();
        for (int i = 0; i < count; i++) {
            items.add(item(type));
        }
        return items;
    }

    @Test
    void fractionalPremiumsAreRoundedUpInTheOfficesFavour() {
        // amulet 60 base, cursed +30, ench 5 +18; loyalty -12, first +6 => 102 + 5 = 107
        // a 3-rune block spreads 60 G over three runes, one of them cursed: 20 + 10 = 197.5 total
        List<Item> items = new java.util.ArrayList<>(List.of(sword(5, true)));
        items.add(new Item("rune", null, 0, true));
        items.add(item("rune"));
        items.add(item("rune"));
        // plain base 160; item surcharges 80 (sword) + 10 (cursed rune, 50 % of 20) = 90
        // first insurance +16 => 266 + 5 = 271
        assertEquals(271, quote(items));
    }

    @Test
    void onlyTheFinalPremiumIsRounded() {
        // a single cursed rune outside a block: 25 base + 12.5 curse + 2.5 first + 5 fee = 45
        assertEquals(45, quote(List.of(new Item("rune", null, 0, true))));
    }

    @Test
    void unknownItemTypesAreRejected() {
        assertThrows(ClaimOfficeException.class, () -> quote(List.of(item("broomstick"))));
    }

    /** Quotes a first contract for a brand-new customer, i.e. only the first insurance surcharge. */
    private static int quote(List<Item> items) {
        return new PremiumCalculator().quote(items, new Customer(0), 0);
    }

    /** The expected premium of a first contract: base + 10 % first insurance + fee. */
    private static int firstContract(double plainBase, double itemSurcharges) {
        return (int) Math.ceil(plainBase + itemSurcharges + plainBase * 0.1 + FEE);
    }
}
