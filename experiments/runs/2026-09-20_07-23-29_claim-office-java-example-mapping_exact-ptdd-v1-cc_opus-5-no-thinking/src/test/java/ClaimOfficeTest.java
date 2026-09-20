import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

/**
 * Test list for the MHPCO Claim Office kata.
 *
 * Observable contract adopted for rejection cases: the specification says the
 * CLI "exits with a non-zero status code and writes an error description to
 * stderr". The most defensible reading for a unit-testable domain is that the
 * domain layer throws an exception; the CLI adapter translates that into exit
 * code 1 plus a stderr message and writes no `results` to stdout. The
 * specification does not establish an exception type or message, so tests only
 * require that a rejection is observable (an exception from the domain, and a
 * non-zero exit plus non-empty stderr and empty stdout from the CLI).
 */
class ClaimOfficeTest {

    // ---------- Quote: fee and single base premiums ----------

    @Test
    void emptyItemListCostsOnlyTheProcessingFee() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(5, office.quote(List.of()));
    }

    @Test
    void plainSwordUsesSwordBasePremium() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(115, office.quote(List.of(new Item("sword", "steel", 3, false))));
    }

    @Test
    void plainAmuletUsesAmuletBasePremium() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(71, office.quote(List.of(new Item("amulet", "silver", 2, false))));
    }

    @Test
    void plainStaffUsesStaffBasePremium() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(93, office.quote(List.of(new Item("staff", "oak", 1, false))));
    }

    @Test
    void plainPotionUsesPotionBasePremium() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(49, office.quote(List.of(new Item("potion", "glass", 0, false))));
    }

    @Test
    void singleRuneUsesComponentBasePremium() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(33, office.quote(List.of(new Item("rune", null, 0, false))));
    }

    @Test
    void singleMoonstoneUsesComponentBasePremium() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(33, office.quote(List.of(new Item("moonstone", null, 0, false))));
    }

    @Test
    void quoteWithUnknownItemTypeIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        List<Item> items = List.of(new Item("broomstick", "wood", 0, false));
        assertThrows(IllegalArgumentException.class, () -> office.quote(items));
    }

    // ---------- Quote: component blocks ----------

    @Test
    void twoRunesHaveBasePremiumFifty() {
        ClaimOffice office = new ClaimOffice(0);
        // base 50 + 10 % first insurance + 5 fee = 60
        assertEquals(60, office.quote(List.of(rune(), rune())));
    }

    private static Item rune() {
        return new Item("rune", null, 0, false);
    }

    private static Item moonstone() {
        return new Item("moonstone", null, 0, false);
    }

    @Test
    void threeRunesFormABlockWithBasePremiumSixty() {
        ClaimOffice office = new ClaimOffice(0);
        // block base 60 + 10 % first insurance + 5 fee = 71
        assertEquals(71, office.quote(List.of(rune(), rune(), rune())));
    }

    @Test
    void fourRunesGetNoBlockDiscount() {
        ClaimOffice office = new ClaimOffice(0);
        // base 100 + 10 % first insurance + 5 fee = 115
        assertEquals(115, office.quote(List.of(rune(), rune(), rune(), rune())));
    }

    @Test
    void sevenRunesGetNoBlockDiscount() {
        ClaimOffice office = new ClaimOffice(0);
        // base 175 + 17.5 first insurance + 5 fee = 197.5 -> 198
        assertEquals(198, office.quote(
                List.of(rune(), rune(), rune(), rune(), rune(), rune(), rune())));
    }

    @Test
    void mixedComponentTypesDoNotFormABlock() {
        ClaimOffice office = new ClaimOffice(0);
        // base 75 + 7.5 first insurance + 5 fee = 87.5 -> 88
        assertEquals(88, office.quote(List.of(rune(), rune(), moonstone())));
    }

    @Test
    void twoSeparateComponentTypesEachFormTheirOwnBlock() {
        ClaimOffice office = new ClaimOffice(0);
        // base 60 + 60 = 120 + 12 first insurance + 5 fee = 137
        assertEquals(137, office.quote(List.of(
                rune(), rune(), rune(), moonstone(), moonstone(), moonstone())));
    }

    // ---------- Quote: item-specific modifiers ----------

    @Test
    void cursedItemAddsFiftyPercentOfItsOwnBasePremium() {
        ClaimOffice office = new ClaimOffice(0);
        // 100 base + 50 curse + 10 first insurance + 5 fee = 165
        assertEquals(165, office.quote(List.of(new Item("sword", "steel", 3, true))));
    }

    @Test
    void enchantmentOfExactlyFiveAddsHighEnchantmentSurcharge() {
        ClaimOffice office = new ClaimOffice(0);
        // 100 base + 30 high enchantment + 10 first insurance + 5 fee = 145
        assertEquals(145, office.quote(List.of(new Item("sword", "steel", 5, false))));
    }

    @Test
    void enchantmentOfFourAddsNoHighEnchantmentSurcharge() {
        ClaimOffice office = new ClaimOffice(0);
        // 100 base + 10 first insurance + 5 fee = 115
        assertEquals(115, office.quote(List.of(new Item("sword", "steel", 4, false))));
    }

    @Test
    void cursedAndHighlyEnchantedItemGetsBothSurcharges() {
        ClaimOffice office = new ClaimOffice(0);
        // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee = 195
        assertEquals(195, office.quote(List.of(new Item("sword", "steel", 5, true))));
    }

    @Test
    void itemModifiersApplyOnlyToTheAffectedItemInAMultiItemPolicy() {
        ClaimOffice office = new ClaimOffice(0);
        // base 160 + 50 curse (sword only) + 16 first insurance + 5 fee = 231
        assertEquals(231, office.quote(List.of(
                new Item("sword", "steel", 3, true),
                new Item("amulet", "silver", 2, false))));
    }

    // ---------- Quote: policy-wide modifiers ----------

    @Test
    void exactlyTwoYearsWithMhpcoGrantsLoyaltyDiscount() {
        ClaimOffice office = new ClaimOffice(2);
        // 100 base - 20 loyalty + 10 first insurance + 5 fee = 95
        assertEquals(95, office.quote(List.of(new Item("sword", "steel", 3, false))));
    }

    @Test
    void oneYearWithMhpcoGrantsNoLoyaltyDiscount() {
        ClaimOffice office = new ClaimOffice(1);
        // 100 base + 10 first insurance + 5 fee = 115
        assertEquals(115, office.quote(List.of(new Item("sword", "steel", 3, false))));
    }

    @Test
    void firstInsuranceSurchargeAppliesToEveryQuote() {
        ClaimOffice office = new ClaimOffice(0);
        // 60 base + 6 first insurance + 5 fee = 71; without the surcharge it would be 65
        assertEquals(71, office.quote(List.of(new Item("amulet", "silver", 1, false))));
    }

    @Test
    void secondContractGetsFollowUpDiscount() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(new Item("sword", "steel", 3, false)));
        // 100 base + 10 first insurance - 15 follow-up + 5 fee = 100
        assertEquals(100, office.quote(List.of(new Item("sword", "steel", 3, false))));
    }

    @Test
    void thirdContractAlsoGetsFollowUpDiscount() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(new Item("sword", "steel", 3, false)));
        office.quote(List.of(new Item("sword", "steel", 3, false)));
        // 100 base + 10 first insurance - 15 follow-up + 5 fee = 100
        assertEquals(100, office.quote(List.of(new Item("sword", "steel", 3, false))));
    }

    @Test
    void processingFeeIsAddedLast() {
        ClaimOffice office = new ClaimOffice(3);
        office.quote(List.of(new Item("sword", "steel", 3, false)));
        // 100 base - 20 loyalty + 10 first insurance - 15 follow-up = 75, + 5 fee = 80
        assertEquals(80, office.quote(List.of(new Item("sword", "steel", 3, false))));
    }

    @Test
    void premiumIsRoundedUp() {
        ClaimOffice office = new ClaimOffice(0);
        // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198, not 197
        assertEquals(198, office.quote(
                List.of(rune(), rune(), rune(), rune(), rune(), rune(), rune())));
    }

    @Test
    void onlyTheFinalPremiumIsRounded() {
        ClaimOffice office = new ClaimOffice(3);
        // 25 base - 5 loyalty + 2.5 first insurance = 22.5, + 5 fee = 27.5 -> 28
        assertEquals(28, office.quote(List.of(rune())));
    }

    // ---------- Quote: integration examples ----------

    @Test
    void newcomerWithCursedSwordPays165() {
        ClaimOffice office = new ClaimOffice(0);
        // 100 base + 50 curse + 10 first insurance = 160, + 5 fee = 165
        assertEquals(165, office.quote(List.of(new Item("sword", "steel", 3, true))));
    }

    @Test
    void longStandingCustomersSecondContractPays160() {
        ClaimOffice office = new ClaimOffice(3);
        office.quote(List.of(new Item("amulet", "silver", 1, false)));
        // 100 + 50 curse + 30 high ench - 20 loyalty + 10 first insurance
        // - 15 follow-up = 155, + 5 fee = 160
        assertEquals(160, office.quote(List.of(new Item("sword", "steel", 7, true))));
    }

    // ---------- Claim: insurance sum and cap ----------

    @Test
    void insuranceSumIsTheSumOfItemInsuranceValues() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(
                new Item("sword", "steel", 3, false),
                new Item("amulet", "silver", 2, false)));
        // cap 2 x (1000 + 600) = 3200; a 200 G sword damage pays 100, leaving 3100
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 200))));
        assertEquals(100, result.payout());
        assertEquals(3100, result.remainingCap());
    }

    @Test
    void twoSwordsDoubleTheInsuranceSum() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(), sword()));
        // cap 2 x 2000 = 4000; a 200 G damage pays 100, leaving 3900
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 200))));
        assertEquals(3900, result.remainingCap());
    }

    private static Item sword() {
        return new Item("sword", "steel", 3, false);
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(165, office.quote(List.of(new Item("sword", "steel", 3, true))));
        // cap stays 2 x 1000 = 2000; a 200 G damage pays 100, leaving 1900
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 200))));
        assertEquals(1900, result.remainingCap());
    }

    @Test
    void componentBlockDiscountDoesNotLowerTheInsuranceSum() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(), rune(), rune(), rune()));
        // insurance sum 1000 + 3 x 250 = 1750, cap 3500; a 200 G damage pays 100
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 200))));
        assertEquals(3400, result.remainingCap());
    }

    // ---------- Claim: payout rules ----------

    @Test
    void standardDamageIsReimbursedMinusDeductible() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword()));
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 500))));
        assertEquals(400, result.payout());
    }

    @Test
    void componentDamageIsReimbursedMinusDeductible() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(rune()));
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("rune", 200))));
        assertEquals(100, result.payout());
    }

    @Test
    void highEnchantmentHalvesTheDamageBeforeTheDeductible() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(new Item("sword", "steel", 9, false)));
        // 50 % of 1000 = 500, then deductible: 400
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 1000))));
        assertEquals(400, result.payout());
    }

    @Test
    void enchantmentOfExactlyEightTriggersTheFiftyPercentClause() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(new Item("sword", "steel", 8, false)));
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 1000))));
        assertEquals(400, result.payout());
    }

    @Test
    void enchantmentOfSevenDoesNotTriggerTheFiftyPercentClause() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(new Item("sword", "steel", 7, false)));
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 1000))));
        assertEquals(900, result.payout());
    }

    @Test
    void dragonMaterialIsFullyReimbursedMinusDeductible() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(new Item("sword", "dragon", 5, false)));
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 800))));
        assertEquals(700, result.payout());
    }

    @Test
    void fiftyPercentClauseWinsOverDragonMaterial() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(new Item("sword", "dragon", 9, false)));
        // both clauses apply; the 50 % rule wins: 500 - 100 = 400
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 1000))));
        assertEquals(400, result.payout());
    }

    @Test
    void dragonMaterialSwordAtExactlyEnchantmentEightPaysFourHundred() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(new Item("sword", "dragon", 8, false)));
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 1000))));
        assertEquals(400, result.payout());
    }

    @Test
    void payoutIsRoundedDown() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(new Item("sword", "steel", 9, false)));
        // 50 % of 901 = 450.5, - 100 deductible = 350.5 -> 350, not 351
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 901))));
        assertEquals(350, result.payout());
    }

    @Test
    void payoutIsNeverNegative() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword()));
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 50))));
        assertEquals(0, result.payout());
        assertEquals(2000, result.remainingCap());
    }

    // ---------- Claim: multiple damages and cap ----------

    @Test
    void deductibleAppliesOncePerDamagedItem() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(), new Item("amulet", "silver", 2, false)));
        // (500 - 100) + (300 - 100) = 600
        ClaimResult result = office.claim(0, new Incident("dragon attack",
                List.of(new Damage("sword", 500), new Damage("amulet", 300))));
        assertEquals(600, result.payout());
    }

    @Test
    void twoDamagesOfTheSameTypeEachGetTheirOwnDeductible() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(), sword()));
        // (500 - 100) + (500 - 100) = 800
        ClaimResult result = office.claim(0, new Incident("dragon attack",
                List.of(new Damage("sword", 500), new Damage("sword", 500))));
        assertEquals(800, result.payout());
    }

    @Test
    void firstClaimReportsRemainingCap() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword()));
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 1500))));
        assertEquals(1400, result.payout());
        assertEquals(600, result.remainingCap());
    }

    @Test
    void secondClaimIsLimitedToTheRemainingCap() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword()));
        office.claim(0, new Incident("fire", List.of(new Damage("sword", 1500))));
        // desired 1400 reduced to the remaining cap of 600
        ClaimResult result = office.claim(0, new Incident("fire", List.of(new Damage("sword", 1500))));
        assertEquals(600, result.payout());
        assertEquals(0, result.remainingCap());
    }

    @Test
    void capIsTrackedPerPolicy() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword()));
        office.quote(List.of(sword()));
        office.claim(0, new Incident("fire", List.of(new Damage("sword", 2500))));
        // policy 0 is exhausted; policy 1 still has its full cap of 2000
        ClaimResult result = office.claim(1, new Incident("fire", List.of(new Damage("sword", 600))));
        assertEquals(500, result.payout());
        assertEquals(1500, result.remainingCap());
    }

    // ---------- Claim: rejections ----------

    @Test
    void damageToAnItemNotInThePolicyIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword()));
        Incident incident = new Incident("fire", List.of(new Damage("amulet", 300)));
        assertThrows(IllegalArgumentException.class, () -> office.claim(0, incident));
    }

    @Test
    void damageWithUnknownItemTypeIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword()));
        Incident incident = new Incident("fire", List.of(new Damage("broomstick", 300)));
        assertThrows(IllegalArgumentException.class, () -> office.claim(0, incident));
    }

    @Test
    void moreDamagesOfATypeThanInsuredIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword()));
        Incident incident = new Incident("dragon attack",
                List.of(new Damage("sword", 500), new Damage("sword", 500)));
        assertThrows(IllegalArgumentException.class, () -> office.claim(0, incident));
    }

    @Test
    void negativeDamageAmountIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword()));
        Incident incident = new Incident("fire", List.of(new Damage("sword", -200)));
        assertThrows(IllegalArgumentException.class, () -> office.claim(0, incident));
    }

    // ---------- CLI ----------

    @Test
    void cliProducesResultsForQuoteAndClaimSteps() {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]},
                   {"op": "claim", "policy": 0, "incident": {
                     "cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}]}
                """;
        // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59; payout 100, cap 1200 - 100
        assertEquals(0, runCli(scenario));
        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}",
                stdout.toString(StandardCharsets.UTF_8).trim());
    }

    private final ByteArrayOutputStream stdout = new ByteArrayOutputStream();
    private final ByteArrayOutputStream stderr = new ByteArrayOutputStream();

    private int runCli(String scenario) {
        return ClaimOfficeCli.run(
                new ByteArrayInputStream(scenario.getBytes(StandardCharsets.UTF_8)),
                new PrintStream(stdout, true, StandardCharsets.UTF_8),
                new PrintStream(stderr, true, StandardCharsets.UTF_8));
    }

    @Test
    void cliResultsMirrorTheInputStepOrder() {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword"}]},
                   {"op": "quote", "items": [{"type": "amulet"}]},
                   {"op": "claim", "policy": 1, "incident": {
                     "cause": "fire", "damages": [{"itemType": "amulet", "amount": 300}]}}]}
                """;
        // sword 115; amulet as a follow-up contract: 60 + 6 - 9 + 5 = 62; payout 200, cap 1200 - 200
        assertEquals(0, runCli(scenario));
        assertEquals("{\"results\":[{\"premium\":115},{\"premium\":62},"
                        + "{\"payout\":200,\"remainingCap\":1000}]}",
                stdout.toString(StandardCharsets.UTF_8).trim());
    }

    @Test
    void cliRejectsUnknownItemTypeWithNonZeroExit() {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}
                """;
        assertEquals(1, runCli(scenario));
        assertEquals("", stdout.toString(StandardCharsets.UTF_8).trim());
        assertFalse(stderr.toString(StandardCharsets.UTF_8).isBlank());
    }

    @Test
    void cliRejectsInvalidClaimWithNonZeroExit() {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword"}]},
                   {"op": "claim", "policy": 0, "incident": {
                     "cause": "fire", "damages": [{"itemType": "amulet", "amount": 300}]}}]}
                """;
        assertEquals(1, runCli(scenario));
        assertEquals("", stdout.toString(StandardCharsets.UTF_8).trim());
        assertTrue(stderr.toString(StandardCharsets.UTF_8).contains("amulet"));
    }
}
