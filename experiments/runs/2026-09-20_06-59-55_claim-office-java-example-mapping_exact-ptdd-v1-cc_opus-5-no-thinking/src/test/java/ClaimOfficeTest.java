import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class ClaimOfficeTest {

    // --- Base premiums per item type (price list) ---

    @Test
    void emptyItemListCostsOnlyTheProcessingFee() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(5, office.quote(List.of()));
    }

    @Test
    void swordHasBasePremium100() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(115, office.quote(List.of(Map.of("type", "sword"))));
    }

    @Test
    void amuletHasBasePremium60() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(71, office.quote(List.of(Map.of("type", "amulet"))));
    }

    @Test
    void staffHasBasePremium80() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(93, office.quote(List.of(Map.of("type", "staff"))));
    }

    @Test
    void potionHasBasePremium40() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(49, office.quote(List.of(Map.of("type", "potion"))));
    }

    @Test
    void runeHasBasePremium25() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(33, office.quote(List.of(Map.of("type", "rune"))));
    }

    @Test
    void moonstoneHasBasePremium25() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(33, office.quote(List.of(Map.of("type", "moonstone"))));
    }

    // --- Component building block of 3 alike components ---

    @Test
    void twoRunesHaveBasePremium50() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(60, office.quote(List.of(Map.of("type", "rune"), Map.of("type", "rune"))));
    }

    @Test
    void threeRunesFormABlockWithBasePremium60() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(71, office.quote(
                List.of(Map.of("type", "rune"), Map.of("type", "rune"), Map.of("type", "rune"))));
    }

    @Test
    void fourRunesHaveNoBlockAndBasePremium100() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(115, office.quote(runes(4)));
    }

    private static List<Map<String, Object>> runes(int count) {
        return IntStream.range(0, count)
                .<Map<String, Object>>mapToObj(unused -> Map.of("type", "rune"))
                .toList();
    }

    @Test
    void sevenRunesHaveNoBlockAndBasePremium175() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(198, office.quote(runes(7)));
    }

    @Test
    void mixedComponentTypesFormNoBlock() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(88, office.quote(List.of(
                Map.of("type", "rune"), Map.of("type", "rune"), Map.of("type", "moonstone"))));
    }

    @Test
    void twoAlikeTripletsFormTwoSeparateBlocks() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(137, office.quote(List.of(
                Map.of("type", "rune"), Map.of("type", "rune"), Map.of("type", "rune"),
                Map.of("type", "moonstone"), Map.of("type", "moonstone"), Map.of("type", "moonstone"))));
    }

    @Test
    void threeMoonstonesFormABlockWithBasePremium60() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(71, office.quote(List.of(
                Map.of("type", "moonstone"), Map.of("type", "moonstone"), Map.of("type", "moonstone"))));
    }

    // --- Item-specific premium modifiers ---

    @Test
    void cursedItemAddsFiftyPercentOfItsOwnBasePremium() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(165, office.quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 3, "cursed", true))));
    }

    @Test
    void enchantmentOfExactlyFiveAddsHighEnchantmentSurcharge() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(145, office.quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 5, "cursed", false))));
    }

    @Test
    void enchantmentOfFourAddsNoHighEnchantmentSurcharge() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(115, office.quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 4, "cursed", false))));
    }

    @Test
    void cursedAndHighlyEnchantedItemGetsBothSurcharges() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(195, office.quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 5, "cursed", true))));
    }

    @Test
    void cursedSurchargeAppliesOnlyToTheCursedItemNotTheWholePolicy() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(231, office.quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 3, "cursed", true),
                Map.of("type", "amulet", "material", "silver", "enchantment", 2, "cursed", false))));
    }

    // --- Policy-wide premium modifiers ---

    @Test
    void exactlyTwoYearsWithMhpcoGrantsLoyaltyDiscount() {
        ClaimOffice office = new ClaimOffice(2);
        assertEquals(95, office.quote(List.of(Map.of("type", "sword"))));
    }

    @Test
    void oneYearWithMhpcoGrantsNoLoyaltyDiscount() {
        ClaimOffice office = new ClaimOffice(1);
        assertEquals(115, office.quote(List.of(Map.of("type", "sword"))));
    }

    @Test
    void firstInsuranceSurchargeAppliesToEveryQuote() {
        ClaimOffice office = new ClaimOffice(3);
        assertEquals(95, office.quote(List.of(Map.of("type", "sword"))));
    }

    @Test
    void secondContractGetsFollowUpDiscount() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(115, office.quote(List.of(Map.of("type", "sword"))));
        assertEquals(100, office.quote(List.of(Map.of("type", "sword"))));
    }

    @Test
    void everyContractAfterTheFirstGetsFollowUpDiscount() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword")));
        office.quote(List.of(Map.of("type", "sword")));
        assertEquals(100, office.quote(List.of(Map.of("type", "sword"))));
    }

    @Test
    void processingFeeIsAddedToEveryPremium() {
        ClaimOffice office = new ClaimOffice(2);
        assertEquals(5, office.quote(List.of()));
    }

    @Test
    void premiumIsRoundedUp() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(198, office.quote(runes(7)));
    }

    // --- Premium integration examples ---

    @Test
    void newcomerWithACursedSwordPays165() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(165, office.quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 3, "cursed", true))));
    }

    @Test
    void longStandingCustomersSecondContractPays160() {
        ClaimOffice office = new ClaimOffice(3);
        office.quote(List.of(Map.of("type", "sword")));
        assertEquals(160, office.quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 7, "cursed", true))));
    }

    // --- Insurance sum and cap ---

    @Test
    void insuranceSumIsTheSumOfItemInsuranceValues() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword"), Map.of("type", "amulet")));
        assertEquals(3200, office.claim(0, List.of()).remainingCap());
    }

    @Test
    void twoSwordsGiveInsuranceSum2000AndCap4000() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword"), Map.of("type", "sword")));
        assertEquals(4000, office.claim(0, List.of()).remainingCap());
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(165, office.quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 3, "cursed", true))));
        assertEquals(2000, office.claim(0, List.of()).remainingCap());
    }

    @Test
    void componentBlockDiscountDoesNotReduceTheInsuranceSum() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword"),
                Map.of("type", "rune"), Map.of("type", "rune"), Map.of("type", "rune")));
        assertEquals(3500, office.claim(0, List.of()).remainingCap());
    }

    // --- Claim processing: standard reimbursement and deductible ---

    @Test
    void standardDamageIsFullyReimbursedMinusTheDeductible() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword", "material", "steel", "enchantment", 3)));
        ClaimResult result = office.claim(0, List.of(damage("sword", 500)));
        assertEquals(400, result.payout());
        assertEquals(1600, result.remainingCap());
    }

    private static Map<String, Object> damage(String itemType, int amount) {
        return Map.of("itemType", itemType, "amount", amount);
    }

    @Test
    void componentDamageHasNoSpecialClause() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "rune")));
        assertEquals(100, office.claim(0, List.of(damage("rune", 200))).payout());
    }

    @Test
    void damageBelowTheDeductibleYieldsNoPayout() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword")));
        ClaimResult result = office.claim(0, List.of(damage("sword", 80)));
        assertEquals(0, result.payout());
        assertEquals(2000, result.remainingCap());
    }

    @Test
    void theDeductibleAppliesOncePerDamagedItem() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword"), Map.of("type", "amulet")));
        assertEquals(600, office.claim(0,
                List.of(damage("sword", 500), damage("amulet", 300))).payout());
    }

    // --- Claim processing: special clauses ---

    @Test
    void highEnchantmentDamageIsReimbursedAtFiftyPercent() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword", "material", "steel", "enchantment", 9)));
        assertEquals(400, office.claim(0, List.of(damage("sword", 1000))).payout());
    }

    @Test
    void highEnchantmentClauseAppliesAtExactlyEight() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword", "material", "steel", "enchantment", 8)));
        assertEquals(400, office.claim(0, List.of(damage("sword", 1000))).payout());
    }

    @Test
    void enchantmentOfSevenDoesNotTriggerTheFiftyPercentClause() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword", "material", "steel", "enchantment", 7)));
        assertEquals(900, office.claim(0, List.of(damage("sword", 1000))).payout());
    }

    @Test
    void dragonMaterialDamageIsFullyReimbursed() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword", "material", "dragon", "enchantment", 5)));
        assertEquals(700, office.claim(0, List.of(damage("sword", 800))).payout());
    }

    @Test
    void highEnchantmentBeatsDragonMaterial() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword", "material", "dragon", "enchantment", 9)));
        assertEquals(400, office.claim(0, List.of(damage("sword", 1000))).payout());
    }

    @Test
    void highEnchantmentBeatsDragonMaterialAtExactlyEight() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword", "material", "dragon", "enchantment", 8)));
        assertEquals(400, office.claim(0, List.of(damage("sword", 1000))).payout());
    }

    @Test
    void payoutIsRoundedDown() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword", "material", "steel", "enchantment", 9)));
        assertEquals(350, office.claim(0, List.of(damage("sword", 901))).payout());
    }

    // --- Claim processing: cap exhaustion across claims ---

    @Test
    void firstClaimReducesTheRemainingCap() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword")));
        ClaimResult result = office.claim(0, List.of(damage("sword", 1500)));
        assertEquals(1400, result.payout());
        assertEquals(600, result.remainingCap());
    }

    @Test
    void aClaimIsLimitedToTheRemainingCap() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword")));
        office.claim(0, List.of(damage("sword", 1500)));
        ClaimResult result = office.claim(0, List.of(damage("sword", 1500)));
        assertEquals(600, result.payout());
        assertEquals(0, result.remainingCap());
    }

    @Test
    void twoDamagesOfTheSameItemTypeAreTreatedSeparately() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword"), Map.of("type", "sword")));
        assertEquals(800, office.claim(0,
                List.of(damage("sword", 500), damage("sword", 500))).payout());
    }

    // --- Rejections (observable contract: IllegalArgumentException from the domain; CLI exits non-zero) ---

    @Test
    void quoteWithAnUnknownItemTypeIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        assertThrows(IllegalArgumentException.class,
                () -> office.quote(List.of(Map.of("type", "broomstick"))));
    }

    @Test
    void claimForAnUninsuredItemTypeIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword")));
        assertThrows(IllegalArgumentException.class,
                () -> office.claim(0, List.of(damage("amulet", 200))));
    }

    @Test
    void claimForAnUnknownItemTypeIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword")));
        assertThrows(IllegalArgumentException.class,
                () -> office.claim(0, List.of(damage("broomstick", 200))));
    }

    @Test
    void moreDamagesThanInsuredItemsOfThatTypeAreRejected() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword")));
        assertThrows(IllegalArgumentException.class,
                () -> office.claim(0, List.of(damage("sword", 500), damage("sword", 500))));
    }

    @Test
    void negativeDamageAmountIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(Map.of("type", "sword")));
        assertThrows(IllegalArgumentException.class,
                () -> office.claim(0, List.of(damage("sword", -200))));
    }

    // --- CLI adapter ---

    @Test
    void cliMapsAScenarioFromStdinToResultsOnStdout() {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]},
                   {"op": "claim", "policy": 0, "incident": {
                     "cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}]}
                """;
        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}",
                ClaimOfficeCli.run(scenario));
    }

    @Test
    void cliReportsAnInvalidScenarioOnStderrWithNonZeroExitStatus() {
        assertThrows(IllegalArgumentException.class, () -> ClaimOfficeCli.run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}
                """));
    }
}
