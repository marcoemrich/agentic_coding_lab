import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

class ClaimOfficeTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    private JsonNode run(String input) throws Exception {
        return new ClaimOffice().process(JSON.readTree(input));
    }

    @Test
    void pricesComponentsAndStacksPremiumModifiersAtTheirCorrectScopes() throws Exception {
        JsonNode result = run("""
            {"customer":{"yearsWithMHPCO":3},"steps":[
              {"op":"quote","items":[]},
              {"op":"quote","items":[
                {"type":"sword","cursed":true,"enchantment":5},
                {"type":"amulet"},
                {"type":"rune"},{"type":"rune"},{"type":"rune"},
                {"type":"moonstone"},{"type":"moonstone"},{"type":"moonstone"}
              ]}
            ]}
            """);
        assertEquals(5, result.at("/results/0/premium").asInt());
        // base 280; item surcharges 80; loyalty -56; initial +28; follow-up -42; fee 5
        assertEquals(295, result.at("/results/1/premium").asInt());
    }

    @Test
    void componentBlockOnlyAppliesToExactlyThreeOfTheSameType() throws Exception {
        JsonNode result = run("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[{"type":"rune"},{"type":"rune"}]},
              {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"}]},
              {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]},
              {"op":"quote","items":[{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"},{"type":"rune"}]}
            ]}
            """);
        // First-insurance +10% always applies, and quotes after the first get -15%.
        assertEquals(60, result.at("/results/0/premium").asInt());
        assertEquals(62, result.at("/results/1/premium").asInt());
        assertEquals(100, result.at("/results/2/premium").asInt());
        assertEquals(172, result.at("/results/3/premium").asInt());
    }

    @Test
    void appliesClaimRulesDeductiblesAndPersistentPolicyCap() throws Exception {
        JsonNode result = run("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[
                {"type":"sword","material":"dragon","enchantment":9},
                {"type":"sword","material":"steel","enchantment":3},
                {"type":"rune"}
              ]},
              {"op":"claim","policy":0,"incident":{"cause":"attack","damages":[
                {"itemType":"sword","amount":1001},
                {"itemType":"sword","amount":500},
                {"itemType":"rune","amount":200}
              ]}},
              {"op":"claim","policy":0,"incident":{"cause":"attack","damages":[
                {"itemType":"sword","amount":5000}
              ]}}
            ]}
            """);
        // 400.5 + 400 + 100 is rounded down only after summing.
        assertEquals(900, result.at("/results/1/payout").asInt());
        assertEquals(3600, result.at("/results/1/remainingCap").asInt());
        assertEquals(2400, result.at("/results/2/payout").asInt());
        assertEquals(1200, result.at("/results/2/remainingCap").asInt());
    }

    @Test
    void matchesThePublishedIntegratedPremiumExamplesAndRoundsUp() throws Exception {
        JsonNode newcomer = run("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[{"type":"sword","material":"steel","enchantment":3,"cursed":true}]}
            ]}
            """);
        assertEquals(165, newcomer.at("/results/0/premium").asInt());

        JsonNode returningCustomer = run("""
            {"customer":{"yearsWithMHPCO":3},"steps":[
              {"op":"quote","items":[]},
              {"op":"quote","items":[{"type":"sword","material":"steel","enchantment":7,"cursed":true}]}
            ]}
            """);
        assertEquals(160, returningCustomer.at("/results/1/premium").asInt());
    }

    @Test
    void appliesOneDeductiblePerDamageAndExhaustsTheCapAcrossClaims() throws Exception {
        JsonNode result = run("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[{"type":"sword"},{"type":"amulet"}]},
              {"op":"claim","policy":0,"incident":{"cause":"dragon","damages":[
                {"itemType":"sword","amount":500},{"itemType":"amulet","amount":300}
              ]}},
              {"op":"claim","policy":0,"incident":{"cause":"loss","damages":[
                {"itemType":"sword","amount":5000}
              ]}}
            ]}
            """);
        assertEquals(600, result.at("/results/1/payout").asInt());
        assertEquals(2600, result.at("/results/1/remainingCap").asInt());
        assertEquals(2600, result.at("/results/2/payout").asInt());
        assertEquals(0, result.at("/results/2/remainingCap").asInt());
    }

    @Test
    void rejectsUnknownItemsNegativeDamageAndTooManyDamages() {
        assertThrows(IllegalArgumentException.class, () -> run("""
            {"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[{"type":"broomstick"}]}]}
            """));
        assertThrows(IllegalArgumentException.class, () -> run("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[{"type":"sword"}]},
              {"op":"claim","policy":0,"incident":{"cause":"x","damages":[{"itemType":"sword","amount":-1}]}}
            ]}
            """));
        assertThrows(IllegalArgumentException.class, () -> run("""
            {"customer":{"yearsWithMHPCO":0},"steps":[
              {"op":"quote","items":[{"type":"sword"}]},
              {"op":"claim","policy":0,"incident":{"cause":"x","damages":[
                {"itemType":"sword","amount":100},{"itemType":"sword","amount":100}
              ]}}
            ]}
            """));
    }
}
