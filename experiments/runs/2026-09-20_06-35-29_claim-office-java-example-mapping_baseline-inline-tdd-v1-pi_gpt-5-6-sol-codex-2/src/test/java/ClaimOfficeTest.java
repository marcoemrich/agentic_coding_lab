import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ClaimOfficeTest {
    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void quotesComponentsAndAppliesModifiersAtTheirProperScopes() throws Exception {
        JsonNode result = process("""
                {"customer":{"yearsWithMHPCO":3},"steps":[
                  {"op":"quote","items":[
                    {"type":"rune"},{"type":"rune"},{"type":"rune"},
                    {"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}]},
                  {"op":"quote","items":[
                    {"type":"sword","cursed":true,"enchantment":7},
                    {"type":"amulet","cursed":false,"enchantment":2}]}
                ]}
                """);

        assertEquals(113, result.at("/results/0/premium").intValue());
        assertEquals(205, result.at("/results/1/premium").intValue());
    }

    @Test
    void newcomerCursedSwordAndEmptyQuoteMatchExamples() throws Exception {
        JsonNode result = process("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword","material":"steel","enchantment":3,"cursed":true}]},
                  {"op":"quote","items":[]}
                ]}
                """);

        assertEquals(165, result.at("/results/0/premium").intValue());
        assertEquals(5, result.at("/results/1/premium").intValue());
    }

    @Test
    void claimsUsePerDamageDeductiblesSpecialRateAndPersistentCap() throws Exception {
        JsonNode result = process("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[
                    {"type":"sword","material":"dragon","enchantment":9},
                    {"type":"amulet","material":"silver","enchantment":2}]},
                  {"op":"claim","policy":0,"incident":{"cause":"attack","damages":[
                    {"itemType":"sword","amount":1000},{"itemType":"amulet","amount":300}]}},
                  {"op":"claim","policy":0,"incident":{"cause":"attack","damages":[
                    {"itemType":"sword","amount":6000}]}}
                ]}
                """);

        assertEquals(600, result.at("/results/1/payout").intValue());
        assertEquals(2600, result.at("/results/1/remainingCap").intValue());
        assertEquals(2600, result.at("/results/2/payout").intValue());
        assertEquals(0, result.at("/results/2/remainingCap").intValue());
    }

    @Test
    void payoutRoundsDownOnlyAfterCombiningDamageEntries() throws Exception {
        JsonNode result = process("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[
                    {"type":"sword","enchantment":8},{"type":"sword","enchantment":8}]},
                  {"op":"claim","policy":0,"incident":{"cause":"fog","damages":[
                    {"itemType":"sword","amount":901},{"itemType":"sword","amount":902}]}}
                ]}
                """);

        assertEquals(701, result.at("/results/1/payout").intValue());
    }

    @Test
    void rejectsUnknownAndUninsuredOrDuplicateDamages() {
        assertThrows(IllegalArgumentException.class, () -> process("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"sword"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[
                    {"itemType":"sword","amount":100},{"itemType":"sword","amount":100}]}}
                ]}
                """));
        assertThrows(IllegalArgumentException.class, () -> process("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"broomstick"}]}
                ]}
                """));
        assertThrows(IllegalArgumentException.class, () -> process("""
                {"customer":{"yearsWithMHPCO":0},"steps":[
                  {"op":"quote","items":[{"type":"rune"}]},
                  {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[
                    {"itemType":"rune","amount":-1}]}}
                ]}
                """));
    }

    private JsonNode process(String json) throws Exception {
        return new ClaimOffice(mapper).process(mapper.readTree(json));
    }
}
