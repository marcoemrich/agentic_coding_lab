import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class ClaimOfficeCliTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    @Test
    void emptyQuoteCostsOnlyProcessingFee() throws Exception { assertPremium(scenario(0, quote("")), 0, 5); }

    @Test
    void swordCataloguePremium() throws Exception { assertPremium(scenario(0, quote(item("sword"))), 0, 115); }

    @Test
    void amuletCataloguePremium() throws Exception { assertPremium(scenario(0, quote(item("amulet"))), 0, 71); }

    @Test
    void staffCataloguePremium() throws Exception { assertPremium(scenario(0, quote(item("staff"))), 0, 93); }

    @Test
    void potionCataloguePremium() throws Exception { assertPremium(scenario(0, quote(item("potion"))), 0, 49); }

    @Test
    void twoRunesDoNotFormBlock() throws Exception { assertPremium(scenario(0, quote(items("rune", 2))), 0, 60); }

    @Test
    void threeRunesFormBlock() throws Exception { assertPremium(scenario(0, quote(items("rune", 3))), 0, 71); }

    @Test
    void fourRunesDoNotFormBlock() throws Exception { assertPremium(scenario(0, quote(items("rune", 4))), 0, 115); }

    @Test
    void sevenRunesAndPremiumRounding() throws Exception { assertPremium(scenario(0, quote(items("rune", 7))), 0, 198); }

    @Test
    void unlikeComponentsDoNotFormBlock() throws Exception { assertPremium(scenario(0, quote(items("rune", 2) + "," + item("moonstone"))), 0, 88); }

    @Test
    void alikeTypesFormSeparateBlocks() throws Exception { assertPremium(scenario(0, quote(items("rune", 3) + "," + items("moonstone", 3))), 0, 137); }

    @Test
    void itemModifierIsScopedToAffectedItem() throws Exception { assertPremium(scenario(0, quote(cursed("sword", 3) + "," + item("amulet"))), 0, 231); }

    @Test
    void loyaltyThresholdIncludesTwoYears() throws Exception { assertPremium(scenario(2, quote(item("sword"))), 0, 95); }

    @Test
    void enchantmentThresholdAndCurseStack() throws Exception { assertPremium(scenario(0, quote(cursed("sword", 5))), 0, 195); }

    @Test
    void belowEnchantmentThresholdOnlyCurseApplies() throws Exception { assertPremium(scenario(0, quote(cursed("sword", 4))), 0, 165); }

    @Test
    void newcomerCursedSwordIntegration() throws Exception { assertPremium(scenario(0, quote(cursed("sword", 3))), 0, 165); }

    @Test
    void followUpContractIntegration() throws Exception {
        assertPremium(scenario(3, quote(item("amulet")) + "," + quote(cursed("sword", 7))), 1, 160);
    }

    @Test
    void standardSwordReimbursement() throws Exception { assertClaim(singleClaim(enchanted("sword", "steel", 3), 500), 400, 1600); }

    @Test
    void componentGetsStandardReimbursement() throws Exception { assertClaim(singleClaim(item("rune"), 200), 100, 400); }

    @Test
    void enchantmentEightOverridesDragonMaterial() throws Exception { assertClaim(singleClaim(enchanted("sword", "dragon", 8), 1000), 400, 1600); }

    @Test
    void highEnchantmentWinsWhenBothClausesApply() throws Exception { assertClaim(singleClaim(enchanted("sword", "dragon", 9), 1000), 400, 1600); }

    @Test
    void dragonMaterialGetsFullReimbursement() throws Exception { assertClaim(singleClaim(enchanted("sword", "dragon", 5), 800), 700, 1300); }

    @Test
    void highEnchantmentHalvesNonDragonDamage() throws Exception { assertClaim(singleClaim(enchanted("sword", "steel", 9), 1000), 400, 1600); }

    @Test
    void deductibleAppliesPerDamagedItem() throws Exception {
        String steps = quote(item("sword") + "," + item("amulet")) + "," + claim(0, damage("sword", 500) + "," + damage("amulet", 300));
        assertClaim(scenario(0, steps), 600, 2600);
    }

    @Test
    void duplicateItemsIncreaseInsuranceSum() throws Exception {
        assertClaim(scenario(0, quote(items("sword", 2)) + "," + claim(0, "")), 0, 4000);
    }

    @Test
    void duplicateDamagesAreSeparateEvents() throws Exception {
        String damages = damage("sword", 500) + "," + damage("sword", 300);
        assertClaim(scenario(0, quote(items("sword", 2)) + "," + claim(0, damages)), 600, 3400);
    }

    @Test
    void excessDuplicateDamagesAreRejected() throws Exception {
        assertRejected(scenario(0, quote(item("sword")) + "," + claim(0, damage("sword", 200) + "," + damage("sword", 200))));
    }

    @Test
    void mixedPolicyCapUsesInsuranceValues() throws Exception {
        assertClaim(scenario(0, quote(item("sword") + "," + item("amulet")) + "," + claim(0, "")), 0, 3200);
    }

    @Test
    void premiumModifiersDoNotRaiseCap() throws Exception { assertClaim(scenario(0, quote(cursed("sword", 3)) + "," + claim(0, "")), 0, 2000); }

    @Test
    void componentBlockDoesNotLowerInsuranceSum() throws Exception {
        assertClaim(scenario(0, quote(item("sword") + "," + items("rune", 3)) + "," + claim(0, "")), 0, 3500);
    }

    @Test
    void successiveClaimsExhaustCap() throws Exception {
        String steps = quote(item("sword")) + "," + claim(0, damage("sword", 1500)) + "," + claim(0, damage("sword", 1500));
        JsonNode output = run(scenario(0, steps));
        assertEquals(1400, output.at("/results/1/payout").asInt());
        assertEquals(600, output.at("/results/1/remainingCap").asInt());
        assertEquals(600, output.at("/results/2/payout").asInt());
        assertEquals(0, output.at("/results/2/remainingCap").asInt());
    }

    @Test
    void payoutRoundsDownInOfficeFavor() throws Exception { assertClaim(singleClaim(enchanted("sword", "steel", 8), 901), 350, 1650); }

    @Test
    void unknownQuotedTypeIsRejected() throws Exception { assertRejected(scenario(0, quote(item("broomstick")))); }

    @Test
    void uninsuredClaimItemIsRejected() throws Exception {
        assertRejected(scenario(0, quote(item("sword")) + "," + claim(0, damage("amulet", 200))));
    }

    @Test
    void negativeDamageIsRejected() throws Exception {
        assertRejected(scenario(0, quote(item("sword")) + "," + claim(0, damage("sword", -200))));
    }

    private static String item(String type) { return "{\"type\":\"" + type + "\"}"; }
    private static String cursed(String type, int enchantment) { return "{\"type\":\"" + type + "\",\"material\":\"steel\",\"enchantment\":" + enchantment + ",\"cursed\":true}"; }
    private static String enchanted(String type, String material, int enchantment) { return "{\"type\":\"" + type + "\",\"material\":\"" + material + "\",\"enchantment\":" + enchantment + ",\"cursed\":false}"; }
    private static String items(String type, int count) { return java.util.stream.IntStream.range(0, count).mapToObj(i -> item(type)).collect(java.util.stream.Collectors.joining(",")); }
    private static String quote(String items) { return "{\"op\":\"quote\",\"items\":[" + items + "]}"; }
    private static String damage(String type, int amount) { return "{\"itemType\":\"" + type + "\",\"amount\":" + amount + "}"; }
    private static String claim(int policy, String damages) { return "{\"op\":\"claim\",\"policy\":" + policy + ",\"incident\":{\"cause\":\"test\",\"damages\":[" + damages + "]}}"; }
    private static String scenario(int years, String steps) { return "{\"customer\":{\"yearsWithMHPCO\":" + years + "},\"steps\":[" + steps + "]}"; }
    private static String singleClaim(String insuredItem, int amount) { return scenario(0, quote(insuredItem) + "," + claim(0, damage(JSONType(insuredItem), amount))); }
    private static String JSONType(String itemJson) { try { return JSON.readTree(itemJson).get("type").asText(); } catch (Exception exception) { throw new IllegalArgumentException(exception); } }

    private static JsonNode run(String input) throws Exception {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        Class<?> cli = Class.forName("ClaimOfficeCli");
        Method run = cli.getDeclaredMethod("run", InputStream.class, java.io.OutputStream.class);
        try { run.invoke(null, new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)), output); }
        catch (InvocationTargetException exception) { throw (Exception) exception.getCause(); }
        return JSON.readTree(output.toString(StandardCharsets.UTF_8));
    }

    private static void assertPremium(String input, int result, int expected) throws Exception { assertEquals(expected, run(input).at("/results/" + result + "/premium").asInt()); }
    private static void assertClaim(String input, int payout, int remainingCap) throws Exception {
        JsonNode result = run(input).get("results").get(1);
        assertEquals(payout, result.get("payout").asInt());
        assertEquals(remainingCap, result.get("remainingCap").asInt());
    }
    private static void assertRejected(String input) throws Exception {
        Process process = new ProcessBuilder(System.getProperty("java.home") + "/bin/java", "-cp", System.getProperty("java.class.path"), "ClaimOfficeCli").start();
        process.getOutputStream().write(input.getBytes(StandardCharsets.UTF_8));
        process.getOutputStream().close();
        String stdout = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        String stderr = new String(process.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
        assertFalse(process.waitFor() == 0);
        assertEquals("", stdout);
        assertFalse(stderr.isBlank());
    }
}
