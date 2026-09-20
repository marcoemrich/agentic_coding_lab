import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

/** The CLI reads a scenario from stdin and writes results to stdout. */
class ClaimOfficeCliTest {

    private record Result(int status, String stdout, String stderr) {
    }

    private static Result invoke(String input) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayOutputStream err = new ByteArrayOutputStream();
        int status = ClaimOfficeCli.execute(
                new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)),
                new PrintStream(out, true, StandardCharsets.UTF_8),
                new PrintStream(err, true, StandardCharsets.UTF_8));
        return new Result(status, out.toString(StandardCharsets.UTF_8),
                err.toString(StandardCharsets.UTF_8));
    }

    @Test
    void aValidScenarioIsWrittenToStdoutWithStatusZero() {
        Result result = invoke("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [
                   {"type": "sword", "material": "steel", "enchantment": 3, "cursed": true}]}]}
                """);
        assertEquals(0, result.status());
        assertEquals("{\"results\":[{\"premium\":165}]}", result.stdout().trim());
        assertEquals("", result.stderr());
    }

    @Test
    void anUnknownItemTypeFailsWithoutWritingResults() {
        Result result = invoke("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}
                """);
        assertNotEquals(0, result.status());
        assertEquals("", result.stdout());
        assertTrue(result.stderr().contains("broomstick"), result.stderr());
    }

    @Test
    void aNegativeDamageAmountFailsWithoutWritingResults() {
        Result result = invoke("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword"}]},
                   {"op": "claim", "policy": 0, "incident": {
                     "cause": "fire", "damages": [{"itemType": "sword", "amount": -200}]}}]}
                """);
        assertNotEquals(0, result.status());
        assertEquals("", result.stdout());
        assertTrue(result.stderr().contains("-200"), result.stderr());
    }

    @Test
    void aDamageToAnUninsuredItemFailsWithoutWritingResults() {
        Result result = invoke("""
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [
                   {"op": "quote", "items": [{"type": "sword"}]},
                   {"op": "claim", "policy": 0, "incident": {
                     "cause": "fire", "damages": [{"itemType": "amulet", "amount": 300}]}}]}
                """);
        assertNotEquals(0, result.status());
        assertEquals("", result.stdout());
        assertTrue(result.stderr().contains("amulet"), result.stderr());
    }

    @Test
    void malformedJsonFailsWithoutWritingResults() {
        Result result = invoke("{ not json");
        assertNotEquals(0, result.status());
        assertEquals("", result.stdout());
    }
}
