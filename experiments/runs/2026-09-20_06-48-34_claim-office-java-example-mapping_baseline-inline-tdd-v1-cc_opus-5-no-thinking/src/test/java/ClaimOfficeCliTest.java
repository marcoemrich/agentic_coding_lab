import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class ClaimOfficeCliTest {

    @Test
    void quoteAndClaimAreReportedInStepOrder() {
        String stdin = """
                {"customer": {"yearsWithMHPCO": 5},
                 "steps": [
                   {"op": "quote", "items": [{"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}]},
                   {"op": "claim", "policy": 0, "incident": {"cause": "fire", "damages": [{"itemType": "amulet", "amount": 200}]}}
                 ]}
                """;
        // amulet 60 base; loyalty -12, first +6 => 54 + 5 fee = 59
        assertEquals("{\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}", run(stdin).stdout());
    }

    @Test
    void theSecondQuoteInAScenarioIsAFollowUpContract() {
        String stdin = """
                {"customer": {"yearsWithMHPCO": 3},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword", "material": "steel", "enchantment": 3, "cursed": true}]},
                   {"op": "quote", "items": [{"type": "sword", "material": "steel", "enchantment": 7, "cursed": true}]}
                 ]}
                """;
        assertTrue(run(stdin).stdout().endsWith("{\"premium\":160}]}"), run(stdin).stdout());
    }

    @Test
    void anUnknownItemTypeFailsWithoutWritingResults() {
        String stdin = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}
                """;
        Run run = run(stdin);
        assertNotEquals(0, run.status());
        assertEquals("", run.stdout());
        assertTrue(run.stderr().contains("broomstick"), run.stderr());
    }

    @Test
    void anInvalidClaimFailsWithADescriptionOnStderr() {
        String stdin = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword", "material": "steel", "enchantment": 3, "cursed": false}]},
                   {"op": "claim", "policy": 0, "incident": {"cause": "x", "damages": [{"itemType": "sword", "amount": -200}]}}
                 ]}
                """;
        Run run = run(stdin);
        assertNotEquals(0, run.status());
        assertEquals("", run.stdout());
        assertTrue(run.stderr().contains("-200"), run.stderr());
    }

    private record Run(int status, String stdout, String stderr) {
    }

    private static Run run(String stdin) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayOutputStream err = new ByteArrayOutputStream();
        int status = ClaimOfficeCli.run(
                new ByteArrayInputStream(stdin.getBytes(StandardCharsets.UTF_8)),
                new PrintStream(out, true, StandardCharsets.UTF_8),
                new PrintStream(err, true, StandardCharsets.UTF_8));
        return new Run(status, out.toString(StandardCharsets.UTF_8).trim(), err.toString(StandardCharsets.UTF_8));
    }
}
