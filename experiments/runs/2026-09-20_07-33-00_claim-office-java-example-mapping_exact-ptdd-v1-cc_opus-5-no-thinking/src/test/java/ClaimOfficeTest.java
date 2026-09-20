import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

/**
 * Behaviour list for the MHPCO Claim Office kata.
 *
 * Every future behaviour is inactive. Exactly one behaviour is activated per
 * Predictive TDD cycle by removing its @Disabled annotation.
 *
 * Observable contract for rejection cases: the specification says the CLI
 * "exits with a non-zero status code and writes an error description to
 * stderr". The most defensible reading for the domain layer is that the
 * domain signals the rejection by throwing an exception, and the CLI adapter
 * translates that into exit code 1 plus a stderr message. The spec does not
 * establish an exception type or message, so the tests assert only that a
 * RuntimeException is thrown by the domain, and that the CLI exits non-zero
 * with non-empty stderr and no "results" on stdout.
 */
class ClaimOfficeTest {

    private static List<Item> runes(int count) {
        List<Item> runes = new java.util.ArrayList<>();
        for (int i = 0; i < count; i++) {
            runes.add(new Item("rune"));
        }
        return runes;
    }

    // --- Simplest case ---------------------------------------------------

    @Test
    void quoteForEmptyItemListIsProcessingFeeOnly() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(5, office.quote(List.of()));
    }

    // --- Base premiums per main item type (parallel catalogue) -----------

    @Test
    void quoteForSingleSwordUsesSwordBasePremium() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(115, office.quote(List.of(new Item("sword"))));
    }

    @Test
    void quoteForSingleAmuletUsesAmuletBasePremium() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(71, office.quote(List.of(new Item("amulet"))));
    }

    @Test
    void quoteForSingleStaffUsesStaffBasePremium() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(93, office.quote(List.of(new Item("staff"))));
    }

    @Test
    void quoteForSinglePotionUsesPotionBasePremium() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(49, office.quote(List.of(new Item("potion"))));
    }

    // --- Component base premiums -----------------------------------------

    @Test
    void quoteForSingleRuneUsesComponentBasePremium() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(33, office.quote(List.of(new Item("rune"))));
    }

    @Test
    void quoteForSingleMoonstoneUsesComponentBasePremium() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(33, office.quote(List.of(new Item("moonstone"))));
    }

    // --- Building block of 3 alike components ----------------------------

    @Test
    void twoRunesHaveBasePremiumFifty() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(60, office.quote(List.of(new Item("rune"), new Item("rune"))));
    }

    @Test
    void threeRunesFormABlockWithBasePremiumSixty() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(71, office.quote(List.of(new Item("rune"), new Item("rune"), new Item("rune"))));
    }

    @Test
    void fourRunesHaveBasePremiumHundredBecauseBlockNeedsExactlyThree() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(115, office.quote(runes(4)));
    }

    @Test
    void sevenRunesHaveBasePremiumOneHundredSeventyFive() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(198, office.quote(runes(7)));
    }

    @Test
    void mixedComponentTypesDoNotFormABlock() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(88, office.quote(
                List.of(new Item("rune"), new Item("rune"), new Item("moonstone"))));
    }

    @Test
    void twoSeparateComponentTypesEachFormTheirOwnBlock() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(137, office.quote(List.of(
                new Item("rune"), new Item("rune"), new Item("rune"),
                new Item("moonstone"), new Item("moonstone"), new Item("moonstone"))));
    }

    // --- Item-specific modifiers -----------------------------------------

    @Test
    void cursedItemAddsFiftyPercentSurchargeOnItsOwnBasePremium() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(165, office.quote(List.of(new Item("sword", "steel", 3, true))));
    }

    @Test
    void enchantmentOfExactlyFiveAddsHighEnchantmentSurcharge() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(145, office.quote(List.of(new Item("sword", "steel", 5, false))));
    }

    @Test
    void enchantmentOfFourAddsNoHighEnchantmentSurcharge() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(115, office.quote(List.of(new Item("sword", "steel", 4, false))));
    }

    @Test
    void cursedAndHighlyEnchantedItemGetsBothSurcharges() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(195, office.quote(List.of(new Item("sword", "steel", 5, true))));
    }

    // --- Policy-wide modifiers -------------------------------------------

    @Test
    void exactlyTwoYearsWithMhpcoGrantsLoyaltyDiscount() {
        ClaimOffice office = new ClaimOffice(new Customer(2));

        assertEquals(95, office.quote(List.of(new Item("sword"))));
    }

    @Test
    void oneYearWithMhpcoGrantsNoLoyaltyDiscount() {
        ClaimOffice office = new ClaimOffice(new Customer(1));

        assertEquals(115, office.quote(List.of(new Item("sword"))));
    }

    @Test
    void firstInsuranceAddsTenPercentSurcharge() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(181, office.quote(List.of(new Item("sword"), new Item("amulet"))));
    }

    @Test
    void secondContractReceivesFifteenPercentFollowUpDiscount() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        office.quote(List.of(new Item("sword")));

        assertEquals(100, office.quote(List.of(new Item("sword"))));
    }

    @Test
    void firstInsuranceSurchargeStillAppliesOnFollowUpContract() {
        ClaimOffice office = new ClaimOffice(new Customer(3));
        office.quote(List.of(new Item("sword")));

        assertEquals(80, office.quote(List.of(new Item("sword"))));
    }

    @Test
    void processingFeeIsAddedToEveryPremium() {
        ClaimOffice office = new ClaimOffice(new Customer(2));

        // 100 base - 20 loyalty + 10 first insurance = 90, plus the 5 G fee.
        assertEquals(95, office.quote(List.of(new Item("sword"))));
    }

    // --- Modifier scope on multi-item policies ---------------------------

    @Test
    void itemSpecificSurchargeAppliesOnlyToTheAffectedItemsBasePremium() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        // 160 base + 50 curse (50% of the sword only) + 16 first insurance + 5 fee.
        assertEquals(231, office.quote(List.of(
                new Item("sword", "steel", 0, true), new Item("amulet"))));
    }

    @Test
    void policyWideModifiersApplyToThePolicyBasePremium() {
        ClaimOffice office = new ClaimOffice(new Customer(2));

        // 160 base - 32 loyalty + 16 first insurance + 5 fee.
        assertEquals(149, office.quote(List.of(new Item("sword"), new Item("amulet"))));
    }

    // --- Rounding ---------------------------------------------------------

    @Test
    void fractionalPremiumIsRoundedUp() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        // 175 base + 17.5 first insurance + 5 fee = 197.5 G.
        assertEquals(198, office.quote(runes(7)));
    }

    @Test
    void fractionalPayoutIsRoundedDown() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword", "steel", 9, false)));

        // 901 x 50% = 450.5, minus the 100 G deductible = 350.5 G.
        assertEquals(350, office.claim(policy, List.of(new Damage("sword", 901))).payout());
    }

    // --- Integration examples --------------------------------------------

    @Test
    void newcomerWithCursedSwordPaysOneHundredSixtyFive() {
        ClaimOffice office = new ClaimOffice(new Customer(0));

        assertEquals(165, office.quote(List.of(new Item("sword", "steel", 3, true))));
    }

    @Test
    void longStandingCustomersSecondContractPaysOneHundredSixty() {
        ClaimOffice office = new ClaimOffice(new Customer(3));
        office.quote(List.of(new Item("amulet")));

        // 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance
        // - 15 follow-up = 155, plus the 5 G fee.
        assertEquals(160, office.quote(List.of(new Item("sword", "steel", 7, true))));
    }

    // --- Claim: standard reimbursement ------------------------------------

    @Test
    void standardDamageIsReimbursedInFullMinusDeductible() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword", "steel", 3, false)));

        assertEquals(400, office.claim(policy, List.of(new Damage("sword", 500))).payout());
    }

    @Test
    void componentDamageHasNoSpecialClauseAndOnlyTheDeductible() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("rune")));

        assertEquals(100, office.claim(policy, List.of(new Damage("rune", 200))).payout());
    }

    // --- Claim: special clauses -------------------------------------------

    @Test
    void highEnchantmentDamageIsReimbursedAtFiftyPercentBeforeDeductible() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword", "steel", 9, false)));

        assertEquals(400, office.claim(policy, List.of(new Damage("sword", 1000))).payout());
    }

    @Test
    void dragonMaterialDamageIsFullyReimbursedBeforeDeductible() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword", "dragon", 5, false)));

        assertEquals(700, office.claim(policy, List.of(new Damage("sword", 800))).payout());
    }

    @Test
    void enchantmentOfExactlyEightTriggersTheFiftyPercentClause() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword", "dragon", 8, false)));

        assertEquals(400, office.claim(policy, List.of(new Damage("sword", 1000))).payout());
    }

    @Test
    void fiftyPercentClauseWinsOverDragonMaterialWhenBothApply() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword", "dragon", 9, false)));

        assertEquals(400, office.claim(policy, List.of(new Damage("sword", 1000))).payout());
    }

    // --- Claim: deductible per damage event -------------------------------

    @Test
    void deductibleAppliesOncePerDamagedItem() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword"), new Item("amulet")));

        assertEquals(600, office.claim(policy,
                List.of(new Damage("sword", 500), new Damage("amulet", 300))).payout());
    }

    @Test
    void damageBelowTheDeductibleContributesNoPayout() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword"), new Item("amulet")));

        // Reading adopted: a damage event below the deductible reimburses nothing;
        // it never reduces the reimbursement of another damaged item.
        assertEquals(400, office.claim(policy,
                List.of(new Damage("sword", 500), new Damage("amulet", 50))).payout());
    }

    // --- Claim: insurance sum and cap -------------------------------------

    @Test
    void insuranceSumIsTheSumOfItemInsuranceValuesAndCapIsTwiceThat() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword"), new Item("amulet")));

        // Insurance sum 1000 + 600 = 1600 G, cap 3200 G; a 200 G payout leaves 3000 G.
        assertEquals(3000, office.claim(policy, List.of(new Damage("sword", 300))).remainingCap());
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword", "steel", 0, true)));

        // Cap 2000 G from the unmodified insurance value; a 200 G payout leaves 1800 G.
        assertEquals(1800, office.claim(policy, List.of(new Damage("sword", 300))).remainingCap());
    }

    @Test
    void componentBlockDiscountDoesNotReduceTheInsuranceSum() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        List<Item> insured = new java.util.ArrayList<>(runes(3));
        insured.add(0, new Item("sword"));
        Policy policy = office.insure(insured);

        // Insurance sum 1000 + 3 x 250 = 1750 G, cap 3500 G; a 200 G payout leaves 3300 G.
        assertEquals(3300, office.claim(policy, List.of(new Damage("sword", 300))).remainingCap());
    }

    @Test
    void twoItemsOfTheSameTypeEachAddTheirInsuranceValue() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword"), new Item("sword")));

        // Insurance sum 2 x 1000 = 2000 G, cap 4000 G; a 200 G payout leaves 3800 G.
        assertEquals(3800, office.claim(policy, List.of(new Damage("sword", 300))).remainingCap());
    }

    @Test
    void firstClaimReducesTheRemainingCap() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword")));

        Settlement settlement = office.claim(policy, List.of(new Damage("sword", 1500)));

        assertEquals(1400, settlement.payout());
        assertEquals(600, settlement.remainingCap());
    }

    @Test
    void payoutIsLimitedToTheRemainingCap() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword")));
        office.claim(policy, List.of(new Damage("sword", 1500)));

        Settlement settlement = office.claim(policy, List.of(new Damage("sword", 1500)));

        assertEquals(600, settlement.payout());
        assertEquals(0, settlement.remainingCap());
    }

    // --- Claim: several damages to same-type items ------------------------

    @Test
    void eachDamageEntryOfTheSameTypeIsASeparateDamage() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword"), new Item("sword")));

        // Each entry carries its own 100 G deductible: 400 + 400.
        assertEquals(800, office.claim(policy,
                List.of(new Damage("sword", 500), new Damage("sword", 500))).payout());
    }

    @Test
    void moreDamageEntriesOfATypeThanInsuredItemsIsRejected() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword")));
        List<Damage> damages = List.of(new Damage("sword", 500), new Damage("sword", 500));

        assertThrows(RuntimeException.class, () -> office.claim(policy, damages));
    }

    // --- Rejection cases ---------------------------------------------------

    @Test
    void quoteWithUnknownItemTypeIsRejected() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        List<Item> items = List.of(new Item("broomstick"));

        assertThrows(RuntimeException.class, () -> office.quote(items));
    }

    @Test
    void claimForAnItemNotCoveredByThePolicyIsRejected() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword")));
        List<Damage> damages = List.of(new Damage("amulet", 300));

        assertThrows(RuntimeException.class, () -> office.claim(policy, damages));
    }

    @Test
    void claimWithUnknownDamageItemTypeIsRejected() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword")));
        List<Damage> damages = List.of(new Damage("broomstick", 300));

        assertThrows(RuntimeException.class, () -> office.claim(policy, damages));
    }

    @Test
    void claimWithNegativeDamageAmountIsRejected() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        Policy policy = office.insure(List.of(new Item("sword")));
        List<Damage> damages = List.of(new Damage("sword", -200));

        assertThrows(RuntimeException.class, () -> office.claim(policy, damages));
    }

    // --- CLI adapter --------------------------------------------------------

    @Test
    void cliWritesResultsForQuoteAndClaimSteps() {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]},
                   {"op": "claim", "policy": 0, "incident": {
                     "cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}]}
                """;

        // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59 G.
        // Payout 200 - 100 = 100 G; cap 1200 G, remaining 1100 G.
        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}",
                ClaimOfficeCli.run(scenario));
    }

    @Test
    void cliResolvesTheClaimPolicyIndexToTheEarlierQuoteStep() {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword"}]},
                   {"op": "quote", "items": [{"type": "potion"}]},
                   {"op": "claim", "policy": 0, "incident": {
                     "cause": "fire", "damages": [{"itemType": "sword", "amount": 300}]}}]}
                """;

        // Step 1: 40 base + 4 first insurance - 6 follow-up + 5 fee = 43 G.
        // Step 0 insures a sword: cap 2000 G. Payout 200 G leaves 1800 G.
        // Settling against step 1 (a potion) would instead reject the sword damage.
        assertEquals("{\"results\":[{\"premium\":115},{\"premium\":43},"
                        + "{\"payout\":200,\"remainingCap\":1800}]}",
                ClaimOfficeCli.run(scenario));
    }

    @Test
    void cliExitsNonZeroWithStderrAndNoResultsOnRejection() {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}
                """;

        // The rejection propagates out of run, so main writes stderr and exits non-zero
        // without having written any results to stdout.
        RuntimeException rejected =
                assertThrows(RuntimeException.class, () -> ClaimOfficeCli.run(scenario));
        assertNotNull(rejected.getMessage());
    }
}
