import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class ClaimOfficeCliTest {
    @Test void emptyQuoteCostsFive() throws Exception {
        assertSuccess(scenario(0, quote("")), "{\"results\":[{\"premium\":5}]}");
    }

    @Test void mainItemPriceList() throws Exception {
        assertSuccess(scenario(0, quote(item("sword"))), "{\"results\":[{\"premium\":115}]}");
        assertSuccess(scenario(0, quote(item("amulet"))), "{\"results\":[{\"premium\":71}]}");
        assertSuccess(scenario(0, quote(item("staff"))), "{\"results\":[{\"premium\":93}]}");
        assertSuccess(scenario(0, quote(item("potion"))), "{\"results\":[{\"premium\":49}]}");
    }

    @Test void componentPriceList() throws Exception {
        assertSuccess(scenario(0, quote(item("rune")) + "," + claim(0, damage("rune", 100))),
                "{\"results\":[{\"premium\":33},{\"payout\":0,\"remainingCap\":500}]}");
        assertSuccess(scenario(0, quote(item("moonstone")) + "," + claim(0, damage("moonstone", 100))),
                "{\"results\":[{\"premium\":33},{\"payout\":0,\"remainingCap\":500}]}");
    }

    @Test void componentBlockRequiresExactlyThree() throws Exception {
        assertSuccess(scenario(0, quote(items("rune", 2))), "{\"results\":[{\"premium\":60}]}");
        assertSuccess(scenario(0, quote(items("rune", 3))), "{\"results\":[{\"premium\":71}]}");
        assertSuccess(scenario(0, quote(items("rune", 4))), "{\"results\":[{\"premium\":115}]}");
        assertSuccess(scenario(0, quote(items("rune", 7))), "{\"results\":[{\"premium\":198}]}");
    }

    @Test void componentBlocksArePerType() throws Exception {
        String mixed = items("rune", 2) + "," + item("moonstone");
        String twoBlocks = items("rune", 3) + "," + items("moonstone", 3);
        assertSuccess(scenario(0, quote(mixed)), "{\"results\":[{\"premium\":88}]}");
        assertSuccess(scenario(0, quote(twoBlocks)), "{\"results\":[{\"premium\":137}]}");
    }

    @Test void curseModifierHasItemScope() throws Exception {
        assertSuccess(scenario(0, quote(item("sword", "\"cursed\":true") + "," + item("amulet"))), "{\"results\":[{\"premium\":231}]}");
    }

    @Test void enchantmentThresholdAndStacking() throws Exception {
        String high = item("sword", "\"enchantment\":5,\"cursed\":true");
        String low = item("sword", "\"enchantment\":4,\"cursed\":true");
        assertSuccess(scenario(0, quote(high)), "{\"results\":[{\"premium\":195}]}");
        assertSuccess(scenario(0, quote(low)), "{\"results\":[{\"premium\":165}]}");
    }

    @Test void loyaltyStartsAtTwoYears() throws Exception {
        assertSuccess(scenario(2, quote(item("sword"))), "{\"results\":[{\"premium\":95}]}");
    }

    @Test void newcomerCursedSwordIntegration() throws Exception {
        assertSuccess(scenario(0, quote(item("sword", "\"material\":\"steel\",\"enchantment\":3,\"cursed\":true"))), "{\"results\":[{\"premium\":165}]}");
    }

    @Test void followUpContractStillHasFirstInsuranceSurcharge() throws Exception {
        String sword = item("sword", "\"material\":\"steel\",\"enchantment\":7,\"cursed\":true");
        assertSuccess(scenario(3, quote(item("potion")) + "," + quote(sword)), "{\"results\":[{\"premium\":41},{\"premium\":160}]}");
    }

    @Test void premiumRoundsUpAtEnd() throws Exception {
        assertSuccess(scenario(0, quote(items("rune", 7))), "{\"results\":[{\"premium\":198}]}");
    }

    @Test void standardClaimsDeductOneHundred() throws Exception {
        assertSuccess(scenario(0, quote(item("sword", "\"material\":\"steel\",\"enchantment\":3")) + "," + claim(0, damage("sword", 500))),
                "{\"results\":[{\"premium\":115},{\"payout\":400,\"remainingCap\":1600}]}");
        assertSuccess(scenario(0, quote(item("rune")) + "," + claim(0, damage("rune", 200))),
                "{\"results\":[{\"premium\":33},{\"payout\":100,\"remainingCap\":400}]}");
    }

    @Test void highEnchantmentWinsOverDragonMaterialAtThreshold() throws Exception {
        String sword = item("sword", "\"material\":\"dragon\",\"enchantment\":8");
        assertSuccess(scenario(0, quote(sword) + "," + claim(0, damage("sword", 1000))), "{\"results\":[{\"premium\":145},{\"payout\":400,\"remainingCap\":1600}]}");
    }

    @Test void enchantmentAndDragonClaimClauses() throws Exception {
        int dragonEnchantmentNineQuoteStep = 0;
        int dragonEnchantmentFiveQuoteStep = 2;
        int steelEnchantmentNineQuoteStep = 4;
        String steps = quote(item("sword", "\"material\":\"dragon\",\"enchantment\":9")) + ","
                + claim(dragonEnchantmentNineQuoteStep, damage("sword", 1000)) + ","
                + quote(item("sword", "\"material\":\"dragon\",\"enchantment\":5")) + ","
                + claim(dragonEnchantmentFiveQuoteStep, damage("sword", 800)) + ","
                + quote(item("sword", "\"material\":\"steel\",\"enchantment\":9")) + ","
                + claim(steelEnchantmentNineQuoteStep, damage("sword", 1000));
        assertSuccess(scenario(0, steps), "{\"results\":[{\"premium\":145},{\"payout\":400,\"remainingCap\":1600},{\"premium\":130},{\"payout\":700,\"remainingCap\":1300},{\"premium\":130},{\"payout\":400,\"remainingCap\":1600}]}");
    }

    @Test void deductibleAppliesPerDamageEntry() throws Exception {
        String covered = item("sword") + "," + item("amulet");
        assertSuccess(scenario(0, quote(covered) + "," + claim(0, damage("sword", 500) + "," + damage("amulet", 300))),
                "{\"results\":[{\"premium\":181},{\"payout\":600,\"remainingCap\":2600}]}");
    }

    @Test void twoSwordsProvideFourThousandCapAndTwoDamagesPayEightHundred() throws Exception {
        String swords = item("sword") + "," + item("sword");
        assertSuccess(scenario(0, quote(swords) + "," + claim(0, damage("sword", 500) + "," + damage("sword", 500))),
                "{\"results\":[{\"premium\":225},{\"payout\":800,\"remainingCap\":3200}]}");
    }

    @Test void excessiveDamageMultiplicityIsRejected() throws Exception {
        assertRejected(scenario(0, quote(item("sword")) + "," + claim(0, damage("sword", 200) + "," + damage("sword", 200))));
    }

    @Test void capUsesInsuranceValuesNotPremiums() throws Exception {
        String steps = quote(item("sword") + "," + item("amulet")) + "," + claim(0, damage("sword", 100)) + ","
                + quote(item("sword", "\"cursed\":true")) + "," + claim(2, damage("sword", 100)) + ","
                + quote(item("sword") + "," + items("rune", 3)) + "," + claim(4, damage("rune", 100));
        assertSuccess(scenario(0, steps), "{\"results\":[{\"premium\":181},{\"payout\":0,\"remainingCap\":3200},{\"premium\":150},{\"payout\":0,\"remainingCap\":2000},{\"premium\":157},{\"payout\":0,\"remainingCap\":3500}]}");
    }

    @Test void successiveClaimsExhaustPolicyCap() throws Exception {
        String steps = quote(item("sword")) + "," + claim(0, damage("sword", 1500)) + "," + claim(0, damage("sword", 1500));
        assertSuccess(scenario(0, steps), "{\"results\":[{\"premium\":115},{\"payout\":1400,\"remainingCap\":600},{\"payout\":600,\"remainingCap\":0}]}");
    }

    @Test void payoutRoundsDownAtEnd() throws Exception {
        String sword = item("sword", "\"enchantment\":9");
        assertSuccess(scenario(0, quote(sword) + "," + claim(0, damage("sword", 901))),
                "{\"results\":[{\"premium\":145},{\"payout\":350,\"remainingCap\":1650}]}");
        assertSuccess(scenario(0, quote(sword + "," + sword) + "," + claim(0, damage("sword", 901) + "," + damage("sword", 901))),
                "{\"results\":[{\"premium\":285},{\"payout\":701,\"remainingCap\":3299}]}");
    }

    @Test void unknownQuoteItemIsRejected() throws Exception {
        assertRejected(scenario(0, quote(item("broomstick"))));
    }

    @Test void uncoveredDamageItemIsRejected() throws Exception {
        assertRejected(scenario(0, quote(item("sword")) + "," + claim(0, damage("amulet", 200))));
        assertRejected(scenario(0, quote(item("sword")) + "," + claim(0, damage("broomstick", 200))));
    }

    @Test void negativeDamageIsRejected() throws Exception {
        assertRejected(scenario(0, quote(item("sword")) + "," + claim(0, damage("sword", -200))));
    }

    private static String scenario(int years, String steps) {
        return "{\"customer\":{\"yearsWithMHPCO\":" + years + "},\"steps\":[" + steps + "]}";
    }

    private static String quote(String items) { return "{\"op\":\"quote\",\"items\":[" + items + "]}"; }
    private static String claim(int quoteStepIndex, String damages) {
        return "{\"op\":\"claim\",\"policy\":" + quoteStepIndex + ",\"incident\":{\"cause\":\"test\",\"damages\":[" + damages + "]}}";
    }
    private static String item(String type) { return item(type, ""); }
    private static String item(String type, String fields) {
        return "{\"type\":\"" + type + "\"" + (fields.isEmpty() ? "" : "," + fields) + "}";
    }
    private static String items(String type, int count) {
        return java.util.stream.IntStream.range(0, count).mapToObj(index -> item(type)).collect(java.util.stream.Collectors.joining(","));
    }
    private static String damage(String type, int amount) { return "{\"itemType\":\"" + type + "\",\"amount\":" + amount + "}"; }

    private static Execution execute(String input) throws Exception {
        ByteArrayOutputStream stdout = new ByteArrayOutputStream();
        ByteArrayOutputStream stderr = new ByteArrayOutputStream();
        Class<?> cli = Class.forName("ClaimOfficeCli");
        Method method = cli.getDeclaredMethod("execute", InputStream.class, PrintStream.class, PrintStream.class);
        int status = (int) method.invoke(null, new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)), new PrintStream(stdout), new PrintStream(stderr));
        return new Execution(status, stdout.toString(StandardCharsets.UTF_8).trim(), stderr.toString(StandardCharsets.UTF_8).trim());
    }

    private static void assertSuccess(String input, String expectedOutput) throws Exception {
        Execution result = execute(input);
        assertEquals(0, result.status());
        assertEquals(expectedOutput, result.stdout());
        assertEquals("", result.stderr());
    }

    private static void assertRejected(String input) throws Exception {
        Execution result = execute(input);
        assertTrue(result.status() != 0);
        assertFalse(result.stderr().isBlank());
        assertEquals("", result.stdout());
    }

    private record Execution(int status, String stdout, String stderr) { }
}
