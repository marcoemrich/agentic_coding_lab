import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ClaimOfficeCliTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    @Test void emptyQuoteCostsFiveG() { assertEquals(5, quote(0)); }
    @Test void swordPriceListEntry() { assertQuoteAndCap(0, 115, 2000, item("sword")); }
    @Test void amuletPriceListEntry() { assertQuoteAndCap(0, 71, 1200, item("amulet")); }
    @Test void staffPriceListEntry() { assertQuoteAndCap(0, 93, 1600, item("staff")); }
    @Test void potionPriceListEntry() { assertQuoteAndCap(0, 49, 800, item("potion")); }
    @Test void runePriceListEntry() { assertQuoteAndCap(0, 33, 500, item("rune")); }
    @Test void moonstonePriceListEntry() { assertQuoteAndCap(0, 33, 500, item("moonstone")); }
    @Test void twoRunesDoNotFormBlock() { assertEquals(60, quote(0, item("rune"), item("rune"))); }
    @Test void threeRunesFormBlock() { assertEquals(71, quote(0, item("rune"), item("rune"), item("rune"))); }
    @Test void fourRunesDoNotFormBlock() { assertEquals(115, quote(0, repeat("rune", 4))); }
    @Test void sevenRunesDoNotFormBlock() { assertEquals(198, quote(0, repeat("rune", 7))); }
    @Test void mixedComponentsDoNotFormBlock() { assertEquals(88, quote(0, item("rune"), item("rune"), item("moonstone"))); }
    @Test void separateComponentTypesFormSeparateBlocks() { assertEquals(137, quote(0, concat(repeat("rune", 3), repeat("moonstone", 3)))); }
    @Test void itemModifiersApplyOnlyToAffectedItem() { assertEquals(231, quote(0, item("sword", "steel", 3, true), item("amulet"))); }
    @Test void loyaltyStartsAtTwoYears() { assertEquals(95, quote(2, item("sword"))); }
    @Test void enchantmentThresholdAndCurseCombine() { assertEquals(195, quote(0, item("sword", "steel", 5, true))); }
    @Test void belowEnchantmentThresholdOnlyCurseApplies() { assertEquals(165, quote(0, item("sword", "steel", 4, true))); }
    @Test void newcomerCursedSwordIntegration() { assertEquals(165, quote(0, item("sword", "steel", 3, true))); }
    @Test void followUpContractIntegration() {
        JsonNode result = process("{\"customer\":{\"yearsWithMHPCO\":3},\"steps\":[{\"op\":\"quote\",\"items\":[]},{\"op\":\"quote\",\"items\":[" + item("sword", "steel", 7, true) + "]}]}");
        assertEquals(160, result.at("/results/1/premium").asInt());
    }
    @Test void enchantmentEightOverridesDragonMaterial() { assertClaim(400, 1600, item("sword", "dragon", 8, false), damage("sword", 1000)); }
    @Test void regularItemGetsFullReimbursementLessDeductible() { assertClaim(400, 1600, item("sword", "steel", 3, false), damage("sword", 500)); }
    @Test void componentGetsStandardReimbursement() { assertClaim(100, 400, item("rune"), damage("rune", 200)); }
    @Test void highEnchantmentWinsOverDragonMaterial() { assertClaim(400, 1600, item("sword", "dragon", 9, false), damage("sword", 1000)); }
    @Test void dragonMaterialGetsFullReimbursement() { assertClaim(700, 1300, item("sword", "dragon", 5, false), damage("sword", 800)); }
    @Test void highEnchantmentHalvesNonDragonDamage() { assertClaim(400, 1600, item("sword", "steel", 9, false), damage("sword", 1000)); }
    @Test void deductibleAppliesPerDamageEntry() { assertClaim(600, 2600, new String[]{item("sword"), item("amulet")}, new String[]{damage("sword", 500), damage("amulet", 300)}); }
    @Test void repeatedItemTypesIncreaseInsuranceSum() { assertClaim(0, 4000, repeat("sword", 2), new String[]{}); }
    @Test void repeatedInsuredItemsMayEachBeDamaged() { assertClaim(800, 3200, repeat("sword", 2), new String[]{damage("sword", 500), damage("sword", 500)}); }
    @Test void excessDamageMultiplicityIsRejected() { assertRejected(claimScenario(new String[]{item("sword")}, new String[]{damage("sword", 500), damage("sword", 500)})); }
    @Test void mixedPolicyCapUsesInsuranceValues() { assertClaim(0, 3200, new String[]{item("sword"), item("amulet")}, new String[]{}); }
    @Test void capIgnoresPremiumModifiers() { assertClaim(0, 2000, new String[]{item("sword", "steel", 3, true)}, new String[]{}); }
    @Test void capIgnoresComponentBlockDiscount() { assertClaim(0, 3500, concat(new String[]{item("sword")}, repeat("rune", 3)), new String[]{}); }
    @Test void successiveClaimsConsumePolicyCap() {
        String scenario = "{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":[{\"op\":\"quote\",\"items\":[" + item("sword") + "]}," + claimStep(damage("sword", 1500)) + "," + claimStep(damage("sword", 1500)) + "]}";
        JsonNode result = process(scenario);
        assertEquals(1400, result.at("/results/1/payout").asInt());
        assertEquals(600, result.at("/results/1/remainingCap").asInt());
        assertEquals(600, result.at("/results/2/payout").asInt());
        assertEquals(0, result.at("/results/2/remainingCap").asInt());
    }
    @Test void premiumRoundsUpAtEnd() { assertEquals(198, quote(0, repeat("rune", 7))); }
    @Test void payoutRoundsDownAtEnd() { assertClaim(350, 1650, item("sword", "steel", 8, false), damage("sword", 901)); }
    @Test void unknownQuoteItemIsRejected() { assertRejected("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"broomstick\"}]}]}"); }
    @Test void uninsuredDamageTypeIsRejected() { assertRejected(claimScenario(new String[]{item("sword")}, new String[]{damage("amulet", 200)})); }
    @Test void unknownDamageTypeIsRejected() { assertRejected(claimScenario(new String[]{item("sword")}, new String[]{damage("broomstick", 200)})); }
    @Test void negativeDamageIsRejected() { assertRejected(claimScenario(new String[]{item("sword")}, new String[]{damage("sword", -200)})); }

    private static int quote(int years, String... items) {
        String scenario = "{\"customer\":{\"yearsWithMHPCO\":" + years + "},\"steps\":[{\"op\":\"quote\",\"items\":[" + String.join(",", items) + "]}]}";
        return process(scenario).at("/results/0/premium").asInt();
    }

    private static void assertQuoteAndCap(int years, int premium, int cap, String item) {
        String scenario = "{\"customer\":{\"yearsWithMHPCO\":" + years + "},\"steps\":[{\"op\":\"quote\",\"items\":[" + item + "]}," + claimStep() + "]}";
        JsonNode result = process(scenario);
        assertEquals(premium, result.at("/results/0/premium").asInt());
        assertEquals(cap, result.at("/results/1/remainingCap").asInt());
    }

    private static void assertClaim(int payout, int cap, String item, String damage) { assertClaim(payout, cap, new String[]{item}, new String[]{damage}); }
    private static void assertClaim(int payout, int cap, String[] items, String[] damages) {
        JsonNode result = process(claimScenario(items, damages));
        assertEquals(payout, result.at("/results/1/payout").asInt());
        assertEquals(cap, result.at("/results/1/remainingCap").asInt());
    }

    private static String claimScenario(String[] items, String[] damages) {
        return "{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":[{\"op\":\"quote\",\"items\":[" + String.join(",", items) + "]}," + claimStep(damages) + "]}";
    }

    private static String claimStep(String... damages) { return "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"test\",\"damages\":[" + String.join(",", damages) + "]}}"; }
    private static String item(String type) { return item(type, "", 0, false); }
    private static String item(String type, String material, int enchantment, boolean cursed) { return "{\"type\":\"" + type + "\",\"material\":\"" + material + "\",\"enchantment\":" + enchantment + ",\"cursed\":" + cursed + "}"; }
    private static String damage(String type, int amount) { return "{\"itemType\":\"" + type + "\",\"amount\":" + amount + "}"; }
    private static String[] repeat(String type, int count) { String[] values = new String[count]; for (int i = 0; i < count; i++) values[i] = item(type); return values; }
    private static String[] concat(String[] first, String[] second) { String[] result = new String[first.length + second.length]; System.arraycopy(first, 0, result, 0, first.length); System.arraycopy(second, 0, result, first.length, second.length); return result; }

    private static JsonNode process(String scenario) {
        try { return JSON.readTree(ClaimOfficeCli.process(scenario)); } catch (Exception exception) { throw new AssertionError(exception); }
    }

    private static void assertRejected(String scenario) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        ByteArrayOutputStream error = new ByteArrayOutputStream();
        int status = ClaimOfficeCli.run(new ByteArrayInputStream(scenario.getBytes(StandardCharsets.UTF_8)), new PrintStream(output), new PrintStream(error));
        assertTrue(status != 0);
        assertEquals("", output.toString(StandardCharsets.UTF_8));
        assertFalse(error.toString(StandardCharsets.UTF_8).isBlank());
    }
}
