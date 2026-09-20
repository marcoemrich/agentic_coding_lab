import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class ClaimOfficeCliTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    @Test void quotesEmptyPolicyAtProcessingFeeOnly() throws Exception {
        Invocation result = invoke("""
                {"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]}]}
                """);
        assertEquals(0, result.status());
        assertEquals(5, result.output().at("/results/0/premium").asInt());
    }
    @Test void quotesSwordPriceListEntry() throws Exception {
        assertEquals(115, quote(0, "{\"type\":\"sword\"}"));
    }
    @Test void quotesAmuletPriceListEntry() throws Exception {
        assertEquals(71, quote(0, "{\"type\":\"amulet\"}"));
    }
    @Test void quotesStaffPriceListEntry() throws Exception {
        assertEquals(93, quote(0, "{\"type\":\"staff\"}"));
    }
    @Test void quotesPotionPriceListEntry() throws Exception {
        assertEquals(49, quote(0, "{\"type\":\"potion\"}"));
    }
    @Test void quotesTwoComponentsWithoutBlock() throws Exception {
        assertEquals(60, quote(0, "{\"type\":\"rune\"}", "{\"type\":\"rune\"}"));
    }
    @Test void quotesExactlyThreeAlikeComponentsAsBlock() throws Exception {
        assertEquals(71, quote(0, "{\"type\":\"rune\"}", "{\"type\":\"rune\"}",
                "{\"type\":\"rune\"}"));
    }
    @Test void quotesFourComponentsWithoutBlock() throws Exception {
        assertEquals(115, quote(0, "{\"type\":\"rune\"}", "{\"type\":\"rune\"}",
                "{\"type\":\"rune\"}", "{\"type\":\"rune\"}"));
    }
    @Test void quotesSevenComponentsWithoutPartialBlocks() throws Exception {
        String rune = "{\"type\":\"rune\"}";
        assertEquals(198, quote(0, rune, rune, rune, rune, rune, rune, rune));
    }
    @Test void doesNotBlockUnlikeComponents() throws Exception {
        assertEquals(88, quote(0, "{\"type\":\"rune\"}", "{\"type\":\"rune\"}",
                "{\"type\":\"moonstone\"}"));
    }
    @Test void blocksEachComponentTypeSeparately() throws Exception {
        String rune = "{\"type\":\"rune\"}";
        String moonstone = "{\"type\":\"moonstone\"}";
        assertEquals(137, quote(0, rune, rune, rune, moonstone, moonstone, moonstone));
    }
    @Test void scopesCurseSurchargeToAffectedItem() throws Exception {
        assertEquals(231, quote(0, "{\"type\":\"sword\",\"cursed\":true}",
                "{\"type\":\"amulet\",\"cursed\":false}"));
    }
    @Test void appliesLoyaltyAtTwoYears() throws Exception {
        assertEquals(95, quote(2, "{\"type\":\"sword\"}"));
    }
    @Test void appliesHighEnchantmentAtThresholdAndStacksCurse() throws Exception {
        assertEquals(195, quote(0,
                "{\"type\":\"sword\",\"enchantment\":5,\"cursed\":true}"));
    }
    @Test void excludesBelowThresholdEnchantment() throws Exception {
        assertEquals(165, quote(0,
                "{\"type\":\"sword\",\"enchantment\":4,\"cursed\":true}"));
    }
    @Test void quotesNewcomerCursedSword() throws Exception {
        assertEquals(165, quote(0,
                "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":true}"));
    }
    @Test void quotesLongStandingCustomersSecondContract() throws Exception {
        Invocation result = invoke("""
                {"customer":{"yearsWithMHPCO":3},"steps":[
                  {"op":"quote","items":[{"type":"potion"}]},
                  {"op":"quote","items":[{"type":"sword","material":"steel","enchantment":7,"cursed":true}]}
                ]}
                """);
        assertEquals(0, result.status());
        assertEquals(160, result.output().at("/results/1/premium").asInt());
    }
    @Test void reimbursesRegularItemMinusDeductible() throws Exception {
        Invocation result = claim("{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3}",
                "{\"itemType\":\"sword\",\"amount\":500}");
        assertEquals(400, result.output().at("/results/1/payout").asInt());
        assertEquals(1600, result.output().at("/results/1/remainingCap").asInt());
    }
    @Test void reimbursesComponentWithoutSpecialClauses() throws Exception {
        Invocation result = claim("{\"type\":\"rune\"}",
                "{\"itemType\":\"rune\",\"amount\":200}");
        assertEquals(100, result.output().at("/results/1/payout").asInt());
        assertEquals(400, result.output().at("/results/1/remainingCap").asInt());
    }
    @Test void enchantmentThresholdOverridesDragonMaterial() throws Exception {
        Invocation result = claim("{\"type\":\"sword\",\"material\":\"dragon\",\"enchantment\":8}",
                "{\"itemType\":\"sword\",\"amount\":1000}");
        assertEquals(400, result.output().at("/results/1/payout").asInt());
    }
    @Test void highEnchantmentWinsWhenBothClausesApply() throws Exception {
        Invocation result = claim("{\"type\":\"sword\",\"material\":\"dragon\",\"enchantment\":9}",
                "{\"itemType\":\"sword\",\"amount\":1000}");
        assertEquals(400, result.output().at("/results/1/payout").asInt());
    }
    @Test void fullyReimbursesDragonMaterialBelowHighThreshold() throws Exception {
        Invocation result = claim("{\"type\":\"sword\",\"material\":\"dragon\",\"enchantment\":5}",
                "{\"itemType\":\"sword\",\"amount\":800}");
        assertEquals(700, result.output().at("/results/1/payout").asInt());
    }
    @Test void halvesHighEnchantmentDamage() throws Exception {
        Invocation result = claim("{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":9}",
                "{\"itemType\":\"sword\",\"amount\":1000}");
        assertEquals(400, result.output().at("/results/1/payout").asInt());
    }
    @Test void appliesDeductiblePerDamageEntry() throws Exception {
        Invocation result = invoke("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"},{"type":"amulet"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"dragon attack","damages":[
                    {"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}]}}
                ]}
                """);
        assertEquals(600, result.output().at("/results/1/payout").asInt());
    }
    @Test void countsDuplicateItemsInPolicyCap() throws Exception {
        Invocation result = invoke("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"},{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"inspection","damages":[]}}
                ]}
                """);
        assertEquals(4000, result.output().at("/results/1/remainingCap").asInt());
    }
    @Test void treatsDuplicateDamageEntriesSeparately() throws Exception {
        Invocation result = invoke("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"},{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"dragon attack","damages":[
                    {"itemType":"sword","amount":500},{"itemType":"sword","amount":500}]}}
                ]}
                """);
        assertEquals(800, result.output().at("/results/1/payout").asInt());
        assertEquals(3200, result.output().at("/results/1/remainingCap").asInt());
    }
    @Test void rejectsExcessDamageMultiplicity() throws Exception {
        Invocation result = claim("{\"type\":\"sword\"}",
                "{\"itemType\":\"sword\",\"amount\":500}",
                "{\"itemType\":\"sword\",\"amount\":500}");
        assertRejected(result);
    }
    @Test void sumsDifferentItemValuesForCap() throws Exception {
        Invocation result = invoke("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"},{"type":"amulet"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"inspection","damages":[]}}
                ]}
                """);
        assertEquals(3200, result.output().at("/results/1/remainingCap").asInt());
    }
    @Test void basesCapOnUnmodifiedInsuranceValue() throws Exception {
        Invocation result = claim("{\"type\":\"sword\",\"cursed\":true}");
        assertEquals(2000, result.output().at("/results/1/remainingCap").asInt());
    }
    @Test void blockDiscountDoesNotReduceInsuranceSum() throws Exception {
        Invocation result = invoke("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"inspection","damages":[]}}
                ]}
                """);
        assertEquals(3500, result.output().at("/results/1/remainingCap").asInt());
    }
    @Test void exhaustsCapAcrossSuccessiveClaims() throws Exception {
        Invocation result = invoke("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"first","damages":[{"itemType":"sword","amount":1500}]}},
                  {"op":"claim","policy":0,"incident":{"cause":"second","damages":[{"itemType":"sword","amount":1500}]}}
                ]}
                """);
        assertEquals(1400, result.output().at("/results/1/payout").asInt());
        assertEquals(600, result.output().at("/results/1/remainingCap").asInt());
        assertEquals(600, result.output().at("/results/2/payout").asInt());
        assertEquals(0, result.output().at("/results/2/remainingCap").asInt());
    }
    @Test void roundsPayoutDownInOfficeFavor() throws Exception {
        Invocation result = claim("{\"type\":\"sword\",\"enchantment\":8}",
                "{\"itemType\":\"sword\",\"amount\":901}");
        assertEquals(350, result.output().at("/results/1/payout").asInt());

        Invocation accumulatedFractions = invoke("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword","enchantment":8},{"type":"sword","enchantment":8}]},
                  {"op":"claim","policy":0,"incident":{"cause":"paired","damages":[
                    {"itemType":"sword","amount":201},{"itemType":"sword","amount":201}]}}
                ]}
                """);
        assertEquals(1, accumulatedFractions.output().at("/results/1/payout").asInt());
    }
    @Test void rejectsUnknownQuotedItem() throws Exception {
        Invocation result = invoke("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"broomstick"}]}
                ]}
                """);
        assertRejected(result);
    }
    @Test void rejectsDamageToUninsuredItem() throws Exception {
        Invocation result = claim("{\"type\":\"sword\"}",
                "{\"itemType\":\"amulet\",\"amount\":200}");
        assertRejected(result);
    }
    @Test void rejectsUnknownDamageType() throws Exception {
        Invocation result = claim("{\"type\":\"sword\"}",
                "{\"itemType\":\"broomstick\",\"amount\":200}");
        assertRejected(result);
    }
    @Test void rejectsNegativeDamage() throws Exception {
        Invocation result = claim("{\"type\":\"sword\"}",
                "{\"itemType\":\"sword\",\"amount\":-200}");
        assertRejected(result);
    }
    @Test void emitsNormativeResultShapeInStepOrder() throws Exception {
        Invocation result = invoke("""
                {"customer":{"yearsWithMHPCO":5},"steps":[
                  {"op":"quote","items":[{"type":"amulet","material":"silver","enchantment":2,"cursed":false}]},
                  {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[{"itemType":"amulet","amount":200}]}}
                ]}
                """);
        JsonNode results = result.output().path("results");
        assertEquals(2, results.size());
        assertEquals(1, results.get(0).size());
        assertTrue(results.get(0).has("premium"));
        assertEquals(2, results.get(1).size());
        assertTrue(results.get(1).has("payout"));
        assertTrue(results.get(1).has("remainingCap"));
    }

    private static Invocation claim(String item, String... damages) throws Exception {
        return invoke("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[" + item + "]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"incident\",\"damages\":["
                + String.join(",", damages) + "]}}]}");
    }

    private static int quote(int years, String... items) throws Exception {
        String input = "{\"customer\":{\"yearsWithMHPCO\":" + years
                + "},\"steps\":[{\"op\":\"quote\",\"items\":[" + String.join(",", items) + "]}]}";
        Invocation result = invoke(input);
        assertEquals(0, result.status());
        return result.output().at("/results/0/premium").asInt();
    }

    private static void assertRejected(Invocation result) {
        assertTrue(result.status() != 0);
        assertTrue(result.stdout().isEmpty());
        assertTrue(!result.error().isBlank());
    }

    private static Invocation invoke(String input) throws Exception {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        ByteArrayOutputStream error = new ByteArrayOutputStream();
        int status = ClaimOfficeCli.execute(
                new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)), output, error);
        String stdout = output.toString(StandardCharsets.UTF_8);
        return new Invocation(status, stdout.isEmpty() ? JSON.createObjectNode() : JSON.readTree(stdout), stdout,
                error.toString(StandardCharsets.UTF_8));
    }

    private record Invocation(int status, JsonNode output, String stdout, String error) { }
}
