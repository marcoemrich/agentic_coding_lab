import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class ClaimOfficeTest {

    private final ByteArrayOutputStream stdout = new ByteArrayOutputStream();
    private final ByteArrayOutputStream stderr = new ByteArrayOutputStream();

    private int run(String scenario) {
        return ClaimOfficeCli.run(
                new ByteArrayInputStream(scenario.getBytes(StandardCharsets.UTF_8)),
                new PrintStream(stdout, true, StandardCharsets.UTF_8),
                new PrintStream(stderr, true, StandardCharsets.UTF_8));
    }

    private String stdout() {
        return stdout.toString(StandardCharsets.UTF_8);
    }

    private String stderr() {
        return stderr.toString(StandardCharsets.UTF_8);
    }

    // ---------- Base premiums and processing fee ----------

    @Test
    void emptyItemListCostsOnlyTheProcessingFee() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": []}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":5}]}", stdout().trim());
    }

    @Test
    void plainSwordCosts105() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "sword"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":115}]}", stdout().trim());
    }

    @Test
    void plainAmuletCosts65() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "amulet"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":71}]}", stdout().trim());
    }

    @Test
    void plainStaffCosts85() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "staff"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":93}]}", stdout().trim());
    }

    @Test
    void plainPotionCosts45() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "potion"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":49}]}", stdout().trim());
    }

    @Test
    void singleRuneCosts30() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "rune"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":33}]}", stdout().trim());
    }

    @Test
    void singleMoonstoneCosts30() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "moonstone"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":33}]}", stdout().trim());
    }

    // ---------- Building block of 3 alike components ----------

    @Test
    void twoRunesHaveBasePremium50() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "rune"}, {"type": "rune"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":60}]}", stdout().trim());
    }

    @Test
    void threeRunesFormABlockWithBasePremium60() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "rune"}, {"type": "rune"},
                                      {"type": "rune"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":71}]}", stdout().trim());
    }

    @Test
    void fourRunesHaveBasePremium100() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "rune"}, {"type": "rune"},
                                      {"type": "rune"}, {"type": "rune"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":115}]}", stdout().trim());
    }

    @Test
    void sevenRunesHaveBasePremium175() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "rune"}, {"type": "rune"},
                                      {"type": "rune"}, {"type": "rune"},
                                      {"type": "rune"}, {"type": "rune"},
                                      {"type": "rune"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":198}]}", stdout().trim());
    }

    @Test
    void twoRunesAndOneMoonstoneFormNoBlockBecauseTypesDiffer() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "rune"}, {"type": "rune"},
                                      {"type": "moonstone"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":88}]}", stdout().trim());
    }

    @Test
    void threeRunesAndThreeMoonstonesFormTwoSeparateBlocks() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "rune"}, {"type": "rune"},
                                      {"type": "rune"}, {"type": "moonstone"},
                                      {"type": "moonstone"}, {"type": "moonstone"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":137}]}", stdout().trim());
    }

    // ---------- Item-specific modifiers ----------

    @Test
    void cursedItemAddsFiftyPercentRiskSurcharge() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": true}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":165}]}", stdout().trim());
    }

    @Test
    void enchantmentExactlyFiveAddsThirtyPercentSurcharge() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 5, "cursed": false}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":145}]}", stdout().trim());
    }

    @Test
    void enchantmentFourAddsNoHighEnchantmentSurcharge() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 4, "cursed": false}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":115}]}", stdout().trim());
    }

    @Test
    void cursedAndHighlyEnchantedItemGetsBothSurcharges() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 5, "cursed": true}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":195}]}", stdout().trim());
    }

    // ---------- Policy-wide modifiers ----------

    @Test
    void exactlyTwoYearsWithMhpcoGrantsLoyaltyDiscount() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 2},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":95}]}", stdout().trim());
    }

    @Test
    void oneYearWithMhpcoGrantsNoLoyaltyDiscount() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 1},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":115}]}", stdout().trim());
    }

    @Test
    void firstInsuranceAddsTenPercentInitialAssessmentSurcharge() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "amulet", "material": "silver",
                                       "enchantment": 1, "cursed": false}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":71}]}", stdout().trim());
    }

    @Test
    void everyQuoteCarriesTheFirstInsuranceSurcharge() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 3},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":95},{\"premium\":80}]}", stdout().trim());
    }

    @Test
    void secondContractGetsFifteenPercentFollowUpDiscount() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":115},{\"premium\":100}]}", stdout().trim());
    }

    @Test
    void thirdContractAlsoGetsTheFollowUpDiscount() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "sword"}]},
                           {"op": "quote", "items": [{"type": "sword"}]},
                           {"op": "quote", "items": [{"type": "sword"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":115},{\"premium\":100},{\"premium\":100}]}",
                stdout().trim());
    }

    // ---------- Modifier scope on multi-item policies ----------

    @Test
    void cursedSurchargeAppliesOnlyToTheCursedItemsBasePremium() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": true},
                                      {"type": "amulet", "material": "silver",
                                       "enchantment": 1, "cursed": false}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":231}]}", stdout().trim());
    }

    @Test
    void loyaltyDiscountAppliesToThePolicyBasePremium() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 2},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false},
                                      {"type": "amulet", "material": "silver",
                                       "enchantment": 1, "cursed": false}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":149}]}", stdout().trim());
    }

    // ---------- Rounding ----------

    @Test
    void premiumIsRoundedUp() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "rune"}, {"type": "rune"},
                                      {"type": "rune"}, {"type": "rune"},
                                      {"type": "rune"}, {"type": "rune"},
                                      {"type": "rune"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":198}]}", stdout().trim());
    }

    /**
     * A second quote for a single rune: 25 base + 2.5 first insurance
     * - 3.75 follow-up contract + 5 fee = 28.75, settled once to 29 G.
     * Settling the running total after each modifier instead would give
     * 27.5 -> 28, 24.25 -> 25, 30.
     */
    @Test
    void onlyTheFinalPremiumIsRounded() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "rune"}]},
                           {"op": "quote", "items": [{"type": "rune"}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":33},{\"premium\":29}]}", stdout().trim());
    }

    // ---------- Integration examples ----------

    @Test
    void newcomerWithCursedSwordPays165() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": true}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":165}]}", stdout().trim());
    }

    @Test
    void longStandingCustomersSecondContractPays160() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 3},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 7, "cursed": true}]}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":95},{\"premium\":160}]}", stdout().trim());
    }

    // ---------- Claims: standard reimbursement and deductible ----------

    @Test
    void standardDamageIsReimbursedInFullMinusTheDeductible() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 500}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":115},{\"payout\":400,\"remainingCap\":1600}]}",
                stdout().trim());
    }

    @Test
    void componentDamageHasNoSpecialClause() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "rune"}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "rune",
                                                      "amount": 200}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":33},{\"payout\":100,\"remainingCap\":400}]}",
                stdout().trim());
    }

    @Test
    void deductibleAppliesPerDamagedItem() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false},
                                      {"type": "amulet", "material": "silver",
                                       "enchantment": 1, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "dragon attack",
                                         "damages": [{"itemType": "sword", "amount": 500},
                                                     {"itemType": "amulet", "amount": 300}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":181},{\"payout\":600,\"remainingCap\":2600}]}",
                stdout().trim());
    }

    // ---------- Claims: special clauses ----------

    @Test
    void highEnchantmentDamageIsReimbursedAtFiftyPercent() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 9, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 1000}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":145},{\"payout\":400,\"remainingCap\":1600}]}",
                stdout().trim());
    }

    @Test
    void enchantmentSevenGetsNoFiftyPercentReduction() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 7, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 1000}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":145},{\"payout\":900,\"remainingCap\":1100}]}",
                stdout().trim());
    }

    @Test
    void dragonMaterialDamageIsFullyReimbursed() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "dragon",
                                       "enchantment": 5, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 800}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":145},{\"payout\":700,\"remainingCap\":1300}]}",
                stdout().trim());
    }

    @Test
    void dragonMaterialWithEnchantmentExactlyEightIsReducedToFiftyPercent() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "dragon",
                                       "enchantment": 8, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 1000}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":145},{\"payout\":400,\"remainingCap\":1600}]}",
                stdout().trim());
    }

    @Test
    void highEnchantmentWinsOverDragonMaterial() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "dragon",
                                       "enchantment": 9, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 1000}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":145},{\"payout\":400,\"remainingCap\":1600}]}",
                stdout().trim());
    }

    // ---------- Claims: insurance sum and cap ----------

    @Test
    void capIsTwiceTheSumOfItemInsuranceValues() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false},
                                      {"type": "amulet", "material": "silver",
                                       "enchantment": 1, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 100}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":181},{\"payout\":0,\"remainingCap\":3200}]}",
                stdout().trim());
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": true}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 100}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":165},{\"payout\":0,\"remainingCap\":2000}]}",
                stdout().trim());
    }

    @Test
    void blockDiscountDoesNotReduceTheInsuranceSum() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false},
                                      {"type": "rune"}, {"type": "rune"},
                                      {"type": "rune"}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 100}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":181},{\"payout\":0,\"remainingCap\":3500}]}",
                stdout().trim());
    }

    @Test
    void firstClaimReducesTheRemainingCap() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 1500}]}},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "flood",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 1500}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":115},"
                        + "{\"payout\":1400,\"remainingCap\":600},"
                        + "{\"payout\":600,\"remainingCap\":0}]}",
                stdout().trim());
    }

    @Test
    void secondClaimIsCappedByTheRemainingCap() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 1500}]}},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "flood",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 1500}]}},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "theft",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 400}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":115},"
                        + "{\"payout\":1400,\"remainingCap\":600},"
                        + "{\"payout\":600,\"remainingCap\":0},"
                        + "{\"payout\":0,\"remainingCap\":0}]}",
                stdout().trim());
    }

    /**
     * A steel sword at enchantment 9 damaged by 901 G: the high-enchantment
     * clause reimburses 450.5 G, the deductible leaves 350.5 G, settled down
     * to 350 G in the MHPCO's favour.
     */
    @Test
    void payoutIsRoundedDown() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 9, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 901}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":145},{\"payout\":350,\"remainingCap\":1649}]}",
                stdout().trim());
    }

    // ---------- Multiple items of the same type ----------

    @Test
    void twoSwordsDoubleTheInsuranceSum() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false},
                                      {"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 100}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":225},{\"payout\":0,\"remainingCap\":4000}]}",
                stdout().trim());
    }

    @Test
    void eachDamageEntryOfTheSameTypeGetsItsOwnDeductible() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false},
                                      {"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "dragon attack",
                                         "damages": [{"itemType": "sword", "amount": 500},
                                                     {"itemType": "sword", "amount": 500}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":225},{\"payout\":800,\"remainingCap\":3200}]}",
                stdout().trim());
    }

    @Test
    void moreDamageEntriesThanInsuredItemsRejectsTheClaim() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "dragon attack",
                                         "damages": [{"itemType": "sword", "amount": 500},
                                                     {"itemType": "sword", "amount": 500}]}}]}""");

        assertNotEquals(0, exitCode);
        assertEquals("", stdout());
        assertFalse(stderr().isBlank());
    }

    // ---------- Error cases (observable contract: non-zero exit code + stderr message, no stdout results) ----------

    @Test
    void unknownItemTypeInQuoteIsRejected() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}""");

        assertNotEquals(0, exitCode);
        assertEquals("", stdout());
        assertFalse(stderr().isBlank());
    }

    @Test
    void claimAgainstAnUninsuredItemIsRejected() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "amulet",
                                                      "amount": 200}]}}]}""");

        assertNotEquals(0, exitCode);
        assertEquals("", stdout());
        assertFalse(stderr().isBlank());
    }

    @Test
    void claimWithUnknownItemTypeIsRejected() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "broomstick",
                                                      "amount": 200}]}}]}""");

        assertNotEquals(0, exitCode);
        assertEquals("", stdout());
        assertFalse(stderr().isBlank());
    }

    @Test
    void negativeDamageAmountIsRejected() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": -200}]}}]}""");

        assertNotEquals(0, exitCode);
        assertEquals("", stdout());
        assertFalse(stderr().isBlank());
    }

    // ---------- CLI contract ----------

    @Test
    void resultsMirrorStepsInOrderWithTheSpecifiedFieldNames() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [{"op": "quote",
                            "items": [{"type": "amulet", "material": "silver",
                                       "enchantment": 2, "cursed": false}]},
                           {"op": "claim", "policy": 0,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "amulet",
                                                      "amount": 200}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}",
                stdout().trim());
    }

    @Test
    void claimsReferenceTheirPolicyByStepIndex() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "rune"}]},
                           {"op": "quote",
                            "items": [{"type": "sword", "material": "steel",
                                       "enchantment": 3, "cursed": false}]},
                           {"op": "claim", "policy": 1,
                            "incident": {"cause": "fire",
                                         "damages": [{"itemType": "sword",
                                                      "amount": 500}]}}]}""");

        assertEquals(0, exitCode);
        assertEquals(
                "{\"results\":[{\"premium\":33},{\"premium\":100},"
                        + "{\"payout\":400,\"remainingCap\":1600}]}",
                stdout().trim());
    }

    @Test
    void successfulRunExitsZeroAndWritesOnlyTheResultsDocument() {
        int exitCode = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": []}]}""");

        assertEquals(0, exitCode);
        assertEquals("{\"results\":[{\"premium\":5}]}", stdout());
        assertEquals("", stderr());
    }
}
