import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class ScenarioTest {

    private static String run(String input) {
        return ClaimOfficeCli.process(input);
    }

    @Test
    void schemaExampleProducesQuoteAndClaimResults() {
        String output = run("""
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [
                   {"op": "quote", "items": [
                     {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]},
                   {"op": "claim", "policy": 0,
                    "incident": {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}]}
                """);
        // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59; payout 200 - 100 = 100
        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}", output);
    }

    @Test
    void followUpContractDiscountAppliesToLaterQuotes() {
        String output = run("""
                {"customer": {"yearsWithMHPCO": 3},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword", "material": "steel", "enchantment": 3, "cursed": true}]},
                   {"op": "quote", "items": [{"type": "sword", "material": "steel", "enchantment": 7, "cursed": true}]}]}
                """);
        assertEquals("{\"results\":[{\"premium\":145},{\"premium\":160}]}", output);
    }

    @Test
    void missingOptionalItemFieldsDefaultToPlainItem() {
        String output = run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "rune"}, {"type": "rune"}, {"type": "rune"}]}]}
                """);
        // block 60 + 6 first insurance + 5 fee
        assertEquals("{\"results\":[{\"premium\":71}]}", output);
    }

    @Test
    void unknownItemTypeIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}
                """));
    }

    @Test
    void claimAgainstUninsuredItemIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword"}]},
                   {"op": "claim", "policy": 0,
                    "incident": {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}]}
                """));
    }

    @Test
    void negativeDamageAmountIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword"}]},
                   {"op": "claim", "policy": 0,
                    "incident": {"cause": "fire", "damages": [{"itemType": "sword", "amount": -200}]}}]}
                """));
    }

    @Test
    void claimReferencingAnUnknownPolicyStepIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> run("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "claim", "policy": 0,
                    "incident": {"cause": "fire", "damages": [{"itemType": "sword", "amount": 200}]}}]}
                """));
    }
}
