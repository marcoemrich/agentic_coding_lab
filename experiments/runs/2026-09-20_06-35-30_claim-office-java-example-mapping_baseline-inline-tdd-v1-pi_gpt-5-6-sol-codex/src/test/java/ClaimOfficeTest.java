import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

class ClaimOfficeTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    @Test
    void quotesMainItemsAndAddsFirstInsuranceAndFee() throws Exception {
        JsonNode scenario = JSON.readTree("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[
                {"type":"sword"},{"type":"amulet"},{"type":"staff"},{"type":"potion"}
              ]}
            ]}
            """);

        assertEquals(313, new ClaimOffice().process(scenario)
            .path("results").get(0).path("premium").intValue());
    }

    @Test
    void emptyQuoteCostsOnlyTheProcessingFee() throws Exception {
        JsonNode scenario = JSON.readTree("""
            {"customer":{"yearsWithMHPCO":20},"steps":[{"op":"quote","items":[]}]}
            """);

        assertEquals(5, new ClaimOffice().process(scenario)
            .path("results").get(0).path("premium").intValue());
    }

    @Test
    void newcomerCursedSwordMatchesIntegratedPremium() throws Exception {
        JsonNode scenario = JSON.readTree("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[
                {"type":"sword","material":"steel","enchantment":3,"cursed":true}
              ]}
            ]}
            """);

        assertEquals(165, new ClaimOffice().process(scenario)
            .path("results").get(0).path("premium").intValue());
    }

    @Test
    void pricesComponentBlocksByExactTypeAndAppliesModifiersByScope() throws Exception {
        JsonNode scenario = JSON.readTree("""
            {"customer":{"yearsWithMHPCO":3},"steps":[
              {"op":"quote","items":[
                {"type":"rune"},{"type":"rune"},{"type":"moonstone"}
              ]},
              {"op":"quote","items":[
                {"type":"sword","cursed":true,"enchantment":7}
              ]},
              {"op":"quote","items":[
                {"type":"rune"},{"type":"rune"},{"type":"rune"},
                {"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}
              ]}
            ]}
            """);

        JsonNode results = new ClaimOffice().process(scenario).path("results");
        assertEquals(73, results.get(0).path("premium").intValue());
        assertEquals(160, results.get(1).path("premium").intValue());
        assertEquals(95, results.get(2).path("premium").intValue());
    }

    @Test
    void roundsPremiumUpOnlyAfterAllModifiers() throws Exception {
        JsonNode scenario = JSON.readTree("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[{"type":"rune","cursed":true}]}
            ]}
            """);

        assertEquals(45, new ClaimOffice().process(scenario)
            .path("results").get(0).path("premium").intValue());
    }

    @Test
    void appliesEachDamageDeductibleAndTracksCapAcrossClaims() throws Exception {
        JsonNode scenario = JSON.readTree("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[
                {"type":"sword","material":"dragon","enchantment":3},
                {"type":"amulet","enchantment":2}
              ]},
              {"op":"claim","policy":0,"incident":{"cause":"attack","damages":[
                {"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}
              ]}},
              {"op":"claim","policy":0,"incident":{"cause":"fire","damages":[
                {"itemType":"sword","amount":3000}
              ]}}
            ]}
            """);

        JsonNode results = new ClaimOffice().process(scenario).path("results");
        assertEquals(600, results.get(1).path("payout").intValue());
        assertEquals(2600, results.get(1).path("remainingCap").intValue());
        assertEquals(2600, results.get(2).path("payout").intValue());
        assertEquals(0, results.get(2).path("remainingCap").intValue());
    }

    @Test
    void highEnchantmentHalvesBeforeDeductibleAndFinalRounding() throws Exception {
        JsonNode scenario = JSON.readTree("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[
                {"type":"sword","material":"dragon","enchantment":9},
                {"type":"staff","enchantment":8}
              ]},
              {"op":"claim","policy":0,"incident":{"cause":"curse","damages":[
                {"itemType":"sword","amount":1000},{"itemType":"staff","amount":901}
              ]}}
            ]}
            """);

        JsonNode claim = new ClaimOffice().process(scenario).path("results").get(1);
        assertEquals(750, claim.path("payout").intValue());
        assertEquals(2850, claim.path("remainingCap").intValue());
    }

    @Test
    void matchesRepeatedDamageEntriesToRepeatedCoveredItems() throws Exception {
        JsonNode valid = JSON.readTree("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[{"type":"sword"},{"type":"sword","enchantment":9}]},
              {"op":"claim","policy":0,"incident":{"cause":"duel","damages":[
                {"itemType":"sword","amount":500},{"itemType":"sword","amount":500}
              ]}}
            ]}
            """);
        assertEquals(550, new ClaimOffice().process(valid)
            .path("results").get(1).path("payout").intValue());

        JsonNode excess = JSON.readTree("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[{"type":"sword"}]},
              {"op":"claim","policy":0,"incident":{"cause":"duel","damages":[
                {"itemType":"sword","amount":500},{"itemType":"sword","amount":500}
              ]}}
            ]}
            """);
        assertThrows(IllegalArgumentException.class, () -> new ClaimOffice().process(excess));
    }

    @Test
    void rejectsNegativeDamageUncoveredItemsAndInvalidPolicyReferences() throws Exception {
        String prefix = "{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
            + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\"}]},";
        String suffix = "]}";
        JsonNode negative = JSON.readTree(prefix
            + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"x\",\"damages\":[{\"itemType\":\"sword\",\"amount\":-1}]}}"
            + suffix);
        JsonNode uncovered = JSON.readTree(prefix
            + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"x\",\"damages\":[{\"itemType\":\"amulet\",\"amount\":100}]}}"
            + suffix);
        JsonNode invalidPolicy = JSON.readTree(prefix
            + "{\"op\":\"claim\",\"policy\":1,\"incident\":{\"cause\":\"x\",\"damages\":[]}}"
            + suffix);

        assertThrows(IllegalArgumentException.class, () -> new ClaimOffice().process(negative));
        assertThrows(IllegalArgumentException.class, () -> new ClaimOffice().process(uncovered));
        assertThrows(IllegalArgumentException.class, () -> new ClaimOffice().process(invalidPolicy));
    }

    @Test
    void rejectsUnknownQuotedItem() throws Exception {
        JsonNode scenario = JSON.readTree("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[{"type":"broomstick"}]}
            ]}
            """);

        assertThrows(IllegalArgumentException.class, () -> new ClaimOffice().process(scenario));
    }
}
