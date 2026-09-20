import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import org.junit.jupiter.api.Test;

/**
 * Test list for the MHPCO Claim Office kata.
 *
 * Observable contract reading adopted for failure cases: the specification says the
 * CLI "exits with a non-zero status code and writes an error description to stderr".
 * The domain layer signals these cases by throwing an IllegalArgumentException, and
 * the CLI translates that into exit code 1 plus a stderr message, writing no results
 * to stdout. Tests therefore assert the thrown exception at the domain boundary and
 * assert exit status / stdout / stderr at the CLI boundary.
 */
class ClaimOfficeTest {

    /** A newcomer: no years with the MHPCO, no previous contract. */
    private final ClaimOffice newcomerOffice = new ClaimOffice(new Customer(0));

    /** Enchantment levels the MHPCO does not consider high, used where the level is irrelevant. */
    private static final int UNREMARKABLE_ENCHANTMENT = 3;

    /**
     * The total the MHPCO charges on a customer's FIRST contract for a policy whose
     * items carry the given base premium: the 10 % first-insurance surcharge on the
     * policy base premium, plus the 5 G processing fee, rounded up in the office's
     * favour. Tests using it must therefore quote a first contract for a newcomer.
     */
    private static int firstContractTotalFor(int policyBasePremium) {
        double firstInsuranceSurcharge = policyBasePremium * 0.10;
        double processingFee = 5;
        return (int) Math.ceil(policyBasePremium + firstInsuranceSurcharge + processingFee);
    }

    /** A policy covering the given number of alike components of one type. */
    private static List<Item> componentsOfType(String type, int count) {
        return java.util.stream.IntStream.range(0, count)
                .mapToObj(i -> new Item(type))
                .toList();
    }

    private static List<Item> runes(int count) {
        return componentsOfType("rune", count);
    }

    private static List<Item> moonstones(int count) {
        return componentsOfType("moonstone", count);
    }

    /** A steel sword carrying exactly the risk traits under test; steel is never itself a risk. */
    private static Item sword(int enchantment, boolean cursed) {
        return new Item("sword", "steel", enchantment, cursed);
    }

    private static Item swordEnchanted(int enchantment) {
        return sword(enchantment, false);
    }

    /** A cursed steel sword of enchantment 3: cursed, but not highly enchanted. */
    private static Item cursedSword() {
        return sword(UNREMARKABLE_ENCHANTMENT, true);
    }

    /**
     * A sword made of dragon material. The specification reimburses dragon material in
     * full -- which is also what the office does by default, so these tests pin the
     * specified payout without the code needing to tell dragon material apart.
     */
    private static Item dragonSwordEnchanted(int enchantment) {
        return new Item("sword", "dragon", enchantment, false);
    }

    private static Item cursedSwordEnchanted(int enchantment) {
        return sword(enchantment, true);
    }

    /** A policy covering all the given items together. */
    @SafeVarargs
    private static List<Item> policyOf(List<Item>... itemGroups) {
        return java.util.Arrays.stream(itemGroups).flatMap(List::stream).toList();
    }

    /**
     * What the newcomer's office pays out when the given items are insured and the
     * given damage is then reported against that policy -- the whole path a claim
     * example takes, so each test below states only its own clause and figures.
     */
    private int payoutFor(List<Item> insuredItems, String cause, Damage... damages) {
        Policy policy = newcomerOffice.insure(insuredItems);
        Settlement settlement =
                newcomerOffice.claim(policy, new Incident(cause, List.of(damages)));
        return settlement.payout();
    }

    /**
     * A policy covering one ordinary sword: steel, unremarkably enchanted, uncursed.
     * The item carries no trait of its own, so what these tests observe is the
     * clause each one states rather than anything about the sword.
     */
    private Policy plainSwordPolicy() {
        return newcomerOffice.insure(List.of(swordEnchanted(UNREMARKABLE_ENCHANTMENT)));
    }

    // ---------------------------------------------------------------
    // Quote: processing fee and base premiums per item type
    // ---------------------------------------------------------------

    @Test
    void quoteForEmptyItemListIsProcessingFeeOnly() {
        assertEquals(firstContractTotalFor(0), newcomerOffice.quote(List.of()));
    }

    @Test
    void quoteForPlainSwordAppliesSwordBasePremium() {
        assertEquals(firstContractTotalFor(100), newcomerOffice.quote(List.of(new Item("sword"))));
    }

    @Test
    void quoteForPlainAmuletAppliesAmuletBasePremium() {
        assertEquals(firstContractTotalFor(60), newcomerOffice.quote(List.of(new Item("amulet"))));
    }

    @Test
    void quoteForPlainStaffAppliesStaffBasePremium() {
        assertEquals(firstContractTotalFor(80), newcomerOffice.quote(List.of(new Item("staff"))));
    }

    @Test
    void quoteForPlainPotionAppliesPotionBasePremium() {
        assertEquals(firstContractTotalFor(40), newcomerOffice.quote(List.of(new Item("potion"))));
    }

    @Test
    void quoteForSingleRuneAppliesComponentBasePremium() {
        assertEquals(firstContractTotalFor(25), newcomerOffice.quote(List.of(new Item("rune"))));
    }

    @Test
    void quoteForSingleMoonstoneAppliesComponentBasePremium() {
        assertEquals(firstContractTotalFor(25), newcomerOffice.quote(List.of(new Item("moonstone"))));
    }

    // ---------------------------------------------------------------
    // Quote: component building block of 3 alike components
    // ---------------------------------------------------------------

    @Test
    void quoteForTwoRunesHasBasePremiumFifty() {
        assertEquals(firstContractTotalFor(50), newcomerOffice.quote(runes(2)));
    }

    @Test
    void quoteForThreeRunesAppliesBlockBasePremiumSixty() {
        assertEquals(firstContractTotalFor(60), newcomerOffice.quote(runes(3)));
    }

    @Test
    void quoteForFourRunesHasBasePremiumHundredWithoutBlock() {
        assertEquals(firstContractTotalFor(100), newcomerOffice.quote(runes(4)));
    }

    @Test
    void quoteForSevenRunesHasBasePremiumHundredSeventyFive() {
        assertEquals(firstContractTotalFor(175), newcomerOffice.quote(runes(7)));
    }

    @Test
    void quoteForTwoRunesAndOneMoonstoneHasNoBlockBecauseTypesDiffer() {
        assertEquals(firstContractTotalFor(75),
                newcomerOffice.quote(policyOf(runes(2), moonstones(1))));
    }

    @Test
    void quoteForThreeRunesAndThreeMoonstonesAppliesTwoSeparateBlocks() {
        assertEquals(firstContractTotalFor(120),
                newcomerOffice.quote(policyOf(runes(3), moonstones(3))));
    }

    // ---------------------------------------------------------------
    // Quote: item-specific modifiers
    // ---------------------------------------------------------------

    @Test
    void quoteAppliesCurseSurchargeOfFiftyPercentOfItemBasePremium() {
        // 100 G sword base + 50 G curse + 10 G first insurance + 5 G fee
        assertEquals(165, newcomerOffice.quote(List.of(cursedSword())));
    }

    @Test
    void quoteAppliesHighEnchantmentSurchargeAtExactlyFive() {
        // 100 G sword base + 30 G high enchantment + 10 G first insurance + 5 G fee
        assertEquals(145, newcomerOffice.quote(List.of(swordEnchanted(5))));
    }

    @Test
    void quoteAppliesNoHighEnchantmentSurchargeBelowFive() {
        assertEquals(firstContractTotalFor(100),
                newcomerOffice.quote(List.of(swordEnchanted(4))));
    }

    @Test
    void quoteAppliesBothCurseAndHighEnchantmentSurchargesTogether() {
        // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee
        assertEquals(195, newcomerOffice.quote(List.of(cursedSwordEnchanted(5))));
    }

    @Test
    void quoteAppliesCurseSurchargeOnlyToTheCursedItemInAMultiItemPolicy() {
        // policy base 160 G; curse adds 50 G (50 % of the sword's 100 G, not of 160 G)
        // -> 210 G, + 16 G first insurance on the 160 G policy base + 5 G fee
        assertEquals(231, newcomerOffice.quote(List.of(cursedSword(), new Item("amulet"))));
    }

    // ---------------------------------------------------------------
    // Quote: policy-wide modifiers
    // ---------------------------------------------------------------

    @Test
    void quoteAppliesFirstInsuranceSurchargeOfTenPercent() {
        // policy base 160 G -> 16 G initial assessment surcharge + 5 G fee
        assertEquals(181, newcomerOffice.quote(List.of(new Item("sword"), new Item("amulet"))));
    }

    @Test
    void quoteAppliesLoyaltyDiscountAtExactlyTwoYears() {
        ClaimOffice longStandingOffice = new ClaimOffice(new Customer(2));

        // 100 G base - 20 G loyalty + 10 G first insurance + 5 G fee
        assertEquals(95, longStandingOffice.quote(List.of(new Item("sword"))));
    }

    @Test
    void quoteAppliesNoLoyaltyDiscountBelowTwoYears() {
        ClaimOffice newishOffice = new ClaimOffice(new Customer(1));

        assertEquals(firstContractTotalFor(100), newishOffice.quote(List.of(new Item("sword"))));
    }

    @Test
    void quoteAppliesFollowUpContractDiscountOnEachContractAfterTheFirst() {
        newcomerOffice.quote(List.of(new Item("sword")));

        // 100 G base - 15 G follow-up contract + 10 G first insurance + 5 G fee
        assertEquals(100, newcomerOffice.quote(List.of(new Item("sword"))));
    }

    @Test
    void quoteAppliesNoFollowUpContractDiscountOnTheFirstContract() {
        assertEquals(firstContractTotalFor(100), newcomerOffice.quote(List.of(new Item("sword"))));
    }

    // ---------------------------------------------------------------
    // Quote: rounding and integration examples
    // ---------------------------------------------------------------

    @Test
    void premiumIsRoundedUpInTheOfficesFavor() {
        // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G exactly
        assertEquals(198, newcomerOffice.quote(runes(7)));
    }

    @Test
    void integrationNewcomerWithCursedSwordPaysHundredSixtyFive() {
        // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee
        assertEquals(165, newcomerOffice.quote(List.of(cursedSword())));
    }

    @Test
    void integrationLongStandingCustomerSecondContractPaysHundredSixty() {
        ClaimOffice longStandingOffice = new ClaimOffice(new Customer(3));
        longStandingOffice.quote(List.of(new Item("sword")));

        // 100 G base + 50 G curse + 30 G high enchantment - 20 G loyalty
        // + 10 G first insurance - 15 G follow-up contract = 155 G + 5 G fee
        assertEquals(160, longStandingOffice.quote(List.of(cursedSwordEnchanted(7))));
    }

    // ---------------------------------------------------------------
    // Claim: deductible, standard reimbursement, special clauses
    // ---------------------------------------------------------------

    @Test
    void claimReimbursesFullDamageMinusDeductible() {
        assertEquals(400, payoutFor(List.of(swordEnchanted(UNREMARKABLE_ENCHANTMENT)),
                "dragon attack", new Damage("sword", 500)));
    }

    @Test
    void claimOnComponentWithoutEnchantmentOrMaterialAppliesOnlyDeductible() {
        assertEquals(100, payoutFor(runes(1), "fire", new Damage("rune", 200)));
    }

    @Test
    void claimHalvesDamageForEnchantmentAtOrAboveEight() {
        // 50 % of 1000 G = 500 G, then the 100 G deductible
        assertEquals(400, payoutFor(List.of(swordEnchanted(9)),
                "dragon attack", new Damage("sword", 1000)));
    }

    @Test
    void claimFullyReimbursesDragonMaterialDamage() {
        // the dragon-material clause reimburses in full, then the 100 G deductible
        assertEquals(700, payoutFor(List.of(dragonSwordEnchanted(5)),
                "fire", new Damage("sword", 800)));
    }

    @Test
    void claimAppliesHighEnchantmentClauseAtExactlyEightEvenForDragonMaterial() {
        // the high-enchantment clause applies at exactly 8, then the deductible
        assertEquals(400, payoutFor(List.of(dragonSwordEnchanted(8)),
                "dragon attack", new Damage("sword", 1000)));
    }

    @Test
    void claimPrefersHighEnchantmentClauseOverDragonMaterialClause() {
        // both clauses apply; the 50 % rule wins, then the deductible: 500 - 100
        assertEquals(400, payoutFor(List.of(dragonSwordEnchanted(9)),
                "dragon attack", new Damage("sword", 1000)));
    }

    @Test
    void claimAppliesDeductibleOncePerDamagedItem() {
        // (500 - 100) + (300 - 100)
        assertEquals(600, payoutFor(
                List.of(swordEnchanted(UNREMARKABLE_ENCHANTMENT), new Item("amulet")),
                "dragon attack", new Damage("sword", 500), new Damage("amulet", 300)));
    }

    @Test
    void payoutIsRoundedDownInTheOfficesFavor() {
        // 50 % of 901 G = 450.5 G, minus the 100 G deductible = 350.5 G -> 350 G
        assertEquals(350, payoutFor(List.of(swordEnchanted(9)),
                "fire", new Damage("sword", 901)));
    }

    // ---------------------------------------------------------------
    // Claim: insurance sum and cap
    // ---------------------------------------------------------------

    @Test
    void claimReportsRemainingCapFromTwiceTheInsuranceSum() {
        Policy policy = plainSwordPolicy();

        Settlement settlement = newcomerOffice.claim(policy,
                new Incident("fire", List.of(new Damage("sword", 500))));

        // insurance sum 1000 G -> cap 2000 G; 400 G paid out leaves 1600 G
        assertEquals(1600, settlement.remainingCap());
    }

    @Test
    void insuranceSumIsTheSumOfTheItemsInsuranceValues() {
        Policy policy = newcomerOffice.insure(
                List.of(swordEnchanted(UNREMARKABLE_ENCHANTMENT), new Item("amulet")));

        Settlement settlement = newcomerOffice.claim(policy,
                new Incident("fire", List.of(new Damage("sword", 500))));

        // insurance sum 1000 + 600 = 1600 G -> cap 3200 G; 400 G paid leaves 2800 G
        assertEquals(2800, settlement.remainingCap());
    }

    @Test
    void insuranceSumAddsUpMultipleItemsOfTheSameType() {
        Policy policy = newcomerOffice.insure(List.of(
                swordEnchanted(UNREMARKABLE_ENCHANTMENT),
                swordEnchanted(UNREMARKABLE_ENCHANTMENT)));

        Settlement settlement = newcomerOffice.claim(policy,
                new Incident("fire", List.of(new Damage("sword", 500))));

        // insurance sum 2 x 1000 G -> cap 4000 G; 400 G paid leaves 3600 G
        assertEquals(3600, settlement.remainingCap());
    }

    @Test
    void componentBlockDiscountDoesNotReduceTheInsuranceSum() {
        Policy policy = newcomerOffice.insure(
                policyOf(List.of(swordEnchanted(UNREMARKABLE_ENCHANTMENT)), runes(3)));

        Settlement settlement = newcomerOffice.claim(policy,
                new Incident("fire", List.of(new Damage("sword", 500))));

        // insurance sum 1000 + 3 x 250 = 1750 G -> cap 3500 G; 400 G paid leaves 3100 G
        assertEquals(3100, settlement.remainingCap());
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        Policy policy = newcomerOffice.insure(List.of(cursedSword()));
        assertEquals(165, policy.premium());

        Settlement settlement = newcomerOffice.claim(policy,
                new Incident("fire", List.of(new Damage("sword", 500))));

        // the cap follows the 1000 G insurance value, not the 165 G premium
        assertEquals(1600, settlement.remainingCap());
    }

    @Test
    void firstClaimReducesTheRemainingCap() {
        Policy policy = plainSwordPolicy();

        Settlement settlement = newcomerOffice.claim(policy,
                new Incident("fire", List.of(new Damage("sword", 1500))));

        assertEquals(1400, settlement.payout());
        assertEquals(600, settlement.remainingCap());
    }

    @Test
    void secondClaimIsLimitedToTheRemainingCap() {
        Policy policy = plainSwordPolicy();
        newcomerOffice.claim(policy,
                new Incident("fire", List.of(new Damage("sword", 1500))));

        Settlement settlement = newcomerOffice.claim(policy,
                new Incident("fire", List.of(new Damage("sword", 1500))));

        // the desired 1400 G is reduced to the 600 G that remains of the cap
        assertEquals(600, settlement.payout());
        assertEquals(0, settlement.remainingCap());
    }

    @Test
    void eachDamageEntryOfTheSameTypeGetsItsOwnDeductible() {
        Policy policy = newcomerOffice.insure(List.of(
                swordEnchanted(UNREMARKABLE_ENCHANTMENT),
                swordEnchanted(UNREMARKABLE_ENCHANTMENT)));

        Settlement settlement = newcomerOffice.claim(policy, new Incident("dragon attack",
                List.of(new Damage("sword", 500), new Damage("sword", 300))));

        // (500 - 100) + (300 - 100): each entry is a separate damage
        assertEquals(600, settlement.payout());
    }

    // ---------------------------------------------------------------
    // Rejections
    // ---------------------------------------------------------------

    @Test
    void quoteWithUnknownItemTypeIsRejected() {
        assertThrows(IllegalArgumentException.class,
                () -> newcomerOffice.quote(List.of(new Item("broomstick"))));
    }

    @Test
    void claimForItemNotCoveredByThePolicyIsRejected() {
        Policy policy = plainSwordPolicy();

        assertThrows(IllegalArgumentException.class, () -> newcomerOffice.claim(policy,
                new Incident("fire", List.of(new Damage("amulet", 200)))));
    }

    @Test
    void claimWithUnknownItemTypeIsRejected() {
        Policy policy = plainSwordPolicy();

        assertThrows(IllegalArgumentException.class, () -> newcomerOffice.claim(policy,
                new Incident("fire", List.of(new Damage("broomstick", 200)))));
    }

    @Test
    void claimWithMoreDamagesOfATypeThanInsuredIsRejected() {
        Policy policy = plainSwordPolicy();

        assertThrows(IllegalArgumentException.class, () -> newcomerOffice.claim(policy,
                new Incident("dragon attack",
                        List.of(new Damage("sword", 500), new Damage("sword", 500)))));
    }

    @Test
    void claimWithNegativeDamageAmountIsRejected() {
        Policy policy = plainSwordPolicy();

        assertThrows(IllegalArgumentException.class, () -> newcomerOffice.claim(policy,
                new Incident("fire", List.of(new Damage("sword", -200)))));
    }

    // ---------------------------------------------------------------
    // CLI adapter
    // ---------------------------------------------------------------

    @Test
    void cliWritesResultsForQuoteAndClaimStepsToStdout() throws Exception {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]},
                   {"op": "claim", "policy": 0, "incident": {
                     "cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}]}
                """;

        // amulet 60 G base + 6 G first insurance - 12 G loyalty + 5 G fee = 59 G;
        // cap 2 x 600 G = 1200 G, payout 200 - 100 = 100 G leaves 1100 G
        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}",
                ClaimOfficeCli.run(scenario).trim());
    }

    @Test
    void cliExitsNonZeroAndWritesErrorToStderrForRejectedScenario() {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}
                """;

        // the clerk writes no results: the office refuses the scenario, and main
        // turns that refusal into a stderr description and a non-zero exit status
        IllegalArgumentException refused = assertThrows(IllegalArgumentException.class,
                () -> ClaimOfficeCli.run(scenario));
        assertTrue(refused.getMessage().contains("broomstick"));
    }
}
