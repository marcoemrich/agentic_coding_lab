import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class ClaimOfficeCliTest {
    @Test void emptyQuoteCostsOnlyFiveGProcessingFee() throws Exception {
        CliResult result = execute("""
                {"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]}]}
                """);
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":5}]}", result.stdout());
        assertEquals("", result.stderr());
    }
    @Test void quotesSwordPriceListEntry() throws Exception {
        assertPremium(0, "{\"type\":\"sword\"}", 115);
    }
    @Test void quotesAmuletPriceListEntry() throws Exception {
        assertPremium(0, "{\"type\":\"amulet\"}", 71);
    }
    @Test void quotesStaffPriceListEntry() throws Exception {
        assertPremium(0, "{\"type\":\"staff\"}", 93);
    }
    @Test void quotesPotionPriceListEntry() throws Exception {
        assertPremium(0, "{\"type\":\"potion\"}", 49);
    }
    @Test void quotesRunePriceListEntry() throws Exception {
        assertPremium(0, "{\"type\":\"rune\"}", 33);
    }
    @Test void quotesMoonstonePriceListEntry() throws Exception {
        assertPremium(0, "{\"type\":\"moonstone\"}", 33);
    }
    @Test void twoRunesDoNotFormBlock() throws Exception {
        assertPremium(0, "{\"type\":\"rune\"},{\"type\":\"rune\"}", 60);
    }
    @Test void threeRunesFormBlock() throws Exception {
        assertPremium(0, "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}", 71);
    }
    @Test void fourRunesDoNotPartiallyFormBlock() throws Exception {
        assertPremium(0, componentItems("rune", 4), 115);
    }
    @Test void sevenRunesDoNotPartiallyFormBlocks() throws Exception {
        assertPremium(0, componentItems("rune", 7), 198);
    }
    @Test void unlikeComponentsDoNotFormBlock() throws Exception {
        assertPremium(0, componentItems("rune", 2) + ",{\"type\":\"moonstone\"}", 88);
    }
    @Test void eachComponentTypeFormsItsOwnBlock() throws Exception {
        assertPremium(0, componentItems("rune", 3) + "," + componentItems("moonstone", 3), 137);
    }
    @Test void itemSurchargeDoesNotApplyToWholePolicy() throws Exception {
        assertPremium(0, "{\"type\":\"sword\",\"cursed\":true},"
                + "{\"type\":\"amulet\",\"cursed\":false}", 231);
    }
    @Test void loyaltyStartsAtExactlyTwoYears() throws Exception {
        assertPremium(2, "{\"type\":\"sword\"}", 95);
    }
    @Test void highEnchantmentStartsAtFiveAndStacksWithCurse() throws Exception {
        assertPremium(0, "{\"type\":\"sword\",\"enchantment\":5,\"cursed\":true}", 195);
    }
    @Test void enchantmentFourDoesNotGetHighEnchantmentSurcharge() throws Exception {
        assertPremium(0, "{\"type\":\"sword\",\"enchantment\":4,\"cursed\":true}", 165);
    }
    @Test void quotesNewcomerCursedSwordIntegrationExample() throws Exception {
        assertPremium(0, "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":true}", 165);
    }
    @Test void followUpContractStillChargesFirstInsurancePerItem() throws Exception {
        CliResult result = execute("""
                {"customer":{"yearsWithMHPCO":3},"steps":[
                  {"op":"quote","items":[]},
                  {"op":"quote","items":[{"type":"sword","material":"steel","enchantment":7,"cursed":true}]}
                ]}
                """);
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":5},{\"premium\":160}]}", result.stdout());
    }
    @Test void enchantmentEightHalfReimbursementWinsOverDragonMaterial() throws Exception {
        CliResult result = execute("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword","material":"dragon","enchantment":8}]},
                  {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"sword","amount":1000}]}}
                ]}
                """);
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":145},{\"payout\":400,\"remainingCap\":1600}]}", result.stdout());
    }
    @Test void appliesDeductibleToEachDamageEntry() throws Exception {
        CliResult result = execute("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"},{"type":"amulet"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"dragon attack","damages":[
                    {"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}]}}
                ]}
                """);
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":181},{\"payout\":600,\"remainingCap\":2600}]}", result.stdout());
    }
    @Test void standardSwordDamageIsFullyReimbursedBeforeDeductible() throws Exception {
        assertSingleClaim("{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3}",
                "sword", 500, 115, 400, 1600);
    }
    @Test void standardRuneDamageIsFullyReimbursedBeforeDeductible() throws Exception {
        assertSingleClaim("{\"type\":\"rune\"}", "rune", 200, 33, 100, 400);
    }
    @Test void highEnchantmentWinsWhenBothClaimClausesApply() throws Exception {
        assertSingleClaim("{\"type\":\"sword\",\"material\":\"dragon\",\"enchantment\":9}",
                "sword", 1000, 145, 400, 1600);
    }
    @Test void dragonMaterialGetsFullReimbursementBelowClaimEnchantmentThreshold() throws Exception {
        assertSingleClaim("{\"type\":\"sword\",\"material\":\"dragon\",\"enchantment\":5}",
                "sword", 800, 145, 700, 1300);
    }
    @Test void highlyEnchantedNonDragonGetsHalfReimbursement() throws Exception {
        assertSingleClaim("{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":9}",
                "sword", 1000, 145, 400, 1600);
    }
    @Test void duplicateItemsBothContributeToInsuranceSum() throws Exception {
        CliResult result = execute("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"},{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"inspection","damages":[]}}
                ]}
                """);
        assertEquals("{\"results\":[{\"premium\":225},{\"payout\":0,\"remainingCap\":4000}]}", result.stdout());
    }
    @Test void duplicateDamageEntriesMatchSeparateInsuredItems() throws Exception {
        CliResult result = execute("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"},{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"dragon attack","damages":[
                    {"itemType":"sword","amount":500},{"itemType":"sword","amount":500}]}}
                ]}
                """);
        assertEquals("{\"results\":[{\"premium\":225},{\"payout\":800,\"remainingCap\":3200}]}", result.stdout());
    }
    @Test void rejectsDamageMultiplicityBeyondPolicyCoverage() throws Exception {
        CliResult result = execute("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"attack","damages":[
                    {"itemType":"sword","amount":200},{"itemType":"sword","amount":200}]}}
                ]}
                """);
        org.junit.jupiter.api.Assertions.assertNotEquals(0, result.status());
        assertEquals("", result.stdout());
        org.junit.jupiter.api.Assertions.assertFalse(result.stderr().isBlank());
    }
    @Test void capUsesSumOfMainItemInsuranceValues() throws Exception {
        assertEmptyClaimCap("{\"type\":\"sword\"},{\"type\":\"amulet\"}", 181, 3200);
    }
    @Test void premiumModifiersDoNotIncreaseCap() throws Exception {
        assertEmptyClaimCap("{\"type\":\"sword\",\"cursed\":true}", 165, 2000);
    }
    @Test void componentBlockDiscountDoesNotReduceInsuranceSum() throws Exception {
        assertEmptyClaimCap("{\"type\":\"sword\"}," + componentItems("rune", 3), 181, 3500);
    }
    @Test void successiveClaimsConsumeAndCannotExceedPolicyCap() throws Exception {
        CliResult result = execute("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"first","damages":[{"itemType":"sword","amount":1500}]}},
                  {"op":"claim","policy":0,"incident":{"cause":"second","damages":[{"itemType":"sword","amount":1500}]}}
                ]}
                """);
        assertEquals("{\"results\":[{\"premium\":115},{\"payout\":1400,\"remainingCap\":600},"
                + "{\"payout\":600,\"remainingCap\":0}]}", result.stdout());
    }
    @Test void premiumRoundsUpOnlyAtFinalAmount() throws Exception {
        CliResult result = execute("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[]},
                  {"op":"quote","items":[{"type":"sword","cursed":true},{"type":"rune"},{"type":"rune"}]}
                ]}
                """);
        assertEquals("{\"results\":[{\"premium\":5},{\"premium\":198}]}", result.stdout());
    }
    @Test void payoutRoundsDownOnlyAtFinalAmount() throws Exception {
        assertSingleClaim("{\"type\":\"sword\",\"enchantment\":8}",
                "sword", 901, 145, 350, 1650);
    }
    @Test void rejectsUnknownQuotedItemAtomically() throws Exception {
        CliResult result = execute("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"broomstick"}]}
                ]}
                """);
        assertRejected(result);
    }
    @Test void rejectsDamageToItemOutsidePolicy() throws Exception {
        assertRejected(execute(claimInput("{\"type\":\"sword\"}", "amulet", 200)));
    }
    @Test void rejectsUnknownDamageItemType() throws Exception {
        assertRejected(execute(claimInput("{\"type\":\"sword\"}", "broomstick", 200)));
    }
    @Test void rejectsNegativeDamageAmount() throws Exception {
        assertRejected(execute(claimInput("{\"type\":\"sword\"}", "sword", -200)));
    }
    @Test void insuranceValueCatalogueDeterminesCaps() throws Exception {
        assertEmptyClaimCap("{\"type\":\"sword\"}", 115, 2000);
        assertEmptyClaimCap("{\"type\":\"amulet\"}", 71, 1200);
        assertEmptyClaimCap("{\"type\":\"staff\"}", 93, 1600);
        assertEmptyClaimCap("{\"type\":\"potion\"}", 49, 800);
        assertEmptyClaimCap("{\"type\":\"rune\"}", 33, 500);
        assertEmptyClaimCap("{\"type\":\"moonstone\"}", 33, 500);
    }

    private String claimInput(String item, String damageType, int amount) {
        return "{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[" + item + "]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"test\",\"damages\":["
                + "{\"itemType\":\"" + damageType + "\",\"amount\":" + amount + "}]}}]}";
    }

    private void assertRejected(CliResult result) {
        org.junit.jupiter.api.Assertions.assertNotEquals(0, result.status());
        assertEquals("", result.stdout());
        org.junit.jupiter.api.Assertions.assertFalse(result.stderr().isBlank());
    }

    private void assertEmptyClaimCap(String items, int premium, int cap) throws Exception {
        CliResult result = execute("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[" + items + "]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"inspection\",\"damages\":[]}}]}");
        assertEquals("{\"results\":[{\"premium\":" + premium
                + "},{\"payout\":0,\"remainingCap\":" + cap + "}]}", result.stdout());
    }

    private void assertSingleClaim(String item, String damageType, int amount,
            int premium, int payout, int remainingCap) throws Exception {
        CliResult result = execute("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[" + item + "]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"test\",\"damages\":["
                + "{\"itemType\":\"" + damageType + "\",\"amount\":" + amount + "}]}}]}");
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":" + premium + "},{\"payout\":" + payout
                + ",\"remainingCap\":" + remainingCap + "}]}", result.stdout());
    }

    private String componentItems(String type, int count) {
        return java.util.stream.IntStream.range(0, count)
                .mapToObj(index -> "{\"type\":\"" + type + "\"}")
                .collect(java.util.stream.Collectors.joining(","));
    }

    private void assertPremium(int years, String items, int expected) throws Exception {
        CliResult result = execute("{\"customer\":{\"yearsWithMHPCO\":" + years
                + "},\"steps\":[{\"op\":\"quote\",\"items\":[" + items + "]}]}");
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":" + expected + "}]}", result.stdout());
    }

    private CliResult execute(String input) throws Exception {
        ByteArrayOutputStream stdout = new ByteArrayOutputStream();
        ByteArrayOutputStream stderr = new ByteArrayOutputStream();
        int status = ClaimOfficeCli.run(
                new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)),
                new PrintStream(stdout), new PrintStream(stderr));
        return new CliResult(status, stdout.toString(StandardCharsets.UTF_8).trim(),
                stderr.toString(StandardCharsets.UTF_8).trim());
    }

    private record CliResult(int status, String stdout, String stderr) { }
}
