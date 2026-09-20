import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class ClaimOfficeCliTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    @Test void emptyQuoteCostsFive() throws Exception { assertResults(scenario(0, quote("")), "[{\"premium\":5}]"); }

    @Test void mainItemPriceList() throws Exception {
        assertResults(scenario(0, quote(item("sword"))), "[{\"premium\":115}]");
        assertResults(scenario(0, quote(item("amulet"))), "[{\"premium\":71}]");
        assertResults(scenario(0, quote(item("staff"))), "[{\"premium\":93}]");
        assertResults(scenario(0, quote(item("potion"))), "[{\"premium\":49}]");
    }

    @Test void exactThreeComponentBlock() throws Exception {
        assertResults(scenario(0, quote(items("rune",2))), "[{\"premium\":60}]");
        assertResults(scenario(0, quote(items("rune",3))), "[{\"premium\":71}]");
        assertResults(scenario(0, quote(items("rune",4))), "[{\"premium\":115}]");
        assertResults(scenario(0, quote(items("rune",7))), "[{\"premium\":198}]");
    }

    @Test void unlikeComponentsDoNotFormBlock() throws Exception { assertResults(scenario(0, quote(items("rune",2)+","+item("moonstone"))), "[{\"premium\":88}]"); }

    @Test void eachComponentTypeFormsItsOwnBlock() throws Exception { assertResults(scenario(0, quote(items("rune",3)+","+items("moonstone",3))), "[{\"premium\":137}]"); }

    @Test void itemModifiersHaveItemScope() throws Exception { assertResults(scenario(0, quote(cursedItem("sword",3)+","+item("amulet"))), "[{\"premium\":231}]"); }

    @Test void loyaltyThresholdIsInclusive() throws Exception { assertResults(scenario(2, quote(item("sword"))), "[{\"premium\":95}]"); }

    @Test void enchantmentThresholdIsInclusiveAndStacksWithCurse() throws Exception { assertResults(scenario(0, quote(cursedItem("sword",5))), "[{\"premium\":195}]"); }

    @Test void belowEnchantmentThresholdOnlyCurseApplies() throws Exception { assertResults(scenario(0, quote(cursedItem("sword",4))), "[{\"premium\":165}]"); }

    @Test void newcomerCursedSwordIntegration() throws Exception { assertResults(scenario(0, quote(cursedItem("sword",3))), "[{\"premium\":165}]"); }

    @Test void longstandingFollowUpStillHasFirstInsuranceSurcharge() throws Exception {
        assertResults(scenario(3, quote(item("amulet")), quote(cursedItem("sword",7))), "[{\"premium\":59},{\"premium\":160}]");
    }

    @Test void highEnchantmentWinsAtExactClaimThreshold() throws Exception { assertResults(quoteThenClaim(dragonSword(8), damage("sword",1000)), "[{\"premium\":145},{\"payout\":400,\"remainingCap\":1600}]"); }

    @Test void deductibleAppliesPerDamagedItem() throws Exception { assertResults(scenario(0, quote(item("sword")+","+item("amulet")), claim(0, damage("sword",500)+","+damage("amulet",300))), "[{\"premium\":181},{\"payout\":600,\"remainingCap\":2600}]"); }

    @Test void standardItemReimbursement() throws Exception { assertResults(quoteThenClaim(item("sword"), damage("sword",500)), "[{\"premium\":115},{\"payout\":400,\"remainingCap\":1600}]"); }

    @Test void componentReimbursement() throws Exception { assertResults(quoteThenClaim(item("rune"), damage("rune",200)), "[{\"premium\":33},{\"payout\":100,\"remainingCap\":400}]"); }

    @Test void dragonAndHighEnchantmentUsesHalfReimbursement() throws Exception { assertPayout(dragonSword(9),1000,400); }

    @Test void dragonWithoutHighEnchantmentUsesFullReimbursement() throws Exception { assertPayout(dragonSword(5),800,700); }

    @Test void highEnchantmentSteelUsesHalfReimbursement() throws Exception { assertPayout(enchantmentSword(9),1000,400); }

    @Test void duplicateItemsAreDistinctInsuredOccurrences() throws Exception { assertResults(scenario(0, quote(item("sword")+","+item("sword")), claim(0, damage("sword",500)+","+damage("sword",500))), "[{\"premium\":225},{\"payout\":800,\"remainingCap\":3200}]"); }

    @Test void excessDamageOccurrencesRejectClaim() { assertRejects(scenario(0, quote(item("sword")), claim(0, damage("sword",200)+","+damage("sword",200)))); }

    @Test void capsUseUnmodifiedInsuranceValues() throws Exception {
        assertResults(scenario(0,quote(item("sword")+","+item("amulet")),claim(0,"")), "[{\"premium\":181},{\"payout\":0,\"remainingCap\":3200}]");
        assertResults(scenario(0,quote(cursedItem("sword",3)),claim(0,"")), "[{\"premium\":165},{\"payout\":0,\"remainingCap\":2000}]");
        assertResults(scenario(0,quote(item("sword")+","+items("rune",3)),claim(0,"")), "[{\"premium\":181},{\"payout\":0,\"remainingCap\":3500}]");
    }

    @Test void successiveClaimsExhaustPolicyCap() throws Exception { assertResults(scenario(0, quote(item("sword")), claim(0,damage("sword",1500)), claim(0,damage("sword",1500))), "[{\"premium\":115},{\"payout\":1400,\"remainingCap\":600},{\"payout\":600,\"remainingCap\":0}]"); }

    @Test void premiumRoundsUpAtEnd() throws Exception { assertResults(scenario(0,quote(items("rune",7))), "[{\"premium\":198}]"); }

    @Test void payoutRoundsDownAtEnd() throws Exception { assertResults(quoteThenClaim(enchantmentSword(9), damage("sword",901)), "[{\"premium\":145},{\"payout\":350,\"remainingCap\":1650}]"); }

    @Test void unknownQuoteItemRejects() throws Exception { assertCliRejects(scenario(0,quote(item("broomstick")))); }

    @Test void unownedDamageRejects() throws Exception { assertCliRejects(scenario(0,quote(item("sword")),claim(0,damage("amulet",200)))); assertCliRejects(scenario(0,quote(item("sword")),claim(0,damage("broomstick",200)))); }

    @Test void negativeDamageRejects() throws Exception { assertCliRejects(scenario(0,quote(item("sword")),claim(0,damage("sword",-200)))); }

    private static String invoke(String input) throws Exception {
        try {
            Class<?> cli=Class.forName("ClaimOfficeCli"); Method method=cli.getMethod("process",String.class);
            return (String) method.invoke(null,input);
        } catch (InvocationTargetException exception) {
            if (exception.getCause() instanceof RuntimeException runtime) throw runtime;
            throw exception;
        }
    }
    private static void assertResults(String input,String results) throws Exception { assertEquals(JSON.readTree("{\"results\":"+results+"}"),JSON.readTree(invoke(input))); }
    private static void assertRejects(String input) { assertThrows(IllegalArgumentException.class,()->invoke(input)); }
    private static void assertCliRejects(String input) throws Exception {
        ByteArrayOutputStream stdout=new ByteArrayOutputStream(); ByteArrayOutputStream stderr=new ByteArrayOutputStream();
        Class<?> cli=Class.forName("ClaimOfficeCli"); Method method=cli.getMethod("run",java.io.InputStream.class,java.io.OutputStream.class,java.io.OutputStream.class);
        int status=(int)method.invoke(null,new ByteArrayInputStream(input.getBytes(java.nio.charset.StandardCharsets.UTF_8)),stdout,stderr);
        assertTrue(status!=0); assertEquals("",stdout.toString(java.nio.charset.StandardCharsets.UTF_8)); assertTrue(!stderr.toString(java.nio.charset.StandardCharsets.UTF_8).isBlank());
    }
    private static void assertPayout(String sword,int damage,int payout) throws Exception { JsonNode result=JSON.readTree(invoke(quoteThenClaim(sword,damage("sword",damage)))); assertEquals(payout,result.at("/results/1/payout").asInt()); }
    private static String scenario(int years,String... steps) { return "{\"customer\":{\"yearsWithMHPCO\":"+years+"},\"steps\":["+String.join(",",steps)+"]}"; }
    private static String quoteThenClaim(String item,String damage) { return scenario(0,quote(item),claim(0,damage)); }
    private static String quote(String items) { return "{\"op\":\"quote\",\"items\":["+items+"]}"; }
    private static String claim(int policy,String damages) { return "{\"op\":\"claim\",\"policy\":"+policy+",\"incident\":{\"cause\":\"incident\",\"damages\":["+damages+"]}}"; }
    private static String item(String type) { return "{\"type\":\""+type+"\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}"; }
    private static String cursedItem(String type,int enchantment) { return "{\"type\":\""+type+"\",\"material\":\"steel\",\"enchantment\":"+enchantment+",\"cursed\":true}"; }
    private static String enchantmentSword(int enchantment) { return "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":"+enchantment+",\"cursed\":false}"; }
    private static String dragonSword(int enchantment) { return "{\"type\":\"sword\",\"material\":\"dragon\",\"enchantment\":"+enchantment+",\"cursed\":false}"; }
    private static String damage(String type,int amount) { return "{\"itemType\":\""+type+"\",\"amount\":"+amount+"}"; }
    private static String items(String type,int count) { return java.util.stream.IntStream.range(0,count).mapToObj(index->item(type)).reduce((a,b)->a+","+b).orElse(""); }
}
