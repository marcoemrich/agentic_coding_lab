import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ClaimOfficeTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    private JsonNode run(String scenario) throws Exception {
        return JSON.readTree(ClaimOffice.process(scenario));
    }

    private int premium(int years, String items) throws Exception {
        return run("{\"customer\":{\"yearsWithMHPCO\":" + years
                + "},\"steps\":[{\"op\":\"quote\",\"items\":" + items + "}]}")
                .at("/results/0/premium").asInt();
    }

    private JsonNode claim(String item, String damage) throws Exception {
        return run("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[" + item + "]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"test\",\"damages\":["
                + damage + "]}}]}").at("/results/1");
    }

    @Test
    void emptyQuoteCostsFive() throws Exception { assertEquals(5, premium(0, "[]")); }

    @Test
    void mainItemPriceList() throws Exception {
        assertAll(() -> assertEquals(115, premium(0, "[{\"type\":\"sword\"}]")),
                () -> assertEquals(71, premium(0, "[{\"type\":\"amulet\"}]")),
                () -> assertEquals(93, premium(0, "[{\"type\":\"staff\"}]")),
                () -> assertEquals(49, premium(0, "[{\"type\":\"potion\"}]")));
    }

    @Test void twoComponents() throws Exception { assertEquals(60, premium(0, "[{\"type\":\"rune\"},{\"type\":\"rune\"}]")); }
    @Test void threeComponentBlock() throws Exception { assertEquals(71, premium(0, "[{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}]")); }
    @Test void fourComponentsNoBlock() throws Exception { assertEquals(115, premium(0, "[{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}]")); }
    @Test void sevenComponentsNoBlock() throws Exception { assertEquals(198, premium(0, "[{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}]")); }
    @Test void unlikeComponentsDoNotBlock() throws Exception { assertEquals(88, premium(0, "[{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"moonstone\"}]")); }
    @Test void separateComponentBlocks() throws Exception { assertEquals(137, premium(0, "[{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"moonstone\"},{\"type\":\"moonstone\"},{\"type\":\"moonstone\"}]")); }

    @Test
    void itemModifierScope() throws Exception { assertEquals(231, premium(0, "[{\"type\":\"sword\",\"cursed\":true},{\"type\":\"amulet\",\"cursed\":false}]")); }
    @Test void loyaltyThreshold() throws Exception { assertEquals(95, premium(2, "[{\"type\":\"sword\"}]")); }
    @Test void enchantmentThresholdAndCurse() throws Exception { assertEquals(175, premium(2, "[{\"type\":\"sword\",\"enchantment\":5,\"cursed\":true}]")); }
    @Test void belowEnchantmentThreshold() throws Exception { assertEquals(145, premium(2, "[{\"type\":\"sword\",\"enchantment\":4,\"cursed\":true}]")); }
    @Test void newcomerCursedSword() throws Exception { assertEquals(165, premium(0, "[{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":true}]")); }
    @Test
    void followUpContract() throws Exception {
        JsonNode output = run("{\"customer\":{\"yearsWithMHPCO\":3},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[]},{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":7,\"cursed\":true}]}]}");
        assertEquals(160, output.at("/results/1/premium").asInt());
    }

    @Test void exactClaimThreshold() throws Exception { assertEquals(400, claim("{\"type\":\"sword\",\"material\":\"dragon\",\"enchantment\":8}", "{\"itemType\":\"sword\",\"amount\":1000}").get("payout").asInt()); }
    @Test void standardItemReimbursement() throws Exception { assertEquals(400, claim("{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3}", "{\"itemType\":\"sword\",\"amount\":500}").get("payout").asInt()); }
    @Test void componentReimbursement() throws Exception { assertEquals(100, claim("{\"type\":\"rune\"}", "{\"itemType\":\"rune\",\"amount\":200}").get("payout").asInt()); }
    @Test void dragonAndHighEnchantment() throws Exception { assertEquals(400, claim("{\"type\":\"sword\",\"material\":\"dragon\",\"enchantment\":9}", "{\"itemType\":\"sword\",\"amount\":1000}").get("payout").asInt()); }
    @Test void dragonOnlyClause() throws Exception { assertEquals(700, claim("{\"type\":\"sword\",\"material\":\"dragon\",\"enchantment\":5}", "{\"itemType\":\"sword\",\"amount\":800}").get("payout").asInt()); }
    @Test void highEnchantmentOnlyClause() throws Exception { assertEquals(400, claim("{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":9}", "{\"itemType\":\"sword\",\"amount\":1000}").get("payout").asInt()); }
    @Test
    void deductiblePerDamageEntry() throws Exception {
        JsonNode result = run("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"dragon\"},{\"type\":\"amulet\",\"material\":\"dragon\"}]},{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon attack\",\"damages\":[{\"itemType\":\"sword\",\"amount\":500},{\"itemType\":\"amulet\",\"amount\":300}]}}]}");
        assertEquals(600, result.at("/results/1/payout").asInt());
    }
    @Test
    void duplicateItemsAndDamages() throws Exception {
        JsonNode result = run("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"sword\"},{\"type\":\"sword\"}]},{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"attack\",\"damages\":[{\"itemType\":\"sword\",\"amount\":500},{\"itemType\":\"sword\",\"amount\":500}]}}]}");
        assertEquals(800, result.at("/results/1/payout").asInt()); assertEquals(3200, result.at("/results/1/remainingCap").asInt());
    }
    @Test void rejectsExcessDamageEntries() { assertThrows(IllegalArgumentException.class, () -> run("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"sword\"}]},{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"attack\",\"damages\":[{\"itemType\":\"sword\",\"amount\":200},{\"itemType\":\"sword\",\"amount\":200}]}}]}")); }

    @Test void sumDefinesCap() throws Exception { assertEquals(3200, claim("{\"type\":\"sword\"},{\"type\":\"amulet\"}", "").get("remainingCap").asInt()); }
    @Test void modifiersDoNotRaiseCap() throws Exception { assertEquals(2000, claim("{\"type\":\"sword\",\"cursed\":true}", "").get("remainingCap").asInt()); }
    @Test void blockDoesNotLowerInsuranceSum() throws Exception { assertEquals(3500, claim("{\"type\":\"sword\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}", "").get("remainingCap").asInt()); }
    @Test
    void capExhaustionAcrossClaims() throws Exception {
        JsonNode result = run("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"sword\"}]},{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"one\",\"damages\":[{\"itemType\":\"sword\",\"amount\":1500}]}},{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"two\",\"damages\":[{\"itemType\":\"sword\",\"amount\":1500}]}}]}");
        assertAll(() -> assertEquals(1400, result.at("/results/1/payout").asInt()), () -> assertEquals(600, result.at("/results/1/remainingCap").asInt()), () -> assertEquals(600, result.at("/results/2/payout").asInt()), () -> assertEquals(0, result.at("/results/2/remainingCap").asInt()));
    }
    @Test void premiumRoundsUpAtEnd() throws Exception {
        JsonNode result = run("{\"customer\":{\"yearsWithMHPCO\":3},\"steps\":[{\"op\":\"quote\",\"items\":[]},{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"enchantment\":5,\"cursed\":true},{\"type\":\"rune\"},{\"type\":\"rune\"}]}]}");
        assertEquals(198, result.at("/results/1/premium").asInt());
    }
    @Test void payoutRoundsDownAtEnd() throws Exception { assertEquals(350, claim("{\"type\":\"sword\",\"enchantment\":9}", "{\"itemType\":\"sword\",\"amount\":901}").get("payout").asInt()); }

    @Test void rejectsUnknownQuoteItem() { assertThrows(IllegalArgumentException.class, () -> premium(0, "[{\"type\":\"broomstick\"}]")); }
    @Test void rejectsUninsuredDamage() { assertThrows(IllegalArgumentException.class, () -> claim("{\"type\":\"sword\"}", "{\"itemType\":\"amulet\",\"amount\":200}")); }
    @Test void rejectsNegativeDamage() { assertThrows(IllegalArgumentException.class, () -> claim("{\"type\":\"sword\"}", "{\"itemType\":\"sword\",\"amount\":-200}")); }
    @Test
    void cliErrorContract() throws Exception {
        var input = new java.io.ByteArrayInputStream("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"broomstick\"}]}]}".getBytes(java.nio.charset.StandardCharsets.UTF_8));
        var stdout = new java.io.ByteArrayOutputStream(); var stderr = new java.io.ByteArrayOutputStream();
        int status = (int) Class.forName("ClaimOfficeCli").getMethod("execute", java.io.InputStream.class, java.io.PrintStream.class, java.io.PrintStream.class).invoke(null, input, new java.io.PrintStream(stdout), new java.io.PrintStream(stderr));
        assertAll(() -> assertNotEquals(0, status), () -> assertEquals("", stdout.toString()), () -> assertFalse(stderr.toString().isBlank()));
    }
}
