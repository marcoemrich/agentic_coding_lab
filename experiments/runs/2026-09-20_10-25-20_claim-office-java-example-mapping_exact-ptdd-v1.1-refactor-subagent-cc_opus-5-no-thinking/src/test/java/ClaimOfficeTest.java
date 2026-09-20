import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

/**
 * Test list for the MHPCO Claim Office kata.
 *
 * Adopted readings where prompt.md leaves an observable contract open:
 * - Rejections ("exits with a non-zero status code", "writes an error description
 *   to stderr") are modelled in the domain as a thrown IllegalArgumentException;
 *   the CLI adapter translates it into exit status 1 plus a stderr description.
 *   The specification names no exception type or message, so only the type and
 *   the CLI-observable outcome are asserted.
 * - "Rounded in the MHPCO's favor" is read as: premiums round up (ceiling),
 *   payouts round down (floor); intermediate amounts stay fractional.
 * - "A deductible of 100 G applies per damage event" is read, per the spec's
 *   dragon-attack example, as one deductible per damage entry.
 */
class ClaimOfficeTest {

    // ---------- Quote: simplest case ----------

    @Test
    void emptyItemListCostsOnlyTheProcessingFee() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(5, office.quote(List.of()));
    }

    // ---------- Quote: base premiums per main item type ----------

    @Test
    void swordHasBasePremium100() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(100, office.basePremium(List.of(new Item("sword"))));
    }

    @Test
    void amuletHasBasePremium60() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(60, office.basePremium(List.of(new Item("amulet"))));
    }

    @Test
    void staffHasBasePremium80() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(80, office.basePremium(List.of(new Item("staff"))));
    }

    @Test
    void potionHasBasePremium40() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(40, office.basePremium(List.of(new Item("potion"))));
    }

    @Test
    void runeHasBasePremium25() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(25, office.basePremium(List.of(new Item("rune"))));
    }

    @Test
    void moonstoneHasBasePremium25() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(25, office.basePremium(List.of(new Item("moonstone"))));
    }

    @Test
    void basePremiumsOfSeveralItemsAreSummed() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(160, office.basePremium(List.of(new Item("sword"), new Item("amulet"))));
    }

    // ---------- Quote: component building block of 3 alike ----------

    @Test
    void twoRunesCostFiftyBasePremium() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(50, office.basePremium(List.of(new Item("rune"), new Item("rune"))));
    }

    @Test
    void threeRunesFormABlockAtSixtyBasePremium() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(60, office.basePremium(
                List.of(new Item("rune"), new Item("rune"), new Item("rune"))));
    }

    @Test
    void fourRunesCostFullPriceBecauseBlockRequiresExactlyThree() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(100, office.basePremium(List.of(
                new Item("rune"), new Item("rune"), new Item("rune"), new Item("rune"))));
    }

    @Test
    void sevenRunesCostOneHundredSeventyFiveBasePremium() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(175, office.basePremium(List.of(
                new Item("rune"), new Item("rune"), new Item("rune"), new Item("rune"),
                new Item("rune"), new Item("rune"), new Item("rune"))));
    }


    @Test
    void mixedComponentTypesDoNotFormABlock() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(75, office.basePremium(List.of(
                new Item("rune"), new Item("rune"), new Item("moonstone"))));
    }

    @Test
    void twoComponentTypesFormTwoSeparateBlocks() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(120, office.basePremium(List.of(
                new Item("rune"), new Item("rune"), new Item("rune"),
                new Item("moonstone"), new Item("moonstone"), new Item("moonstone"))));
    }

    // ---------- Quote: item-specific modifiers ----------

    @Test
    void cursedItemAddsFiftyPercentRiskSurcharge() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertPremiumInG(150, office.premiumAfterItemModifiers(List.of(cursedSword())));
    }

    @Test
    void enchantmentOfExactlyFiveAddsThirtyPercentSurcharge() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertPremiumInG(130, office.premiumAfterItemModifiers(
                List.of(new Item("sword", "steel", 5, false))));
    }

    @Test
    void enchantmentOfFourAddsNoSurcharge() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertPremiumInG(100, office.premiumAfterItemModifiers(
                List.of(new Item("sword", "steel", 4, false))));
    }

    @Test
    void cursedAndHighlyEnchantedItemGetsBothSurcharges() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertPremiumInG(180, office.premiumAfterItemModifiers(
                List.of(new Item("sword", "steel", 5, true))));
    }

    @Test
    void itemSurchargeAppliesOnlyToTheAffectedItemNotThePolicyTotal() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertPremiumInG(210, office.premiumAfterItemModifiers(List.of(
                new Item("sword", "steel", 3, true),
                new Item("amulet", "silver", 2, false))));
    }

    // ---------- Quote: policy-wide modifiers ----------

    @Test
    void exactlyTwoYearsWithMhpcoGrantsLoyaltyDiscount() {
        // A long-standing customer's quote is 20 G lower than a newcomer's:
        // 20 % of the sword's 100 G policy base premium.
        List<Item> sword = List.of(new Item("sword", "steel", 3, false));
        int newcomerPremium = new ClaimOffice(new Customer(1)).quote(sword);
        int loyalPremium = new ClaimOffice(new Customer(2)).quote(sword);
        assertEquals(newcomerPremium - 20, loyalPremium);
    }

    @Test
    void oneYearWithMhpcoGrantsNoLoyaltyDiscount() {
        List<Item> sword = List.of(new Item("sword", "steel", 3, false));
        int newcomerPremium = new ClaimOffice(new Customer(0)).quote(sword);
        int oneYearPremium = new ClaimOffice(new Customer(1)).quote(sword);
        assertEquals(newcomerPremium, oneYearPremium);
    }

    @Test
    void firstInsuranceSurchargeAppliesToEveryQuote() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        // sword 100 base + 10 initial assessment + 5 fee
        assertEquals(115, office.quote(List.of(new Item("sword", "steel", 3, false))));
    }

    @Test
    void secondContractGetsFifteenPercentFollowUpDiscount() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        List<Item> sword = List.of(new Item("sword", "steel", 3, false));
        office.quote(sword);
        // second contract: 100 base + 10 initial assessment - 15 follow-up + 5 fee
        assertEquals(100, office.quote(sword));
    }

    @Test
    void firstInsuranceSurchargeStillAppliesOnFollowUpContract() {
        ClaimOffice office = new ClaimOffice(new Customer(3));
        List<Item> sword = List.of(new Item("sword", "steel", 3, false));
        office.quote(sword);
        // 100 base - 20 loyalty + 10 initial assessment - 15 follow-up + 5 fee
        assertEquals(80, office.quote(sword));
    }

    // ---------- Quote: rounding ----------

    @Test
    void fractionalPremiumIsRoundedUp() {
        // A single rune for a newcomer: 25 G base + 2.5 G initial assessment
        // + 5 G fee = 32.5 G. Intermediate amounts stay fractional; only the
        // final premium is rounded, and it is rounded up in the MHPCO's favor.
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(33, office.quote(List.of(new Item("rune"))));
    }

    // ---------- Quote: integration examples ----------

    @Test
    void newcomerWithCursedSwordPays165() {
        // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(165, office.quote(List.of(new Item("sword", "steel", 3, true))));
    }

    @Test
    void longStandingCustomerSecondContractPays160() {
        // 100 G base + 50 G curse + 30 G high enchantment - 20 G loyalty
        // + 10 G first insurance - 15 G follow-up contract = 155 G + 5 G fee
        ClaimOffice office = new ClaimOffice(new Customer(3));
        office.quote(List.of(new Item("sword", "steel", 3, false)));
        assertEquals(160, office.quote(List.of(new Item("sword", "steel", 7, true))));
    }

    // ---------- Quote: rejection ----------

    @Test
    void quoteWithUnknownItemTypeIsRejected() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        List<Item> broomstick = List.of(new Item("broomstick"));
        assertThrows(IllegalArgumentException.class, () -> office.quote(broomstick));
    }

    // ---------- Claim: insurance sum and cap ----------

    @Test
    void insuranceSumIsTheSumOfItemInsuranceValues() {
        // sword 1000 G + amulet 600 G; the cap is twice the insurance sum
        Policy policy = new ClaimOffice(new Customer(0)).insure(List.of(
                new Item("sword", "steel", 3, false),
                new Item("amulet", "silver", 2, false)));
        assertEquals(1600, policy.insuranceSum());
        assertEquals(3200, policy.cap());
    }

    @Test
    void twoSwordsGiveInsuranceSum2000AndCap4000() {
        Policy policy = new ClaimOffice(new Customer(0)).insure(List.of(
                new Item("sword", "steel", 3, false),
                new Item("sword", "steel", 3, false)));
        assertEquals(2000, policy.insuranceSum());
        assertEquals(4000, policy.cap());
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        List<Item> cursedSword = List.of(new Item("sword", "steel", 3, true));
        ClaimOffice office = new ClaimOffice(new Customer(0));
        assertEquals(165, office.quote(cursedSword));
        // the cap follows the unmodified insurance value, not the premium
        assertEquals(2000, office.insure(cursedSword).cap());
    }

    @Test
    void componentBlockDiscountDoesNotReduceTheInsuranceSum() {
        // sword 1000 G + 3 x 250 G; the 3-rune block reduces the premium only
        Policy policy = new ClaimOffice(new Customer(0)).insure(List.of(
                new Item("sword", "steel", 3, false),
                new Item("rune"), new Item("rune"), new Item("rune")));
        assertEquals(1750, policy.insuranceSum());
    }


    // ---------- Claim: standard reimbursement and deductible ----------

    @Test
    void standardDamageIsFullyReimbursedMinusTheDeductible() {
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "steel", 3, false)));
        Claim claim = policy.claim(new Incident("dragon attack",
                List.of(new Damage("sword", 500))));
        assertEquals(400, claim.payout());
    }

    @Test
    void componentDamageHasNoSpecialClauseAndOnlyTheDeductible() {
        Policy policy = new ClaimOffice(new Customer(0)).insure(List.of(new Item("rune")));
        Claim claim = policy.claim(new Incident("fire", List.of(new Damage("rune", 200))));
        assertEquals(100, claim.payout());
    }

    @Test
    void deductibleAppliesOncePerDamagedItem() {
        Policy policy = new ClaimOffice(new Customer(0)).insure(List.of(
                new Item("sword", "steel", 3, false),
                new Item("amulet", "silver", 2, false)));
        Claim claim = policy.claim(new Incident("dragon attack", List.of(
                new Damage("sword", 500), new Damage("amulet", 300))));
        assertEquals(600, claim.payout());
    }

    @Test
    void twoDamageEntriesOfTheSameTypeAreTreatedSeparately() {
        Policy policy = new ClaimOffice(new Customer(0)).insure(List.of(
                new Item("sword", "steel", 3, false),
                new Item("sword", "steel", 3, false)));
        Claim claim = policy.claim(new Incident("dragon attack", List.of(
                new Damage("sword", 500), new Damage("sword", 300))));
        assertEquals(600, claim.payout());
    }

    // ---------- Claim: special clauses ----------

    @Test
    void highEnchantmentDamageIsReimbursedAtFiftyPercentBeforeDeductible() {
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "steel", 9, false)));
        Claim claim = policy.claim(new Incident("curse backlash",
                List.of(new Damage("sword", 1000))));
        assertEquals(400, claim.payout());
    }

    @Test
    void enchantmentOfExactlyEightTriggersTheFiftyPercentClause() {
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "steel", 8, false)));
        Claim claim = policy.claim(new Incident("curse backlash",
                List.of(new Damage("sword", 1000))));
        assertEquals(400, claim.payout());
    }

    @Test
    void dragonMaterialDamageIsFullyReimbursedBeforeDeductible() {
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "dragon", 5, false)));
        Claim claim = policy.claim(new Incident("dragon attack",
                List.of(new Damage("sword", 800))));
        assertEquals(700, claim.payout());
    }

    @Test
    void highEnchantmentClauseWinsOverDragonMaterial() {
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "dragon", 9, false)));
        Claim claim = policy.claim(new Incident("dragon attack",
                List.of(new Damage("sword", 1000))));
        assertEquals(400, claim.payout());
    }

    @Test
    void dragonMaterialSwordAtEnchantmentEightPaysFourHundred() {
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "dragon", 8, false)));
        Claim claim = policy.claim(new Incident("dragon attack",
                List.of(new Damage("sword", 1000))));
        assertEquals(400, claim.payout());
    }

    // ---------- Claim: cap exhaustion across claims ----------

    @Test
    void firstClaimReducesTheRemainingCap() {
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "steel", 3, false)));
        Claim claim = policy.claim(new Incident("fire", List.of(new Damage("sword", 1500))));
        assertEquals(1400, claim.payout());
        assertEquals(600, claim.remainingCap());
    }

    @Test
    void secondClaimIsLimitedToTheRemainingCap() {
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "steel", 3, false)));
        policy.claim(new Incident("fire", List.of(new Damage("sword", 1500))));
        // the desired 1400 G is reduced to the 600 G the cap has left
        Claim claim = policy.claim(new Incident("fire", List.of(new Damage("sword", 1500))));
        assertEquals(600, claim.payout());
        assertEquals(0, claim.remainingCap());
    }

    // ---------- Claim: rounding ----------

    @Test
    void fractionalPayoutIsRoundedDown() {
        // A volatile sword (enchantment 9) damaged by 901 G: half of 901 is
        // 450.5, less the 100 G deductible = 350.5. Intermediate amounts stay
        // fractional; the final payout is rounded down in the MHPCO's favor.
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "steel", 9, false)));
        Claim claim = policy.claim(new Incident("fire", List.of(new Damage("sword", 901))));
        assertEquals(350, claim.payout());
    }

    // ---------- Claim: rejections ----------

    @Test
    void claimForAnItemNotCoveredByThePolicyIsRejected() {
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "steel", 3, false)));
        Incident incident = new Incident("fire", List.of(new Damage("amulet", 200)));
        assertThrows(IllegalArgumentException.class, () -> policy.claim(incident));
    }

    @Test
    void claimWithUnknownDamageItemTypeIsRejected() {
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "steel", 3, false)));
        Incident incident = new Incident("fire", List.of(new Damage("broomstick", 200)));
        assertThrows(IllegalArgumentException.class, () -> policy.claim(incident));
    }

    @Test
    void moreDamageEntriesOfATypeThanInsuredItemsIsRejected() {
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "steel", 3, false)));
        Incident incident = new Incident("dragon attack", List.of(
                new Damage("sword", 500), new Damage("sword", 300)));
        assertThrows(IllegalArgumentException.class, () -> policy.claim(incident));
    }

    @Test
    void negativeDamageAmountIsRejected() {
        Policy policy = new ClaimOffice(new Customer(0))
                .insure(List.of(new Item("sword", "steel", 3, false)));
        Incident incident = new Incident("fire", List.of(new Damage("sword", -200)));
        assertThrows(IllegalArgumentException.class, () -> policy.claim(incident));
    }

    // ---------- CLI adapter ----------

    @Test
    void cliProcessesAQuoteAndClaimScenarioFromStdin() throws Exception {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]},
                   {"op": "claim", "policy": 0, "incident": {
                     "cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}]}
                """;
        // amulet 60 base - 12 loyalty + 6 initial assessment + 5 fee = 59
        // damage 200 - 100 deductible = 100 payout; cap 1200 - 100 = 1100
        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}",
                runCli(scenario).trim());
    }

    @Disabled("TODO: CLI with an unknown item type -> exit status non-zero, stderr description, no results on stdout")
    @Test
    void cliExitsNonZeroAndWritesStderrOnRejection() {
        // Add the observation when this behavior enters Red.
    }

    @Disabled("TODO: CLI processes steps sequentially; a claim refers to its quote step by zero-based policy index")
    @Test
    void cliResolvesThePolicyIndexOfAnEarlierQuoteStep() {
        // Add the observation when this behavior enters Red.
    }

    /**
     * Asserts an amount in G by value, not by BigDecimal representation: the
     * MHPCO's premium rules speak of amounts, never of a number of decimal
     * places, so a change of scale must not fail a premium example.
     */
    private static void assertPremiumInG(int expectedG, BigDecimal actual) {
        assertEquals(0, BigDecimal.valueOf(expectedG).compareTo(actual),
                () -> "expected " + expectedG + " G but was " + actual + " G");
    }

    // ---------- item factories ----------

    private static Item cursedSword() {
        return new Item("sword", "steel", 3, true);
    }

    private static String runCli(String stdin) throws Exception {
        java.io.InputStream originalIn = System.in;
        java.io.PrintStream originalOut = System.out;
        java.io.ByteArrayOutputStream captured = new java.io.ByteArrayOutputStream();
        try {
            System.setIn(new java.io.ByteArrayInputStream(
                    stdin.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
            System.setOut(new java.io.PrintStream(captured, true,
                    java.nio.charset.StandardCharsets.UTF_8));
            ClaimOfficeCli.main(new String[0]);
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }
        return captured.toString(java.nio.charset.StandardCharsets.UTF_8);
    }
}
