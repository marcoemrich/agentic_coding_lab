import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;

class ClaimOfficeTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    @Test
    void quotesEmptyAndComponentBlocks() throws Exception {
        JsonNode result = run("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[]},
                  {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"}]},
                  {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"moonstone"}]}
                ]}
                """);
        assertEquals(5, result.at("/results/0/premium").intValue());
        assertEquals(62, result.at("/results/1/premium").intValue());
        assertEquals(77, result.at("/results/2/premium").intValue());
    }

    @Test
    void combinesScopedAndPolicyModifiers() throws Exception {
        JsonNode result = run("""
                {"customer":{"yearsWithMHPCO":3},"steps":[
                  {"op":"quote","items":[{"type":"amulet"}]},
                  {"op":"quote","items":[
                    {"type":"sword","material":"steel","enchantment":7,"cursed":true},
                    {"type":"amulet","enchantment":1,"cursed":false}
                  ]}
                ]}
                """);
        assertEquals(59, result.at("/results/0/premium").intValue());
        assertEquals(205, result.at("/results/1/premium").intValue());
    }

    @Test
    void claimsApplyClausesDeductiblesDuplicatesAndCap() throws Exception {
        JsonNode result = run("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[
                    {"type":"sword","material":"dragon","enchantment":9},
                    {"type":"sword","material":"steel","enchantment":3},
                    {"type":"rune"}
                  ]},
                  {"op":"claim","policy":0,"incident":{"cause":"attack","damages":[
                    {"itemType":"sword","amount":1000},
                    {"itemType":"sword","amount":500},
                    {"itemType":"rune","amount":200}
                  ]}},
                  {"op":"claim","policy":0,"incident":{"cause":"again","damages":[
                    {"itemType":"sword","amount":5000}
                  ]}}
                ]}
                """);
        assertEquals(900, result.at("/results/1/payout").intValue());
        assertEquals(3600, result.at("/results/1/remainingCap").intValue());
        assertEquals(2400, result.at("/results/2/payout").intValue());
        assertEquals(1200, result.at("/results/2/remainingCap").intValue());
    }

    @Test
    void rejectsUnknownItemsNegativeDamageAndExcessDuplicateDamage() throws Exception {
        assertRejected("""
                {"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}
                """);
        assertRejected("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"x","damages":[{"itemType":"sword","amount":-1}]}}
                ]}
                """);
        assertRejected("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"x","damages":[
                    {"itemType":"sword","amount":1},{"itemType":"sword","amount":1}]}}
                ]}
                """);
    }

    private static JsonNode run(String input) throws Exception {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        ByteArrayOutputStream error = new ByteArrayOutputStream();
        int status = ClaimOfficeCli.run(
                new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)), output, error);
        assertEquals(0, status, error.toString(StandardCharsets.UTF_8));
        return JSON.readTree(output.toByteArray());
    }

    private static void assertRejected(String input) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        ByteArrayOutputStream error = new ByteArrayOutputStream();
        int status = ClaimOfficeCli.run(
                new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8)), output, error);
        assertFalse(status == 0);
        assertEquals("", output.toString(StandardCharsets.UTF_8));
        assertFalse(error.toString(StandardCharsets.UTF_8).isBlank());
    }
}
