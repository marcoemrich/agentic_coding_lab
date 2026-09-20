import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

/**
 * Behaviour list for the MHPCO Claim Office kata.
 *
 * Observable contract for rejections: the specification says the CLI "exits with a
 * non-zero status code and writes an error description to stderr". The reading adopted
 * here is that the domain/scenario layer signals the rejection by throwing an
 * IllegalArgumentException, and that ClaimOfficeCli translates such a throw into a
 * non-zero exit status plus a stderr message. The specification does not establish an
 * exception type or message, so the tests assert only the throw and the CLI status.
 */
class ClaimOfficeTest {

    /** Below the high-enchantment threshold, so the curse surcharge is observed in isolation. */
    private static final int NOT_HIGHLY_ENCHANTED = 3;

    private static Map<String, Object> item(String type) {
        return Map.of("type", type);
    }

    private static Map<String, Object> cursedSword() {
        return sword(NOT_HIGHLY_ENCHANTED, true);
    }

    private static Map<String, Object> dragonSword(int enchantment) {
        return Map.of("type", "sword", "material", "dragon",
                "enchantment", enchantment, "cursed", false);
    }

    private static Map<String, Object> sword(int enchantment, boolean cursed) {
        return Map.of("type", "sword", "material", "steel", "enchantment", enchantment, "cursed", cursed);
    }

    private static Map<String, Object> damage(String itemType, int amount) {
        return Map.of("itemType", itemType, "amount", amount);
    }

    private static List<Map<String, Object>> items(String type, int count) {
        List<Map<String, Object>> items = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            items.add(item(type));
        }
        return items;
    }

    /** Runs the CLI against the given stdin, capturing stdout; callers need {@code throws Exception}. */
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

    @SafeVarargs
    private static List<Map<String, Object>> allOf(List<Map<String, Object>>... groups) {
        List<Map<String, Object>> all = new ArrayList<>();
        for (List<Map<String, Object>> group : groups) {
            all.addAll(group);
        }
        return all;
    }

    // ---------- Quote: processing fee and single base premiums ----------

    @Test
    void emptyItemListCostsOnlyTheProcessingFee() {
        assertEquals(5, new ClaimOffice(0).quote(List.of()));
    }

    @Test
    void plainSwordPremiumForNewcomer() {
        assertEquals(115, new ClaimOffice(0).quote(List.of(item("sword"))));
    }

    @Test
    void plainAmuletPremiumForNewcomer() {
        assertEquals(71, new ClaimOffice(0).quote(List.of(item("amulet"))));
    }

    @Test
    void plainStaffPremiumForNewcomer() {
        assertEquals(93, new ClaimOffice(0).quote(List.of(item("staff"))));
    }

    @Test
    void plainPotionPremiumForNewcomer() {
        assertEquals(49, new ClaimOffice(0).quote(List.of(item("potion"))));
    }

    @Test
    void singleRunePremiumForNewcomer() {
        assertEquals(33, new ClaimOffice(0).quote(List.of(item("rune"))));
    }

    @Test
    void singleMoonstonePremiumForNewcomer() {
        assertEquals(33, new ClaimOffice(0).quote(List.of(item("moonstone"))));
    }

    // ---------- Quote: component building block ----------

    @Test
    void twoRunesHaveBasePremiumFifty() {
        assertEquals(50, new ClaimOffice(0).policyBasePremium(items("rune", 2)));
    }

    @Test
    void threeRunesFormABlockWithBasePremiumSixty() {
        assertEquals(60, new ClaimOffice(0).policyBasePremium(items("rune", 3)));
    }

    @Test
    void fourRunesHaveNoBlockAndBasePremiumHundred() {
        assertEquals(100, new ClaimOffice(0).policyBasePremium(items("rune", 4)));
    }

    @Test
    void sevenRunesHaveBasePremiumOneHundredSeventyFive() {
        assertEquals(175, new ClaimOffice(0).policyBasePremium(items("rune", 7)));
    }

    @Test
    void mixedComponentTypesFormNoBlock() {
        assertEquals(75, new ClaimOffice(0).policyBasePremium(
                allOf(items("rune", 2), items("moonstone", 1))));
    }

    @Test
    void twoComponentTypesFormTwoSeparateBlocks() {
        assertEquals(120, new ClaimOffice(0).policyBasePremium(
                allOf(items("rune", 3), items("moonstone", 3))));
    }

    // ---------- Quote: item-specific modifiers ----------

    @Test
    void cursedItemAddsFiftyPercentRiskSurcharge() {
        assertEquals(150, new ClaimOffice(0).premiumBeforePolicyModifiers(List.of(cursedSword())));
    }

    @Test
    void enchantmentFiveAddsThirtyPercentRiskSurcharge() {
        assertEquals(130, new ClaimOffice(0).premiumBeforePolicyModifiers(List.of(sword(5, false))));
    }

    @Test
    void enchantmentFourAddsNoHighEnchantmentSurcharge() {
        assertEquals(100, new ClaimOffice(0).premiumBeforePolicyModifiers(List.of(sword(4, false))));
    }

    @Test
    void cursedAndHighlyEnchantedItemAddsBothSurcharges() {
        assertEquals(180, new ClaimOffice(0).premiumBeforePolicyModifiers(List.of(sword(5, true))));
    }

    @Test
    void itemModifierAppliesToTheAffectedItemNotTheWholePolicy() {
        assertEquals(210, new ClaimOffice(0).premiumBeforePolicyModifiers(
                List.of(cursedSword(), item("amulet"))));
    }

    // ---------- Quote: policy-wide modifiers ----------

    @Test
    void twoYearsWithMhpcoGrantsLoyaltyDiscount() {
        assertEquals(95, new ClaimOffice(2).quote(List.of(item("sword"))));
    }

    @Test
    void oneYearWithMhpcoGrantsNoLoyaltyDiscount() {
        assertEquals(115, new ClaimOffice(1).quote(List.of(item("sword"))));
    }

    /**
     * Two items on purpose: the surcharge is 10 % of the policy base premium (160 -> +16), not
     * 10 % per item. A single-item policy would pass under either reading.
     */
    @Test
    void firstInsuranceAddsTenPercentOfThePolicyBasePremium() {
        assertEquals(181, new ClaimOffice(0).quote(List.of(item("sword"), item("amulet"))));
    }

    @Test
    void secondContractReceivesFifteenPercentFollowUpDiscount() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(item("sword")));
        assertEquals(100, office.quote(List.of(item("sword"))));
    }

    @Test
    void followUpContractStillCarriesFirstInsuranceSurcharge() {
        // Shares its scenario with longStandingCustomersSecondContractPaysOneHundredSixty:
        // this test pins the clarifying question, that one the named spec example. They are
        // not independent evidence.
        ClaimOffice office = new ClaimOffice(3);
        office.quote(List.of(item("sword")));
        // 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance
        // - 15 follow-up = 155, + 5 fee = 160.
        assertEquals(160, office.quote(List.of(sword(7, true))));
    }

    @Test
    void processingFeeIsAddedAfterAllModifiers() {
        // 25 base - 5 loyalty + 2.5 first insurance = 22.5, then + 5 fee = 27.5 -> 28.
        // Adding the fee before the modifiers would yield 30 base -> 33 instead.
        assertEquals(28, new ClaimOffice(2).quote(List.of(item("rune"))));
    }

    // ---------- Quote: rounding ----------

    @Test
    void premiumRoundsUpInTheOfficesFavour() {
        // 7 runes: 175 base + 17.5 first insurance = 192.5, + 5 fee = 197.5 -> 198.
        assertEquals(198, new ClaimOffice(0).quote(items("rune", 7)));
    }

    @Test
    void intermediatePremiumFractionsAreNotRounded() {
        // 5 runes for a 2-year customer: 125 base - 25 loyalty + 12.5 first insurance = 112.5,
        // + 5 fee = 117.5 -> 118. Truncating the fractional 12.5 surcharge to 12 before summing
        // would give 117 instead, so this value only holds if intermediates stay fractional.
        // (Rounding the pre-fee subtotal instead would also give 118, so this fixture does not
        // discriminate that variant; the single rounding point is asserted by construction.)
        assertEquals(118, new ClaimOffice(2).quote(items("rune", 5)));
    }

    // ---------- Quote: integration examples ----------

    @Test
    void newcomerWithCursedSwordPaysOneHundredSixtyFive() {
        // 100 base + 50 curse + 10 first insurance = 160, + 5 fee = 165.
        assertEquals(165, new ClaimOffice(0).quote(List.of(cursedSword())));
    }

    @Test
    void longStandingCustomersSecondContractPaysOneHundredSixty() {
        // The specification's second integration example. Same scenario as
        // followUpContractStillCarriesFirstInsuranceSurcharge, which pins the
        // clarifying question; this one pins the named example and its total.
        // 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance
        // - 15 follow-up = 155, + 5 fee = 160.
        ClaimOffice office = new ClaimOffice(3);
        office.quote(List.of(item("sword")));
        assertEquals(160, office.quote(List.of(sword(7, true))));
    }

    // ---------- Quote: rejections ----------

    @Test
    void quoteWithUnknownItemTypeIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        assertThrows(IllegalArgumentException.class,
                () -> office.quote(List.of(item("broomstick"))));
    }

    // ---------- Claim: insurance sum and cap ----------

    @Test
    void capIsTwiceTheSumOfTheItemsInsuranceValues() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(item("sword"), item("amulet")));
        assertEquals(3200, office.remainingCap(0));
    }

    @Test
    void twoIdenticalItemsEachContributeTheirInsuranceValue() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(items("sword", 2));
        assertEquals(4000, office.remainingCap(0));
    }

    @Test
    void componentBlockDiscountDoesNotLowerTheInsuranceSum() {
        // Insurance sum 1000 + 3x250 = 1750 even though the 3 runes form a premium block.
        ClaimOffice office = new ClaimOffice(0);
        office.quote(allOf(List.of(item("sword")), items("rune", 3)));
        assertEquals(3500, office.remainingCap(0));
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        ClaimOffice office = new ClaimOffice(0);
        assertEquals(165, office.quote(List.of(cursedSword())));
        assertEquals(2000, office.remainingCap(0));
    }

    // ---------- Claim: payout rules ----------

    @Test
    void standardDamageIsReimbursedMinusTheDeductible() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(3, false)));
        assertEquals(400, office.claim(0, List.of(damage("sword", 500))));
    }

    @Test
    void componentDamageIsReimbursedMinusTheDeductible() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(item("rune")));
        assertEquals(100, office.claim(0, List.of(damage("rune", 200))));
    }

    @Test
    void highEnchantmentDamageIsHalvedBeforeTheDeductible() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(9, false)));
        assertEquals(400, office.claim(0, List.of(damage("sword", 1000))));
    }

    @Test
    void enchantmentEightAlreadyTriggersTheHalvingClause() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(8, false)));
        assertEquals(400, office.claim(0, List.of(damage("sword", 1000))));
    }

    @Test
    void enchantmentSevenDoesNotTriggerTheHalvingClause() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(7, false)));
        assertEquals(900, office.claim(0, List.of(damage("sword", 1000))));
    }

    @Test
    void dragonMaterialDamageIsFullyReimbursedBeforeTheDeductible() {
        // Note: on this specification the dragon rule is not behaviourally distinguishable.
        // Full reimbursement is also the default when no clause applies, and where the two
        // would differ (enchantment >= 8) the specification says the halving rule wins.
        // This test pins the specified value; it does not discriminate a dragon clause.
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(dragonSword(5)));
        assertEquals(700, office.claim(0, List.of(damage("sword", 800))));
    }

    @Test
    void highEnchantmentBeatsDragonMaterial() {
        // The specification's precedence rule. Because the halving clause wins, the payout is
        // the same as for a steel sword, so this test cannot discriminate a dragon clause
        // either -- see dragonMaterialDamageIsFullyReimbursedBeforeTheDeductible.
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(dragonSword(9)));
        assertEquals(400, office.claim(0, List.of(damage("sword", 1000))));
    }

    @Test
    void dragonSwordAtEnchantmentEightIsHalved() {
        // Threshold case of the precedence rule; like highEnchantmentBeatsDragonMaterial it
        // cannot discriminate a dragon clause, because the halving wins at exactly 8 too.
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(dragonSword(8)));
        assertEquals(400, office.claim(0, List.of(damage("sword", 1000))));
    }

    // ---------- Claim: deductible per damage event ----------

    @Test
    void theDeductibleAppliesOncePerDamagedItem() {
        // (500 - 100) + (300 - 100) = 600, not 800 - 100.
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(3, false), item("amulet")));
        assertEquals(600, office.claim(0, List.of(damage("sword", 500), damage("amulet", 300))));
    }

    @Test
    void repeatedItemTypeDamagesAreSeparateDamageEvents() {
        // Two {itemType: "sword"} entries are two damages: (500-100) + (500-100) = 800.
        ClaimOffice office = new ClaimOffice(0);
        office.quote(items("sword", 2));
        assertEquals(800, office.claim(0, List.of(damage("sword", 500), damage("sword", 500))));
    }

    // ---------- Claim: cap exhaustion ----------

    @Test
    void firstClaimReducesTheRemainingCap() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(3, false)));
        assertEquals(1400, office.claim(0, List.of(damage("sword", 1500))));
        assertEquals(600, office.remainingCap(0));
    }

    @Test
    void aSecondClaimIsLimitedByTheRemainingCap() {
        // The desired 1400 is reduced to the 600 the cap still allows.
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(3, false)));
        office.claim(0, List.of(damage("sword", 1500)));
        assertEquals(600, office.claim(0, List.of(damage("sword", 1500))));
        assertEquals(0, office.remainingCap(0));
    }

    // ---------- Claim: rounding ----------

    @Test
    void payoutRoundsDownInTheOfficesFavour() {
        // Enchantment 9 halves the 901 damage to 450.5; minus the deductible that is 350.5,
        // which rounds down to 350. Rounding up would give 351.
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(9, false)));
        assertEquals(350, office.claim(0, List.of(damage("sword", 901))));
    }

    // ---------- Claim: rejections ----------

    @Test
    void claimForAnItemOutsideThePolicyIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(3, false)));
        assertThrows(IllegalArgumentException.class,
                () -> office.claim(0, List.of(damage("amulet", 200))));
    }

    @Test
    void claimWithUnknownItemTypeIsRejected() {
        // The rejection comes from policy membership, not from a type check: an unknown type
        // can never be in a policy because quote already rejects it. If quote-time validation
        // were ever relaxed, this test would pass vacuously and would need a real type check.
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(3, false)));
        assertThrows(IllegalArgumentException.class,
                () -> office.claim(0, List.of(damage("broomstick", 200))));
    }

    @Test
    void claimWithMoreDamagesOfATypeThanInsuredIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(3, false)));
        assertThrows(IllegalArgumentException.class,
                () -> office.claim(0, List.of(damage("sword", 500), damage("sword", 500))));
    }

    @Test
    void claimWithNegativeDamageAmountIsRejected() {
        ClaimOffice office = new ClaimOffice(0);
        office.quote(List.of(sword(3, false)));
        assertThrows(IllegalArgumentException.class,
                () -> office.claim(0, List.of(damage("sword", -200))));
    }

    // ---------- CLI ----------

    @Test
    void cliProcessesQuoteAndClaimStepsInOrder() throws Exception {
        // The specification's schema example: a 5-year customer insures an amulet
        // (60 base - 12 loyalty + 6 first insurance = 54, + 5 fee = 59), then claims 200
        // against it (200 - 100 deductible = 100; cap 1200 - 100 = 1100 remaining).
        String stdout = runCli("""
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]},
                   {"op": "claim", "policy": 0, "incident": {"cause": "fire",
                     "damages": [{"itemType": "amulet", "amount": 200}]}}]}
                """);
        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}",
                stdout.trim());
    }

    @Test
    void cliClaimStepReferencesTheEarlierQuoteStepByIndex() throws Exception {
        // Two policies; the claim names policy 1 (the potion), so the payout and the remaining
        // cap must come from that policy: 300 - 100 = 200, cap 800 - 200 = 600.
        // Settling against policy 0 (the sword) would report remainingCap 1800 instead.
        String stdout = runCli("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword"}]},
                   {"op": "quote", "items": [{"type": "potion"}]},
                   {"op": "claim", "policy": 1, "incident": {"cause": "theft",
                     "damages": [{"itemType": "potion", "amount": 300}]}}]}
                """);
        assertTrue(stdout.contains("\"payout\":200,\"remainingCap\":600"), stdout);
    }

    @Test
    void cliRejectsAnInvalidScenarioWithNonZeroExitStatus() throws Exception {
        // A quote naming an unknown item type. The exit status is observed through run(),
        // which main() delegates to; calling main() directly would exit the test JVM.
        InputStream originalIn = System.in;
        PrintStream originalOut = System.out;
        PrintStream originalErr = System.err;
        ByteArrayOutputStream stdout = new ByteArrayOutputStream();
        ByteArrayOutputStream stderr = new ByteArrayOutputStream();
        int status;
        try {
            System.setIn(new ByteArrayInputStream("""
                    {"customer": {"yearsWithMHPCO": 0},
                     "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}
                    """.getBytes(StandardCharsets.UTF_8)));
            System.setOut(new PrintStream(stdout, true, StandardCharsets.UTF_8));
            System.setErr(new PrintStream(stderr, true, StandardCharsets.UTF_8));
            status = ClaimOfficeCli.run();
        } finally {
            System.setIn(originalIn);
            System.setOut(originalOut);
            System.setErr(originalErr);
        }
        assertNotEquals(0, status);
        assertFalse(stderr.toString(StandardCharsets.UTF_8).isBlank(), "expected a description on stderr");
        assertFalse(stdout.toString(StandardCharsets.UTF_8).contains("results"), "expected no results on stdout");
    }
}
