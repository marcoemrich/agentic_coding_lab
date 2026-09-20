import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class ClaimOfficeCliTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    @Test void emptyQuoteCostsOnlyFiveGProcessingFee() throws Exception { assertQuote(5, "", 0); }
    @Test void quotesSwordCatalogueEntry() throws Exception { assertQuote(115, item("sword"), 0); }
    @Test void quotesAmuletCatalogueEntry() throws Exception { assertQuote(71, item("amulet"), 0); }
    @Test void quotesStaffCatalogueEntry() throws Exception { assertQuote(93, item("staff"), 0); }
    @Test void quotesPotionCatalogueEntry() throws Exception { assertQuote(49, item("potion"), 0); }
    @Test void quotesRuneCatalogueEntry() throws Exception { assertQuote(33, item("rune"), 0); }
    @Test void quotesMoonstoneCatalogueEntry() throws Exception { assertQuote(33, item("moonstone"), 0); }
    @Test void twoRunesDoNotFormBlock() throws Exception { assertQuote(60, items("rune", 2), 0); }
    @Test void threeRunesFormBlock() throws Exception { assertQuote(71, items("rune", 3), 0); }
    @Test void fourRunesDoNotFormBlock() throws Exception { assertQuote(115, items("rune", 4), 0); }
    @Test void sevenRunesHaveNoBlockAndRoundPremiumUp() throws Exception { assertQuote(198, items("rune", 7), 0); }
    @Test void mixedComponentsDoNotFormBlock() throws Exception { assertQuote(88, itemList("rune", "rune", "moonstone"), 0); }
    @Test void eachComponentTypeFormsItsOwnBlock() throws Exception { assertQuote(137, itemList("rune", "rune", "rune", "moonstone", "moonstone", "moonstone"), 0); }
    @Test void cursedSurchargeAppliesOnlyToAffectedItem() throws Exception { assertQuote(231, "{\"type\":\"sword\",\"cursed\":true}," + item("amulet"), 0); }
    @Test void loyaltyStartsAtExactlyTwoYears() throws Exception { assertQuote(95, item("sword"), 2); }
    @Test void enchantmentThresholdAndCurseBothApply() throws Exception { assertQuote(195, enchantedSword("steel", 5, true), 0); }
    @Test void belowEnchantmentThresholdOnlyCurseApplies() throws Exception { assertQuote(165, enchantedSword("steel", 4, true), 0); }
    @Test void newcomerCursedSwordIntegration() throws Exception { assertQuote(165, enchantedSword("steel", 3, true), 0); }
    @Test void followUpContractStacksAllPolicyAndItemModifiers() throws Exception { assertTwoQuotePremiums(95, 160); }
    @Test void claimEnchantmentThresholdWinsOverDragonMaterial() throws Exception { assertSingleClaim(enchantedSword("dragon", 8, false), "sword", 1000, 400, 1600); }
    @Test void deductibleAppliesPerDamageEntry() throws Exception { assertMultiClaim(); }
    @Test void standardItemDamageIsFullyReimbursedBeforeDeductible() throws Exception { assertSingleClaim(enchantedSword("steel", 3, false), "sword", 500, 400, 1600); }
    @Test void componentDamageUsesStandardReimbursement() throws Exception { assertSingleClaim(item("rune"), "rune", 200, 100, 400); }
    @Test void highEnchantmentRuleWinsWhenBothClaimClausesApply() throws Exception { assertSingleClaim(enchantedSword("dragon", 9, false), "sword", 1000, 400, 1600); }
    @Test void dragonMaterialGetsFullReimbursementBelowEight() throws Exception { assertSingleClaim(enchantedSword("dragon", 5, false), "sword", 800, 700, 1300); }
    @Test void highlyEnchantedNonDragonItemGetsHalfReimbursement() throws Exception { assertSingleClaim(enchantedSword("steel", 9, false), "sword", 1000, 400, 1600); }
    @Test void duplicateInsuredTypesEachIncreaseCap() throws Exception { assertClaim(items("sword", 2), "[]", 0, 4000); }
    @Test void duplicateInsuredTypesPermitSeparateDamages() throws Exception { assertClaim(items("sword", 2), "[{\"itemType\":\"sword\",\"amount\":500},{\"itemType\":\"sword\",\"amount\":500}]", 800, 3200); }
    @Test void rejectsExcessDamageEntriesAtomically() throws Exception { assertRejected(scenario(item("sword"), "[{\"itemType\":\"sword\",\"amount\":200},{\"itemType\":\"sword\",\"amount\":200}]")); }
    @Test void capSumsDifferentItemInsuranceValues() throws Exception { assertClaim(itemList("sword", "amulet"), "[]", 0, 3200); }
    @Test void premiumModifiersDoNotRaiseCap() throws Exception { assertClaim("{\"type\":\"sword\",\"cursed\":true}", "[]", 0, 2000); }
    @Test void componentBlockDiscountDoesNotReduceCap() throws Exception { assertClaim(item("sword") + "," + items("rune", 3), "[]", 0, 3500); }
    @Test void successiveClaimsShareAndExhaustPolicyCap() throws Exception { assertSuccessiveClaims(); }
    @Test void payoutRoundsDownOnlyAtFinalAmount() throws Exception { assertSingleClaim(enchantedSword("steel", 9, false), "sword", 901, 350, 1650); }
    @Test void rejectsUnknownQuoteItemAtomically() throws Exception { assertRejected(quoteScenario(item("broomstick"), 0)); }
    @Test void rejectsDamageToTypeAbsentFromPolicy() throws Exception { assertRejected(scenario(item("sword"), "[{\"itemType\":\"amulet\",\"amount\":200}]")); }
    @Test void rejectsUnknownDamageItemType() throws Exception { assertRejected(scenario(item("sword"), "[{\"itemType\":\"broomstick\",\"amount\":200}]")); }
    @Test void rejectsNegativeDamageAmount() throws Exception { assertRejected(scenario(item("sword"), "[{\"itemType\":\"sword\",\"amount\":-200}]")); }

    private static void assertQuote(int expected, String items, int years) throws Exception {
        Execution result = execute(quoteScenario(items, years));
        assertEquals(0, result.status());
        assertEquals(expected, JSON.readTree(result.out()).at("/results/0/premium").asInt());
    }

    private static void assertTwoQuotePremiums(int first, int second) throws Exception {
        String input = "{\"customer\":{\"yearsWithMHPCO\":3},\"steps\":[{\"op\":\"quote\",\"items\":[" + item("sword") + "]},{\"op\":\"quote\",\"items\":[" + enchantedSword("steel", 7, true) + "]}]}";
        JsonNode results = JSON.readTree(execute(input).out()).get("results");
        assertEquals(first, results.get(0).get("premium").asInt());
        assertEquals(second, results.get(1).get("premium").asInt());
    }

    private static void assertSingleClaim(String insured, String type, int amount, int payout, int cap) throws Exception {
        assertClaim(insured, "[{\"itemType\":\"" + type + "\",\"amount\":" + amount + "}]", payout, cap);
    }

    private static void assertClaim(String insured, String damages, int payout, int cap) throws Exception {
        Execution result = execute(scenario(insured, damages));
        JsonNode claim = JSON.readTree(result.out()).at("/results/1");
        assertEquals(0, result.status());
        assertEquals(payout, claim.get("payout").asInt());
        assertEquals(cap, claim.get("remainingCap").asInt());
    }

    private static void assertMultiClaim() throws Exception {
        assertClaim(itemList("sword", "amulet"), "[{\"itemType\":\"sword\",\"amount\":500},{\"itemType\":\"amulet\",\"amount\":300}]", 600, 2600);
    }

    private static void assertSuccessiveClaims() throws Exception {
        String damage = "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"battle\",\"damages\":[{\"itemType\":\"sword\",\"amount\":1500}]}}";
        String input = "{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":[{\"op\":\"quote\",\"items\":[" + item("sword") + "]}," + damage + "," + damage + "]}";
        JsonNode results = JSON.readTree(execute(input).out()).get("results");
        assertEquals(1400, results.get(1).get("payout").asInt());
        assertEquals(600, results.get(1).get("remainingCap").asInt());
        assertEquals(600, results.get(2).get("payout").asInt());
        assertEquals(0, results.get(2).get("remainingCap").asInt());
    }

    private static void assertRejected(String input) throws Exception {
        Execution result = execute(input);
        assertFalse(result.status() == 0);
        assertFalse(result.err().isBlank());
        assertEquals("", result.out());
    }

    private static Execution execute(String input) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayOutputStream err = new ByteArrayOutputStream();
        Class<?> cli = Class.forName("ClaimOfficeCli");
        Method run = cli.getMethod("run", java.io.InputStream.class, java.io.OutputStream.class, PrintStream.class);
        int status = (Integer) run.invoke(null, new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)), out, new PrintStream(err, true, StandardCharsets.UTF_8));
        return new Execution(status, out.toString(StandardCharsets.UTF_8), err.toString(StandardCharsets.UTF_8));
    }

    private static String quoteScenario(String items, int years) { return "{\"customer\":{\"yearsWithMHPCO\":" + years + "},\"steps\":[{\"op\":\"quote\",\"items\":[" + items + "]}]}"; }
    private static String scenario(String insured, String damages) { return "{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":[{\"op\":\"quote\",\"items\":[" + insured + "]},{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"test\",\"damages\":" + damages + "}}]}"; }
    private static String item(String type) { return "{\"type\":\"" + type + "\"}"; }
    private static String enchantedSword(String material, int enchantment, boolean cursed) { return "{\"type\":\"sword\",\"material\":\"" + material + "\",\"enchantment\":" + enchantment + ",\"cursed\":" + cursed + "}"; }
    private static String items(String type, int count) { return java.util.stream.IntStream.range(0, count).mapToObj(i -> item(type)).collect(java.util.stream.Collectors.joining(",")); }
    private static String itemList(String... types) { return java.util.Arrays.stream(types).map(ClaimOfficeCliTest::item).collect(java.util.stream.Collectors.joining(",")); }
    private record Execution(int status, String out, String err) { }
}
