import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class ClaimOfficeCliTest {

    private static String run(String input) {
        return ScenarioRunner.run(input);
    }

    @Test
    void quoteAndClaimFollowTheSchemaExample() {
        String out = run("""
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]},
                   {"op": "claim", "policy": 0,
                    "incident": {"cause": "fire",
                                 "damages": [{"itemType": "amulet", "amount": 200}]}}]}
                """);
        // 60 base - 12 loyalty + 6 first insurance = 54 + 5 fee = 59
        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}", out);
    }

    @Test
    void secondQuoteInAScenarioGetsTheFollowUpDiscount() {
        String out = run("""
                {"customer": {"yearsWithMHPCO": 3},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "sword", "material": "steel", "enchantment": 3, "cursed": false}]},
                   {"op": "quote", "items": [
                     {"type": "sword", "material": "steel", "enchantment": 7, "cursed": true}]}]}
                """);
        // first: 100 - 20 loyalty + 10 first = 90 + 5 = 95; second is the worked example: 160
        assertEquals("{\"results\":[{\"premium\":95},{\"premium\":160}]}", out);
    }

    @Test
    void emptyItemListYieldsTheProcessingFeeOnly() {
        String out = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": []}]}
                """);
        assertEquals("{\"results\":[{\"premium\":5}]}", out);
    }

    @Test
    void missingOptionalItemFieldsAreTolerated() {
        String out = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "rune"}, {"type": "rune"}]}]}
                """);
        // 50 base + 5 first insurance = 55 + 5 fee = 60
        assertEquals("{\"results\":[{\"premium\":60}]}", out);
    }

    @Test
    void capIsExhaustedAcrossSuccessiveClaims() {
        String out = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "sword", "material": "steel", "enchantment": 3, "cursed": false}]},
                   {"op": "claim", "policy": 0,
                    "incident": {"cause": "dragon", "damages": [{"itemType":"sword","amount":1500}]}},
                   {"op": "claim", "policy": 0,
                    "incident": {"cause": "dragon", "damages": [{"itemType":"sword","amount":1500}]}}]}
                """);
        assertTrue(out.contains("{\"payout\":1400,\"remainingCap\":600}"), out);
        assertTrue(out.contains("{\"payout\":600,\"remainingCap\":0}"), out);
    }

    @Test
    void unknownItemTypeInAQuoteIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}
                """));
    }

    @Test
    void claimAgainstAnItemOutsideThePolicyIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword"}]},
                   {"op": "claim", "policy": 0,
                    "incident": {"cause": "fire", "damages": [{"itemType":"amulet","amount":200}]}}]}
                """));
    }

    @Test
    void negativeDamageIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword"}]},
                   {"op": "claim", "policy": 0,
                    "incident": {"cause": "fire", "damages": [{"itemType":"sword","amount":-200}]}}]}
                """));
    }

    @Test
    void claimReferencingAnUnknownPolicyStepIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "claim", "policy": 3,
                    "incident": {"cause": "fire", "damages": [{"itemType":"sword","amount":200}]}}]}
                """));
    }

    @Test
    void unknownOperationIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> run("""
                {"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "refund"}]}
                """));
    }
}
