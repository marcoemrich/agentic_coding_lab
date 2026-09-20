import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class ClaimOfficeCliTest {
    @Test void emptyQuoteCostsFive() { assertPremium(5, 0, ""); }

    @Test void swordBasePremium() { assertPremium(115, 0, item("sword")); }

    @Test void amuletBasePremium() { assertPremium(71, 0, item("amulet")); }

    @Test void staffBasePremium() { assertPremium(93, 0, item("staff")); }

    @Test void potionBasePremium() { assertPremium(49, 0, item("potion")); }

    @Test void twoRunes() { assertPremium(60, 0, items("rune", 2)); }

    @Test void threeRunesBlock() { assertPremium(71, 0, items("rune", 3)); }

    @Test void fourRunesNoBlock() { assertPremium(115, 0, items("rune", 4)); }

    @Test void sevenRunesNoBlock() { assertPremium(198, 0, items("rune", 7)); }

    @Test void mixedComponentsNoBlock() { assertPremium(88, 0, items("rune", 2) + "," + item("moonstone")); }

    @Test void twoComponentBlocks() { assertPremium(137, 0, items("rune", 3) + "," + items("moonstone", 3)); }

    @Test void cursedScope() { assertPremium(231, 0, detailed("sword", "steel", 3, true) + "," + item("amulet")); }

    @Test void loyaltyAtTwoYears() { assertPremium(95, 2, item("sword")); }

    @Test void enchantmentFiveAndCurse() { assertPremium(195, 0, detailed("sword", "steel", 5, true)); }

    @Test void enchantmentFourOnlyCurse() { assertPremium(165, 0, detailed("sword", "steel", 4, true)); }

    @Test void newcomerCursedSword() { assertPremium(165, 0, detailed("sword", "steel", 3, true)); }

    @Test void longstandingSecondContract() {
        String steps = quote(item("potion")) + "," + quote(detailed("sword", "steel", 7, true));
        assertJson("{\"results\":[{\"premium\":41},{\"premium\":160}]}", scenario(3, steps));
    }

    @Test void premiumRoundsUpOnlyAtEnd() { assertPremium(198, 0, items("rune", 7)); }

    @Test void regularSwordClaim() { assertClaim(item("sword"), damage("sword", 500), 400, 1600); }

    @Test void runeClaim() { assertClaim(item("rune"), damage("rune", 200), 100, 400); }

    @Test void enchantmentEightClaim() { assertClaim(detailed("sword", "dragon", 8, false), damage("sword", 1000), 400, 1600); }

    @Test void dragonHighEnchantmentClaim() { assertClaim(detailed("sword", "dragon", 9, false), damage("sword", 1000), 400, 1600); }

    @Test void dragonOnlyClaim() { assertClaim(detailed("sword", "dragon", 5, false), damage("sword", 800), 700, 1300); }

    @Test void highEnchantmentOnlyClaim() { assertClaim(detailed("sword", "steel", 9, false), damage("sword", 1000), 400, 1600); }

    @Test void deductiblePerDamage() { assertClaim(item("sword") + "," + item("amulet"), damage("sword", 500) + "," + damage("amulet", 300), 600, 2600); }

    @Test void duplicateItemsAreSeparate() { assertClaim(items("sword", 2), damage("sword", 500) + "," + damage("sword", 500), 800, 3200); }

    @Test void excessDuplicateDamageRejected() { assertCliFailure(scenario(0, quote(item("sword")) + "," + claim(damage("sword", 100) + "," + damage("sword", 100)))); }

    @Test void insuranceSumSetsCap() { assertClaim(item("sword") + "," + item("amulet"), damage("sword", 100), 0, 3200); }

    @Test void curseDoesNotRaiseCap() { assertClaim(detailed("sword", "steel", 3, true), damage("sword", 100), 0, 2000); }

    @Test void blockDoesNotLowerCap() { assertClaim(item("sword") + "," + items("rune", 3), damage("sword", 100), 0, 3500); }

    @Test void successiveClaimsExhaustCap() {
        String input = scenario(0, quote(item("sword")) + "," + claim(damage("sword", 1500)) + "," + claim(damage("sword", 1500)));
        assertJson("{\"results\":[{\"premium\":115},{\"payout\":1400,\"remainingCap\":600},{\"payout\":600,\"remainingCap\":0}]}", input);
    }

    @Test void payoutRoundsDown() { assertClaim(detailed("sword", "steel", 9, false), damage("sword", 901), 350, 1650); }

    @Test void staffInsuranceValue() { assertClaim(item("staff"), damage("staff", 100), 0, 1600); }

    @Test void potionInsuranceValue() { assertClaim(item("potion"), damage("potion", 100), 0, 800); }

    @Test void moonstoneInsuranceValue() { assertClaim(item("moonstone"), damage("moonstone", 100), 0, 500); }

    @Test void unknownQuoteRejected() { assertCliFailure(scenario(0, quote(item("broomstick")))); }

    @Test void unownedDamageRejected() { assertCliFailure(scenario(0, quote(item("sword")) + "," + claim(damage("amulet", 200)))); }

    @Test void unknownDamageRejected() { assertCliFailure(scenario(0, quote(item("sword")) + "," + claim(damage("broomstick", 200)))); }

    @Test void negativeDamageRejected() { assertCliFailure(scenario(0, quote(item("sword")) + "," + claim(damage("sword", -200)))); }

    private static void assertPremium(int expected, int years, String itemJson) {
        assertJson("{\"results\":[{\"premium\":" + expected + "}]}", scenario(years, quote(itemJson)));
    }

    private static void assertClaim(String itemJson, String damageJson, int payout, int remaining) {
        assertJson("{\"results\":[{\"premium\":" + premiumIgnored() + "},{\"payout\":" + payout + ",\"remainingCap\":" + remaining + "}]}",
                scenario(0, quote(itemJson) + "," + claim(damageJson)));
    }

    private static String premiumIgnored() { return "<premium>"; }

    private static void assertJson(String expected, String input) {
        String actual = invoke(input);
        if (expected.contains("<premium>")) {
            assertEquals(expected.replaceFirst("<premium>", actual.replaceAll("\\{\\\"results\\\":\\[\\{\\\"premium\\\":(\\d+).*", "$1")), actual);
        } else {
            assertEquals(expected, actual);
        }
    }

    private static String invoke(String input) {
        try {
            Class<?> cli = Class.forName("ClaimOfficeCli");
            Method process = cli.getMethod("process", String.class);
            return (String) process.invoke(null, input);
        } catch (InvocationTargetException exception) {
            Throwable cause = exception.getCause();
            if (cause instanceof RuntimeException runtime) throw runtime;
            throw new RuntimeException(cause);
        } catch (ReflectiveOperationException exception) {
            throw new AssertionError(exception);
        }
    }

    private static void assertCliFailure(String input) {
        try {
            Process process = new ProcessBuilder(System.getProperty("java.home") + "/bin/java", "-cp",
                    System.getProperty("java.class.path"), "ClaimOfficeCli").start();
            process.getOutputStream().write(input.getBytes(StandardCharsets.UTF_8));
            process.getOutputStream().close();
            int status = process.waitFor();
            assertTrue(status != 0, "status should be non-zero");
            assertFalse(new String(process.getErrorStream().readAllBytes(), StandardCharsets.UTF_8).isBlank());
            assertEquals("", new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8));
        } catch (Exception exception) {
            throw new AssertionError(exception);
        }
    }

    private static String scenario(int years, String steps) {
        return "{\"customer\":{\"yearsWithMHPCO\":" + years + "},\"steps\":[" + steps + "]}";
    }
    private static String quote(String items) { return "{\"op\":\"quote\",\"items\":[" + items + "]}"; }
    private static String claim(String damages) { return "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"attack\",\"damages\":[" + damages + "]}}"; }
    private static String item(String type) { return "{\"type\":\"" + type + "\"}"; }
    private static String detailed(String type, String material, int enchantment, boolean cursed) {
        return "{\"type\":\"" + type + "\",\"material\":\"" + material + "\",\"enchantment\":" + enchantment + ",\"cursed\":" + cursed + "}";
    }
    private static String damage(String type, int amount) { return "{\"itemType\":\"" + type + "\",\"amount\":" + amount + "}"; }
    private static String items(String type, int count) {
        return java.util.stream.IntStream.range(0, count).mapToObj(index -> item(type)).reduce((left, right) -> left + "," + right).orElse("");
    }
}
