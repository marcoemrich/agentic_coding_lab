import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

/** Steps are processed in order; claims refer to an earlier quote by step index. */
class ScenarioTest {

    private static String run(String input) {
        return Scenario.run(input);
    }

    @Test
    void aQuoteStepReportsItsPremium() {
        String out = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [
                   {"type": "sword", "material": "steel", "enchantment": 3, "cursed": true}]}]}
                """);
        assertEquals("{\"results\":[{\"premium\":165}]}", out);
    }

    @Test
    void aClaimStepReportsPayoutAndRemainingCap() {
        String out = run("""
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]},
                   {"op": "claim", "policy": 0, "incident": {
                     "cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}]}
                """);
        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}", out);
    }

    @Test
    void theFollowUpDiscountAppliesToTheSecondQuoteOfTheScenario() {
        String out = run("""
                {"customer": {"yearsWithMHPCO": 3},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "sword", "material": "steel", "enchantment": 3, "cursed": false}]},
                   {"op": "quote", "items": [
                     {"type": "sword", "material": "steel", "enchantment": 7, "cursed": true}]}]}
                """);
        assertEquals("{\"results\":[{\"premium\":95},{\"premium\":160}]}", out);
    }

    @Test
    void claimsAgainstTheSamePolicyShareItsCap() {
        String out = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "sword", "material": "steel", "enchantment": 3, "cursed": false}]},
                   {"op": "claim", "policy": 0, "incident": {
                     "cause": "dragon", "damages": [{"itemType": "sword", "amount": 1500}]}},
                   {"op": "claim", "policy": 0, "incident": {
                     "cause": "dragon", "damages": [{"itemType": "sword", "amount": 1500}]}}]}
                """);
        assertEquals("{\"results\":[{\"premium\":115},"
                + "{\"payout\":1400,\"remainingCap\":600},"
                + "{\"payout\":600,\"remainingCap\":0}]}", out);
    }

    @Test
    void missingItemFieldsDefaultToPlainUnenchantedItems() {
        String out = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "rune"}, {"type": "rune"},
                   {"type": "rune"}]}]}
                """);
        assertEquals("{\"results\":[{\"premium\":71}]}", out);
    }

    @Test
    void anUnknownItemTypeIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}
                """));
    }

    @Test
    void aClaimAgainstAStepThatIsNotAQuoteIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "claim", "policy": 0, "incident": {
                   "cause": "fire", "damages": [{"itemType": "sword", "amount": 200}]}}]}
                """));
    }

    @Test
    void anUnknownOperationIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> run("""
                {"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "renew"}]}
                """));
    }
}
