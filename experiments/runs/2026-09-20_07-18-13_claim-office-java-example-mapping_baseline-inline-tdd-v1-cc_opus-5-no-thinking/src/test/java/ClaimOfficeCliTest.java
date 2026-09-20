import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class ClaimOfficeCliTest {

    @Test
    void answersAQuoteAndAClaimInStepOrder() {
        String stdin = """
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [
                   {"op": "quote", "items": [
                      {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]},
                   {"op": "claim", "policy": 0, "incident": {
                      "cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}]}
                """;
        // 60 G base - 12 G loyalty + 6 G first insurance + 5 G fee = 59 G; payout 200 - 100 = 100 G
        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}",
                ClaimOfficeCli.run(stdin));
    }

    @Test
    void rejectsAQuoteWithAnUnknownItemType() {
        String stdin = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}
                """;
        assertThrows(ScenarioException.class, () -> ClaimOfficeCli.run(stdin));
    }

    @Test
    void defaultsMissingOptionalItemFields() {
        String stdin = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "sword"}]}]}
                """;
        assertEquals("{\"results\":[{\"premium\":115}]}", ClaimOfficeCli.run(stdin));
    }

    @Test
    void rejectsAnUnknownOperation() {
        String stdin = """
                {"customer": {"yearsWithMHPCO": 0}, "steps": [{"op": "audit"}]}
                """;
        assertThrows(ScenarioException.class, () -> ClaimOfficeCli.run(stdin));
    }
}
