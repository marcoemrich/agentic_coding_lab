import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class ClaimOfficeCliTest {
    @Test void emptyQuoteCostsOnlyProcessingFee() {
        Result result = run("""
                {"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]}]}
                """);
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":5}]}", result.out());
    }
    @Test void quotesSwordPriceListEntry() {
        assertQuote(0, "{\"type\":\"sword\"}", 115);
    }
    @Test void quotesAmuletPriceListEntry() {
        assertQuote(0, "{\"type\":\"amulet\"}", 71);
    }
    @Test void quotesStaffPriceListEntry() {
        assertQuote(0, "{\"type\":\"staff\"}", 93);
    }
    @Test void quotesPotionPriceListEntry() {
        assertQuote(0, "{\"type\":\"potion\"}", 49);
    }
    @Test void quotesRunePriceListEntry() {
        assertQuote(0, "{\"type\":\"rune\"}", 33);
    }
    @Test void quotesMoonstonePriceListEntry() {
        assertQuote(0, "{\"type\":\"moonstone\"}", 33);
    }
    @Test void twoRunesDoNotFormBlock() {
        assertQuote(0, "{\"type\":\"rune\"},{\"type\":\"rune\"}", 60);
    }
    @Test void threeRunesFormBlock() {
        assertQuote(0, "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}", 71);
    }
    @Test void fourRunesDoNotFormBlock() {
        assertQuote(0, "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}", 115);
    }
    @Test void sevenRunesDoNotPartiallyFormBlocks() {
        assertQuote(0, "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}", 198);
    }
    @Test void differentComponentTypesAreNotAlike() {
        assertQuote(0, "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"moonstone\"}", 88);
    }
    @Test void separateTypesFormSeparateBlocks() {
        assertQuote(0, "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"moonstone\"},{\"type\":\"moonstone\"},{\"type\":\"moonstone\"}", 137);
    }
    @Test void itemSurchargeHasItemScope() {
        assertQuote(0, "{\"type\":\"sword\",\"cursed\":true},{\"type\":\"amulet\",\"cursed\":false}", 231);
    }
    @Test void loyaltyThresholdIsInclusive() {
        assertQuote(2, "{\"type\":\"sword\"}", 95);
    }
    @Test void enchantmentThresholdIsInclusiveAndSurchargesStack() {
        assertQuote(0, "{\"type\":\"sword\",\"cursed\":true,\"enchantment\":5}", 195);
    }
    @Test void enchantmentBelowThresholdDoesNotSurcharge() {
        assertQuote(0, "{\"type\":\"sword\",\"cursed\":true,\"enchantment\":4}", 165);
    }
    @Test void quotesNewcomerCursedSwordIntegration() {
        assertQuote(0, "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":true}", 165);
    }
    @Test void quotesLongStandingSecondContractIntegration() {
        Result result = run("""
                {"customer":{"yearsWithMHPCO":3},"steps":[
                  {"op":"quote","items":[]},
                  {"op":"quote","items":[{"type":"sword","material":"steel","enchantment":7,"cursed":true}]}
                ]}
                """);
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":5},{\"premium\":160}]}", result.out());
    }
    @Test void roundsFinalPremiumInOfficeFavor() {
        assertQuote(2, "{\"type\":\"rune\"},{\"type\":\"sword\",\"cursed\":true,\"enchantment\":5}", 198);
    }
    @Test void reimbursesStandardSwordDamageWithDeductible() {
        Result result = run(claimScenario("{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3}",
                "{\"itemType\":\"sword\",\"amount\":500}"));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":115},{\"payout\":400,\"remainingCap\":1600}]}", result.out());
    }
    @Test void reimbursesComponentDamageWithDeductible() {
        Result result = run(claimScenario("{\"type\":\"rune\"}",
                "{\"itemType\":\"rune\",\"amount\":200}"));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":33},{\"payout\":100,\"remainingCap\":400}]}", result.out());
    }
    @Test void enchantmentClaimThresholdIsInclusiveAndWinsOverDragon() {
        Result result = run(claimScenario("{\"type\":\"sword\",\"material\":\"dragon\",\"enchantment\":8}",
                "{\"itemType\":\"sword\",\"amount\":1000}"));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":145},{\"payout\":400,\"remainingCap\":1600}]}", result.out());
    }
    @Test void highEnchantmentWinsWhenBothClaimClausesApply() {
        Result result = run(claimScenario("{\"type\":\"sword\",\"material\":\"dragon\",\"enchantment\":9}",
                "{\"itemType\":\"sword\",\"amount\":1000}"));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":145},{\"payout\":400,\"remainingCap\":1600}]}", result.out());
    }
    @Test void dragonMaterialGetsFullReimbursementBelowHighThreshold() {
        Result result = run(claimScenario("{\"type\":\"sword\",\"material\":\"dragon\",\"enchantment\":5}",
                "{\"itemType\":\"sword\",\"amount\":800}"));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":145},{\"payout\":700,\"remainingCap\":1300}]}", result.out());
    }
    @Test void highEnchantmentHalvesNonDragonDamage() {
        Result result = run(claimScenario("{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":9}",
                "{\"itemType\":\"sword\",\"amount\":1000}"));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":145},{\"payout\":400,\"remainingCap\":1600}]}", result.out());
    }
    @Test void appliesDeductiblePerDamageEntry() {
        Result result = run(claimScenario("{\"type\":\"sword\"},{\"type\":\"amulet\"}",
                "{\"itemType\":\"sword\",\"amount\":500},{\"itemType\":\"amulet\",\"amount\":300}"));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":181},{\"payout\":600,\"remainingCap\":2600}]}", result.out());
    }
    @Test void countsRepeatedInsuredItemsInCap() {
        Result result = run(claimScenario("{\"type\":\"sword\"},{\"type\":\"sword\"}", ""));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":225},{\"payout\":0,\"remainingCap\":4000}]}", result.out());
    }
    @Test void acceptsSeparateDamagesForTwoInsuredSwords() {
        Result result = run(claimScenario("{\"type\":\"sword\"},{\"type\":\"sword\"}",
                "{\"itemType\":\"sword\",\"amount\":500},{\"itemType\":\"sword\",\"amount\":500}"));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":225},{\"payout\":800,\"remainingCap\":3200}]}", result.out());
    }
    @Test void rejectsDamageMultiplicityBeyondPolicy() {
        Result result = run(claimScenario("{\"type\":\"sword\"}",
                "{\"itemType\":\"sword\",\"amount\":500},{\"itemType\":\"sword\",\"amount\":500}"));
        assertTrue(result.status() != 0);
        assertEquals("", result.out());
        assertFalse(result.err().isBlank());
    }
    @Test void sumsDifferentItemValuesForCap() {
        Result result = run(claimScenario("{\"type\":\"sword\"},{\"type\":\"amulet\"}", ""));
        assertEquals(0, result.status());
        assertTrue(result.out().endsWith("{\"payout\":0,\"remainingCap\":3200}]}"));
    }
    @Test void premiumModifiersDoNotRaiseCap() {
        Result result = run(claimScenario("{\"type\":\"sword\",\"cursed\":true}", ""));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":165},{\"payout\":0,\"remainingCap\":2000}]}", result.out());
    }
    @Test void componentBlockDiscountDoesNotLowerCap() {
        Result result = run(claimScenario("{\"type\":\"sword\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}", ""));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":181},{\"payout\":0,\"remainingCap\":3500}]}", result.out());
    }
    @Test void carriesCapExhaustionAcrossClaims() {
        Result result = run("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"first","damages":[{"itemType":"sword","amount":1500}]}},
                  {"op":"claim","policy":0,"incident":{"cause":"second","damages":[{"itemType":"sword","amount":1500}]}}
                ]}
                """);
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":115},{\"payout\":1400,\"remainingCap\":600},{\"payout\":600,\"remainingCap\":0}]}", result.out());
    }
    @Test void roundsFinalPayoutDownOnlyAtEnd() {
        Result result = run(claimScenario("{\"type\":\"sword\",\"enchantment\":9}",
                "{\"itemType\":\"sword\",\"amount\":901}"));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":145},{\"payout\":350,\"remainingCap\":1650}]}", result.out());
    }
    @Test void rejectsUnknownQuotedItem() {
        Result result = run("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"broomstick\"}]}]}");
        assertTrue(result.status() != 0);
        assertEquals("", result.out());
        assertFalse(result.err().isBlank());
    }
    @Test void rejectsDamageForUninsuredItem() {
        Result result = run(claimScenario("{\"type\":\"sword\"}",
                "{\"itemType\":\"amulet\",\"amount\":200}"));
        assertTrue(result.status() != 0);
        assertEquals("", result.out());
        assertFalse(result.err().isBlank());
    }
    @Test void rejectsUnknownDamagedItem() {
        Result result = run(claimScenario("{\"type\":\"sword\"}",
                "{\"itemType\":\"broomstick\",\"amount\":200}"));
        assertTrue(result.status() != 0);
        assertEquals("", result.out());
        assertFalse(result.err().isBlank());
    }
    @Test void rejectsNegativeDamage() {
        Result result = run(claimScenario("{\"type\":\"sword\"}",
                "{\"itemType\":\"sword\",\"amount\":-200}"));
        assertTrue(result.status() != 0);
        assertEquals("", result.out());
        assertFalse(result.err().isBlank());
    }
    @Test void usesStaffInsuranceValueForCap() {
        Result result = run(claimScenario("{\"type\":\"staff\"}", ""));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":93},{\"payout\":0,\"remainingCap\":1600}]}", result.out());
    }
    @Test void usesPotionInsuranceValueForCap() {
        Result result = run(claimScenario("{\"type\":\"potion\"}", ""));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":49},{\"payout\":0,\"remainingCap\":800}]}", result.out());
    }
    @Test void usesMoonstoneInsuranceValueForCap() {
        Result result = run(claimScenario("{\"type\":\"moonstone\"}", ""));
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":33},{\"payout\":0,\"remainingCap\":500}]}", result.out());
    }
    @Test void emitsNormativeJsonShapeInStepOrder() {
        Result result = run("""
                {"customer":{"yearsWithMHPCO":5},"steps":[
                  {"op":"quote","items":[{"type":"amulet","material":"silver","enchantment":2,"cursed":false}]},
                  {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}
                ]}
                """);
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}", result.out());
    }

    private static String claimScenario(String items, String damages) {
        return "{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[" + items + "]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"incident\",\"damages\":["
                + damages + "]}}]}";
    }

    private static void assertQuote(int years, String items, int expectedPremium) {
        Result result = run("{\"customer\":{\"yearsWithMHPCO\":" + years
                + "},\"steps\":[{\"op\":\"quote\",\"items\":[" + items + "]}]}");
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":" + expectedPremium + "}]}", result.out());
    }

    private static Result run(String input) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayOutputStream err = new ByteArrayOutputStream();
        int status = ClaimOfficeCli.run(
                new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)), out, err);
        return new Result(status, out.toString(StandardCharsets.UTF_8), err.toString(StandardCharsets.UTF_8));
    }

    private record Result(int status, String out, String err) {}
}
