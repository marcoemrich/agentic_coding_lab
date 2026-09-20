import static java.util.Collections.nCopies;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

/**
 * Behaviours of the MHPCO Claim Office, ordered simple -> complex.
 *
 * Reading adopted for rejection cases: the specification only says "the CLI exits with a
 * non-zero status code and writes an error description to stderr". The observable domain
 * contract chosen here is a thrown exception from the scenario run; the CLI adapter
 * translates it into the stderr message and the non-zero exit status. No exception type
 * or message text is established by the specification, so tests assert only that the
 * scenario run fails, plus the CLI's exit status where the CLI is the unit under test.
 */
class ClaimOfficeTest {

    // ---------- quote: simplest cases ----------

    @Test
    void emptyItemListCostsOnlyTheProcessingFee() {
        Scenario scenario = new Scenario(new Customer(0), List.of(new QuoteStep(List.of())));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(5, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void plainSwordForNewcomer() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("sword")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(115, ((QuoteResult) results.get(0)).premium());
    }

    // ---------- quote: price list per main item type (parallel catalogue) ----------

    @Test
    void amuletUsesItsOwnBasePremium() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("amulet")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(71, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void staffUsesItsOwnBasePremium() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("staff")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(93, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void potionUsesItsOwnBasePremium() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("potion")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(49, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void runeUsesTheComponentBasePremium() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("rune")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(33, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void moonstoneUsesTheComponentBasePremium() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("moonstone")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(33, ((QuoteResult) results.get(0)).premium());
    }

    // ---------- quote: component building block ----------

    @Test
    void twoRunesHaveNoBlockDiscount() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("rune"), new Item("rune")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(60, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void threeAlikeRunesFormABlock() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("rune"), new Item("rune"), new Item("rune")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(71, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void fourRunesGetNoBlockDiscount() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("rune"), new Item("rune"),
                        new Item("rune"), new Item("rune")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(115, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void sevenRunesGetNoBlockDiscount() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(nCopies(7, new Item("rune")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(198, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void mixedComponentTypesDoNotFormABlock() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("rune"), new Item("rune"),
                        new Item("moonstone")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(88, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void twoAlikeGroupsFormTwoSeparateBlocks() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("rune"), new Item("rune"), new Item("rune"),
                        new Item("moonstone"), new Item("moonstone"), new Item("moonstone")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(137, ((QuoteResult) results.get(0)).premium());
    }

    // ---------- quote: item-specific modifiers ----------

    /**
     * The curse rule in isolation: 100 G base + 50 G curse. The newcomer carries no other
     * modifier, so the total happens to coincide with the integration example below; this
     * test is here for the 50 % rate itself, that one for the way the modifiers stack.
     */
    @Test
    void cursedItemAddsFiftyPercentRiskSurcharge() {
        Item cursedSword = new Item("sword", "steel", 3, true);
        Scenario scenario = new Scenario(new Customer(0), List.of(new QuoteStep(List.of(cursedSword))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(165, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void enchantmentFiveAddsHighEnchantmentSurcharge() {
        Item enchantedSword = new Item("sword", "steel", 5, false);
        Scenario scenario = new Scenario(new Customer(0), List.of(new QuoteStep(List.of(enchantedSword))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(145, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void enchantmentFourAddsNoHighEnchantmentSurcharge() {
        Item sword = new Item("sword", "steel", 4, false);
        Scenario scenario = new Scenario(new Customer(0), List.of(new QuoteStep(List.of(sword))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(115, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void cursedAndHighlyEnchantedItemGetsBothSurcharges() {
        Item sword = new Item("sword", "steel", 5, true);
        Scenario scenario = new Scenario(new Customer(0), List.of(new QuoteStep(List.of(sword))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(195, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void itemSpecificSurchargeAppliesToTheAffectedItemOnly() {
        Item cursedSword = new Item("sword", "steel", 3, true);
        Item plainAmulet = new Item("amulet", "silver", 2, false);
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(cursedSword, plainAmulet))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(231, ((QuoteResult) results.get(0)).premium());
    }

    // ---------- quote: policy-wide modifiers ----------

    @Test
    void exactlyTwoYearsGrantsTheLoyaltyDiscount() {
        Scenario scenario = new Scenario(new Customer(2),
                List.of(new QuoteStep(List.of(new Item("sword")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(95, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void oneYearGrantsNoLoyaltyDiscount() {
        Scenario scenario = new Scenario(new Customer(1),
                List.of(new QuoteStep(List.of(new Item("sword")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(115, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void firstInsuranceAddsTheInitialAssessmentSurcharge() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("staff")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(93, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void secondContractGetsTheFollowUpDiscount() {
        QuoteStep sword = new QuoteStep(List.of(new Item("sword")));
        Scenario scenario = new Scenario(new Customer(0), List.of(sword, sword));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(115, ((QuoteResult) results.get(0)).premium());
        assertEquals(100, ((QuoteResult) results.get(1)).premium());
    }

    @Test
    void thirdContractAlsoGetsTheFollowUpDiscount() {
        QuoteStep sword = new QuoteStep(List.of(new Item("sword")));
        Scenario scenario = new Scenario(new Customer(0), List.of(sword, sword, sword));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(100, ((QuoteResult) results.get(2)).premium());
    }

    @Test
    void initialAssessmentSurchargeAppliesToEveryQuote() {
        QuoteStep sword = new QuoteStep(List.of(new Item("sword")));
        Scenario scenario = new Scenario(new Customer(3), List.of(sword, sword));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(80, ((QuoteResult) results.get(1)).premium());
    }

    @Test
    void processingFeeIsAddedLast() {
        Scenario discounted = new Scenario(new Customer(2),
                List.of(new QuoteStep(List.of(new Item("sword")))));

        List<StepResult> results = new ClaimOffice().run(discounted);

        assertEquals(95, ((QuoteResult) results.get(0)).premium());
    }

    // ---------- quote: rounding ----------

    @Test
    void premiumIsRoundedUp() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(nCopies(7, new Item("rune")))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(198, ((QuoteResult) results.get(0)).premium());
    }

    // ---------- quote: integration examples ----------

    /**
     * The specification's first integration example: 100 G base + 50 G curse + 10 G initial
     * assessment = 160 G, + 5 G fee = 165 G. It pins the stacking order, not the curse rate.
     */
    @Test
    void newcomerWithACursedSword() {
        Item cursedSword = new Item("sword", "steel", 3, true);
        Scenario scenario = new Scenario(new Customer(0), List.of(new QuoteStep(List.of(cursedSword))));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(165, ((QuoteResult) results.get(0)).premium());
    }

    @Test
    void longStandingCustomersSecondContract() {
        QuoteStep firstContract = new QuoteStep(List.of(new Item("amulet")));
        QuoteStep secondContract = new QuoteStep(List.of(new Item("sword", "steel", 7, true)));
        Scenario scenario = new Scenario(new Customer(3), List.of(firstContract, secondContract));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(160, ((QuoteResult) results.get(1)).premium());
    }

    // ---------- quote: rejections ----------

    @Test
    void quoteWithUnknownItemTypeIsRejected() {
        Scenario scenario = new Scenario(new Customer(0),
                List.of(new QuoteStep(List.of(new Item("broomstick")))));

        assertThrows(ClaimOfficeException.class, () -> new ClaimOffice().run(scenario));
    }

    // ---------- claim: standard reimbursement and deductible ----------

    @Test
    void standardDamageIsReimbursedMinusTheDeductible() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword", "steel", 3, false)));
        ClaimStep claim = new ClaimStep(0,
                new Incident("fire", List.of(new Damage("sword", 500))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(400, ((ClaimResult) results.get(1)).payout());
    }

    @Test
    void componentDamageHasNoSpecialClause() {
        QuoteStep policy = new QuoteStep(List.of(new Item("rune")));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("rune", 200))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(100, ((ClaimResult) results.get(1)).payout());
    }

    @Test
    void deductibleAppliesPerDamageEntry() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword"), new Item("amulet")));
        ClaimStep claim = new ClaimStep(0, new Incident("dragon attack",
                List.of(new Damage("sword", 500), new Damage("amulet", 300))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(600, ((ClaimResult) results.get(1)).payout());
    }

    // ---------- claim: special clauses ----------

    @Test
    void highEnchantmentDamageIsReimbursedAtFiftyPercent() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword", "steel", 9, false)));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 1000))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(400, ((ClaimResult) results.get(1)).payout());
    }

    @Test
    void enchantmentEightIsInsideTheHighEnchantmentClause() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword", "steel", 8, false)));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 1000))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(400, ((ClaimResult) results.get(1)).payout());
    }

    @Test
    void enchantmentSevenIsOutsideTheHighEnchantmentClause() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword", "steel", 7, false)));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 1000))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(900, ((ClaimResult) results.get(1)).payout());
    }

    @Test
    void dragonMaterialDamageIsFullyReimbursed() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword", "dragon", 5, false)));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 800))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(700, ((ClaimResult) results.get(1)).payout());
    }

    @Test
    void highEnchantmentClauseWinsOverDragonMaterial() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword", "dragon", 9, false)));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 1000))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(400, ((ClaimResult) results.get(1)).payout());
    }

    @Test
    void dragonMaterialSwordAtEnchantmentEightUsesTheFiftyPercentClause() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword", "dragon", 8, false)));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 1000))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(400, ((ClaimResult) results.get(1)).payout());
    }

    // ---------- claim: payout rounding ----------

    @Test
    void payoutIsRoundedDown() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword", "steel", 9, false)));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 901))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(350, ((ClaimResult) results.get(1)).payout());
    }

    // ---------- claim: insurance sum and cap ----------

    @Test
    void insuranceSumIsTheSumOfTheItemsInsuranceValues() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword"), new Item("amulet")));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 200))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(3100, ((ClaimResult) results.get(1)).remainingCap());
    }

    @Test
    void twoSwordsDoubleTheInsuranceSum() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword"), new Item("sword")));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 200))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(3900, ((ClaimResult) results.get(1)).remainingCap());
    }

    @Test
    void blockDiscountDoesNotReduceTheInsuranceSum() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword"),
                new Item("rune"), new Item("rune"), new Item("rune")));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 200))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(3400, ((ClaimResult) results.get(1)).remainingCap());
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword", "steel", 3, true)));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 200))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(165, ((QuoteResult) results.get(0)).premium());
        assertEquals(1900, ((ClaimResult) results.get(1)).remainingCap());
    }

    @Test
    void firstClaimReducesTheRemainingCap() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword")));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 1500))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        ClaimResult settled = (ClaimResult) results.get(1);
        assertEquals(1400, settled.payout());
        assertEquals(600, settled.remainingCap());
    }

    @Test
    void secondClaimIsLimitedToTheRemainingCap() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword")));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", 1500))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        ClaimResult settled = (ClaimResult) results.get(2);
        assertEquals(600, settled.payout());
        assertEquals(0, settled.remainingCap());
    }

    // ---------- claim: multiple items of the same type ----------

    @Test
    void eachDamageEntryOfTheSameTypeIsTreatedSeparately() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword"), new Item("sword")));
        ClaimStep claim = new ClaimStep(0, new Incident("dragon attack",
                List.of(new Damage("sword", 500), new Damage("sword", 500))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        List<StepResult> results = new ClaimOffice().run(scenario);

        assertEquals(800, ((ClaimResult) results.get(1)).payout());
    }

    @Test
    void moreDamageEntriesThanInsuredItemsAreRejected() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword")));
        ClaimStep claim = new ClaimStep(0, new Incident("dragon attack",
                List.of(new Damage("sword", 500), new Damage("sword", 500))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        assertThrows(ClaimOfficeException.class, () -> new ClaimOffice().run(scenario));
    }

    // ---------- claim: rejections ----------

    @Test
    void damageToAnItemOutsideThePolicyIsRejected() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword")));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("amulet", 200))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        assertThrows(ClaimOfficeException.class, () -> new ClaimOffice().run(scenario));
    }

    @Test
    void damageWithUnknownItemTypeIsRejected() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword")));
        ClaimStep claim = new ClaimStep(0,
                new Incident("fire", List.of(new Damage("broomstick", 200))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        assertThrows(ClaimOfficeException.class, () -> new ClaimOffice().run(scenario));
    }

    @Test
    void negativeDamageAmountIsRejected() {
        QuoteStep policy = new QuoteStep(List.of(new Item("sword")));
        ClaimStep claim = new ClaimStep(0, new Incident("fire", List.of(new Damage("sword", -200))));
        Scenario scenario = new Scenario(new Customer(0), List.of(policy, claim));

        assertThrows(ClaimOfficeException.class, () -> new ClaimOffice().run(scenario));
    }

    // ---------- CLI adapter ----------

    @Test
    void cliWritesResultsForEachStepInOrder() throws Exception {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "sword"}]},
                           {"op": "quote", "items": [{"type": "amulet"}]}]}
                """;

        String stdout = runCli(scenario);

        assertEquals("{\"results\":[{\"premium\":115},{\"premium\":62}]}", stdout.strip());
    }

    /** Runs the CLI on the given stdin and returns everything it wrote to stdout. */
    private static String runCli(String stdin) throws Exception {
        InputStream originalIn = System.in;
        PrintStream originalOut = System.out;
        ByteArrayOutputStream captured = new ByteArrayOutputStream();
        try {
            System.setIn(new ByteArrayInputStream(stdin.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(captured, true, StandardCharsets.UTF_8));
            ClaimOfficeCli.run();
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
        }
        return captured.toString(StandardCharsets.UTF_8);
    }

    @Test
    void cliWritesTheResultFieldsRequiredByTheSchema() throws Exception {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [{"op": "quote",
                            "items": [{"type": "amulet", "material": "silver",
                                       "enchantment": 2, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "amulet", "amount": 200}]}}]}
                """;

        String stdout = runCli(scenario);

        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}",
                stdout.strip());
    }

    @Test
    void cliExitsNonZeroAndWritesStderrOnRejection() throws Exception {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}
                """;

        InputStream originalIn = System.in;
        PrintStream originalOut = System.out;
        PrintStream originalErr = System.err;
        ByteArrayOutputStream stdout = new ByteArrayOutputStream();
        ByteArrayOutputStream stderr = new ByteArrayOutputStream();
        int status;
        try {
            System.setIn(new ByteArrayInputStream(scenario.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(stdout, true, StandardCharsets.UTF_8));
            System.setErr(new PrintStream(stderr, true, StandardCharsets.UTF_8));
            status = ClaimOfficeCli.run();
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
            System.setErr(originalErr);
        }

        assertNotEquals(0, status);
        assertEquals("", stdout.toString(StandardCharsets.UTF_8).strip());
        assertTrue(stderr.toString(StandardCharsets.UTF_8).contains("broomstick"));
    }
}
