import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

class ClaimOfficeTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    @Test
    void quotesAnEmptyPolicyAtTheProcessingFee() throws Exception {
        assertEquals(5, result("""
                {"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]}]}
                """).at("/results/0/premium").asInt());
    }

    @Test
    void appliesComponentBlocksOnlyToExactlyThreeOfEachType() throws Exception {
        JsonNode result = result("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"rune"},{"type":"rune"}]},
                  {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"}]},
                  {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]},
                  {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},
                    {"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]}
                ]}
                """);
        assertEquals(60, result.at("/results/0/premium").asInt());
        assertEquals(62, result.at("/results/1/premium").asInt());
        assertEquals(100, result.at("/results/2/premium").asInt());
        assertEquals(119, result.at("/results/3/premium").asInt());
    }

    @Test
    void scopesItemAndPolicyModifiersAndRoundsUp() throws Exception {
        JsonNode result = result("""
                {"customer":{"yearsWithMHPCO":3},"steps":[
                  {"op":"quote","items":[]},
                  {"op":"quote","items":[
                    {"type":"sword","material":"steel","enchantment":7,"cursed":true}
                  ]},
                  {"op":"quote","items":[{"type":"rune","enchantment":5,"cursed":true}]}
                ]}
                """);
        assertEquals(160, result.at("/results/1/premium").asInt());
        assertEquals(44, result.at("/results/2/premium").asInt());
    }

    @Test
    void reimbursesOrdinaryAndHighlyEnchantedDamageWithOneDeductibleEach() throws Exception {
        JsonNode result = result("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[
                    {"type":"sword","material":"dragon","enchantment":9},
                    {"type":"amulet","enchantment":2}
                  ]},
                  {"op":"claim","policy":0,"incident":{"cause":"attack","damages":[
                    {"itemType":"sword","amount":1000},{"itemType":"amulet","amount":300}
                  ]}}
                ]}
                """);
        assertEquals(600, result.at("/results/1/payout").asInt());
        assertEquals(2600, result.at("/results/1/remainingCap").asInt());
    }

    @Test
    void roundsPayoutDownOnlyAfterTheCalculation() throws Exception {
        JsonNode result = result("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword","enchantment":8}]},
                  {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[
                    {"itemType":"sword","amount":901}
                  ]}}
                ]}
                """);
        assertEquals(350, result.at("/results/1/payout").asInt());
        assertEquals(1650, result.at("/results/1/remainingCap").asInt());
    }

    @Test
    void tracksAndExhaustsThePolicyCapAcrossClaims() throws Exception {
        JsonNode result = result("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"one","damages":[
                    {"itemType":"sword","amount":1500}]}},
                  {"op":"claim","policy":0,"incident":{"cause":"two","damages":[
                    {"itemType":"sword","amount":1500}]}}
                ]}
                """);
        assertEquals(1400, result.at("/results/1/payout").asInt());
        assertEquals(600, result.at("/results/1/remainingCap").asInt());
        assertEquals(600, result.at("/results/2/payout").asInt());
        assertEquals(0, result.at("/results/2/remainingCap").asInt());
    }

    @Test
    void rejectsUnknownUncoveredExcessAndNegativeDamage() throws Exception {
        assertInvalid("""
                {"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}
                """);
        assertInvalid("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"x","damages":[{"itemType":"amulet","amount":1}]}}
                ]}
                """);
        assertInvalid("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"x","damages":[
                    {"itemType":"sword","amount":1},{"itemType":"sword","amount":1}]}}
                ]}
                """);
        assertInvalid("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"x","damages":[{"itemType":"sword","amount":-200}]}}
                ]}
                """);
    }

    private static JsonNode result(String input) throws Exception {
        return new ClaimOffice().process(JSON.readTree(input));
    }

    private static void assertInvalid(String input) throws Exception {
        JsonNode scenario = JSON.readTree(input);
        assertThrows(IllegalArgumentException.class, () -> new ClaimOffice().process(scenario));
    }
}
