import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class ClaimOfficeTest {

    private static Map<String, Object> steelSword() {
        return Map.of("type", "sword", "material", "steel", "enchantment", 3);
    }

    private static Map<String, Object> damage(String itemType, int amount) {
        return Map.of("itemType", itemType, "amount", amount);
    }

    @SafeVarargs
    private static Map<String, Object> incident(Map<String, Object>... damages) {
        return Map.of("cause", "dragon attack", "damages", List.of(damages));
    }

    private static Map<String, Object> customerWithYears(int years) {
        return Map.of("yearsWithMHPCO", years);
    }

    private static List<Map<String, Object>> runes(int count) {
        return java.util.stream.IntStream.range(0, count)
                .mapToObj(i -> Map.<String, Object>of("type", "rune"))
                .toList();
    }

    // ---------- Fee and empty policy ----------

    @Test
    void quoteWithNoItemsChargesOnlyTheProcessingFee() {
        assertEquals(5, new ClaimOffice().quote(List.of()));
    }

    // ---------- Price list: main items (base premium) ----------

    @Test
    void quoteForASwordUsesItsBasePremium() {
        assertEquals(115, new ClaimOffice().quote(List.of(Map.of("type", "sword"))));
    }

    @Test
    void quoteForAnAmuletUsesItsBasePremium() {
        assertEquals(71, new ClaimOffice().quote(List.of(Map.of("type", "amulet"))));
    }

    @Test
    void quoteForAStaffUsesItsBasePremium() {
        assertEquals(93, new ClaimOffice().quote(List.of(Map.of("type", "staff"))));
    }

    @Test
    void quoteForAPotionUsesItsBasePremium() {
        assertEquals(49, new ClaimOffice().quote(List.of(Map.of("type", "potion"))));
    }

    // ---------- Price list: components ----------

    @Test
    void quoteForARuneUsesTheComponentBasePremium() {
        assertEquals(33, new ClaimOffice().quote(List.of(Map.of("type", "rune"))));
    }

    @Test
    void quoteForAMoonstoneUsesTheComponentBasePremium() {
        assertEquals(33, new ClaimOffice().quote(List.of(Map.of("type", "moonstone"))));
    }

    // ---------- Multi-item policy base premium ----------

    @Test
    void policyBasePremiumIsTheSumOfItemBasePremiums() {
        // 160 G base + 16 G first insurance + 5 G fee
        assertEquals(181, new ClaimOffice().quote(
                List.of(Map.of("type", "sword"), Map.of("type", "amulet"))));
    }

    // ---------- Component building block of 3 alike ----------

    @Test
    void twoRunesCostTwoSingleComponentPremiums() {
        // 50 G base + 5 G first insurance + 5 G fee
        assertEquals(60, new ClaimOffice().quote(
                List.of(Map.of("type", "rune"), Map.of("type", "rune"))));
    }

    @Test
    void threeAlikeComponentsFormABlockAtSixtyG() {
        // 60 G block base + 6 G first insurance + 5 G fee
        assertEquals(71, new ClaimOffice().quote(List.of(
                Map.of("type", "rune"), Map.of("type", "rune"), Map.of("type", "rune"))));
    }

    @Test
    void fourRunesGetNoBlockDiscount() {
        // 100 G base + 10 G first insurance + 5 G fee
        assertEquals(115, new ClaimOffice().quote(runes(4)));
    }

    @Test
    void sevenRunesGetNoBlockDiscount() {
        // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 -> 198 G
        assertEquals(198, new ClaimOffice().quote(runes(7)));
    }

    @Test
    void componentsOfDifferentTypesDoNotFormABlock() {
        // "alike" means the same type: 75 G base + 7.5 G first insurance + 5 G fee = 87.5 -> 88 G
        assertEquals(88, new ClaimOffice().quote(List.of(
                Map.of("type", "rune"), Map.of("type", "rune"), Map.of("type", "moonstone"))));
    }

    @Test
    void eachComponentTypeFormsItsOwnBlock() {
        // two blocks: 120 G base + 12 G first insurance + 5 G fee
        assertEquals(137, new ClaimOffice().quote(List.of(
                Map.of("type", "rune"), Map.of("type", "rune"), Map.of("type", "rune"),
                Map.of("type", "moonstone"), Map.of("type", "moonstone"),
                Map.of("type", "moonstone"))));
    }

    // ---------- Item-specific modifiers ----------

    @Test
    void cursedItemAddsFiftyPercentOfItsOwnBasePremium() {
        // 100 G base + 50 G curse + 10 G first insurance + 5 G fee
        assertEquals(165, new ClaimOffice().quote(
                List.of(Map.of("type", "sword", "cursed", true))));
    }

    @Test
    void enchantmentOfExactlyFiveAddsTheHighEnchantmentSurcharge() {
        // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee
        assertEquals(145, new ClaimOffice().quote(
                List.of(Map.of("type", "sword", "enchantment", 5))));
    }

    @Test
    void enchantmentOfFourAddsNoHighEnchantmentSurcharge() {
        // 100 G base + 10 G first insurance + 5 G fee
        assertEquals(115, new ClaimOffice().quote(
                List.of(Map.of("type", "sword", "enchantment", 4))));
    }

    @Test
    void cursedAndHighlyEnchantedItemGetsBothSurcharges() {
        // 100 G base + 50 G curse + 30 G high enchantment + 10 G first insurance + 5 G fee
        assertEquals(195, new ClaimOffice().quote(
                List.of(Map.of("type", "sword", "enchantment", 5, "cursed", true))));
    }

    @Test
    void itemSurchargeAppliesOnlyToTheAffectedItemNotThePolicyTotal() {
        // 160 G policy base + 50 G curse (50 % of the sword only, not of 160 G)
        // + 16 G first insurance + 5 G fee
        assertEquals(231, new ClaimOffice().quote(List.of(
                Map.of("type", "sword", "cursed", true), Map.of("type", "amulet"))));
    }

    // ---------- Policy-wide modifiers ----------

    @Test
    void exactlyTwoYearsWithMhpcoGrantsTheLoyaltyDiscount() {
        // 100 G base - 20 G loyalty + 10 G first insurance + 5 G fee
        assertEquals(95, new ClaimOffice(customerWithYears(2))
                .quote(List.of(Map.of("type", "sword"))));
    }

    @Test
    void lessThanTwoYearsWithMhpcoGrantsNoLoyaltyDiscount() {
        // 100 G base + 10 G first insurance + 5 G fee
        assertEquals(115, new ClaimOffice(customerWithYears(1))
                .quote(List.of(Map.of("type", "sword"))));
    }

    @Test
    void firstInsuranceSurchargeAppliesToEachNewlyInsuredItem() {
        // a long-standing customer's brand-new staff is still a first insurance:
        // 80 G base - 16 G loyalty + 8 G first insurance + 5 G fee
        assertEquals(77, new ClaimOffice(customerWithYears(10))
                .quote(List.of(Map.of("type", "staff"))));
    }

    @Test
    void everyContractAfterTheFirstGetsTheFollowUpDiscount() {
        ClaimOffice office = new ClaimOffice(customerWithYears(3));
        office.quote(List.of(Map.of("type", "sword")));
        // second contract: 100 G base + 50 G curse + 30 G high enchantment
        // - 20 G loyalty + 10 G first insurance - 15 G follow-up + 5 G fee
        assertEquals(160, office.quote(
                List.of(Map.of("type", "sword", "enchantment", 7, "cursed", true))));
    }

    @Test
    void theThirdContractAlsoGetsTheFollowUpDiscount() {
        ClaimOffice office = new ClaimOffice(customerWithYears(0));
        office.quote(List.of(Map.of("type", "sword")));
        office.quote(List.of(Map.of("type", "sword")));
        // third contract: 100 G base + 10 G first insurance - 15 G follow-up + 5 G fee
        assertEquals(100, office.quote(List.of(Map.of("type", "sword"))));
    }

    // ---------- Premium rounding ----------

    @Test
    void fractionalPremiumIsRoundedUp() {
        // 175 G base + 17.5 G first insurance + 5 G fee = 197.5 -> 198 G
        assertEquals(198, new ClaimOffice().quote(runes(7)));
        // intermediate fractions are kept, only the final premium is rounded:
        // 25 - 5 loyalty + 2.5 first insurance - 3.75 follow-up + 5 fee = 23.75 -> 24 G
        ClaimOffice office = new ClaimOffice(customerWithYears(3));
        office.quote(List.of());
        assertEquals(24, office.quote(List.of(Map.of("type", "rune"))));
    }

    // ---------- Premium integration examples ----------

    @Test
    void newcomerWithACursedSwordPaysOneHundredSixtyFiveG() {
        // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee
        assertEquals(165, new ClaimOffice(customerWithYears(0)).quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 3,
                        "cursed", true))));
    }

    @Test
    void longStandingCustomersSecondContractPaysOneHundredSixtyG() {
        ClaimOffice office = new ClaimOffice(customerWithYears(3));
        office.quote(List.of(Map.of("type", "amulet")));
        // 100 base + 50 curse + 30 high enchantment - 20 loyalty
        // + 10 first insurance - 15 follow-up = 155 G + 5 G fee
        assertEquals(160, office.quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 7,
                        "cursed", true))));
    }

    // ---------- Claim: standard reimbursement and deductible ----------

    @Test
    void standardDamageIsReimbursedInFullMinusTheDeductible() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(steelSword()));
        // full reimbursement minus the 100 G deductible
        assertEquals(400, office.claim(0, incident(damage("sword", 500))).payout());
    }

    @Test
    void componentDamageIsReimbursedInFullMinusTheDeductible() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(Map.of("type", "rune")));
        // a rune has no enchantment level and no material, so no special clause applies
        assertEquals(100, office.claim(0, incident(damage("rune", 200))).payout());
    }

    @Test
    void damageSmallerThanTheDeductibleYieldsNoPayout() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(steelSword()));
        // reading adopted: the deductible cannot turn a payout negative
        assertEquals(0, office.claim(0, incident(damage("sword", 60))).payout());
    }

    @Test
    void theDeductibleAppliesOncePerDamagedItem() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(steelSword(), Map.of("type", "amulet")));
        // (500 - 100) + (300 - 100) = 600 G
        assertEquals(600, office.claim(0,
                incident(damage("sword", 500), damage("amulet", 300))).payout());
    }

    // ---------- Claim: special clauses ----------

    @Test
    void highEnchantmentDamageIsReimbursedAtHalfBeforeTheDeductible() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 9)));
        // 50 % of 1000 G, then the deductible: 500 - 100
        assertEquals(400, office.claim(0, incident(damage("sword", 1000))).payout());
    }

    @Test
    void enchantmentOfExactlyEightTriggersTheHighEnchantmentClause() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(
                Map.of("type", "sword", "material", "dragon", "enchantment", 8)));
        // the high-enchantment clause applies at exactly 8, then the deductible
        assertEquals(400, office.claim(0, incident(damage("sword", 1000))).payout());
    }

    @Test
    void dragonMaterialDamageIsReimbursedInFullMinusTheDeductible() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(
                Map.of("type", "sword", "material", "dragon", "enchantment", 5)));
        // only the dragon-material clause applies: full reimbursement, then 800 - 100
        assertEquals(700, office.claim(0, incident(damage("sword", 800))).payout());
    }

    @Test
    void highEnchantmentClauseWinsOverDragonMaterial() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(
                Map.of("type", "sword", "material", "dragon", "enchantment", 9)));
        // both clauses apply; the 50 % rule wins, then the deductible: 500 - 100
        assertEquals(400, office.claim(0, incident(damage("sword", 1000))).payout());
    }

    // ---------- Claim: payout rounding ----------

    @Test
    void fractionalPayoutIsRoundedDown() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 9)));
        // 50 % of 901 G = 450.5 G, minus the deductible = 350.5 G -> 350 G
        assertEquals(350, office.claim(0, incident(damage("sword", 901))).payout());
    }

    // ---------- Insurance sum and cap ----------

    @Test
    void capIsTwiceTheSumOfTheInsuredItemValues() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(steelSword(), Map.of("type", "amulet")));
        // insurance sum 1000 + 600 = 1600 G, cap 3200 G; a 200 G payout leaves 3000 G
        assertEquals(3000, office.claim(0, incident(damage("sword", 300))).remainingCap());
    }

    @Test
    void twoItemsOfTheSameTypeEachAddTheirInsuranceValue() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(steelSword(), steelSword()));
        // insurance sum 2 x 1000 = 2000 G, cap 4000 G; a 400 G payout leaves 3600 G
        assertEquals(3600, office.claim(0, incident(damage("sword", 500))).remainingCap());
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        ClaimOffice office = new ClaimOffice();
        // premium with modifiers is 165 G, but the cap follows the unmodified 1000 G value
        assertEquals(165, office.quote(List.of(
                Map.of("type", "sword", "material", "steel", "enchantment", 3,
                        "cursed", true))));
        // cap 2000 G; a 400 G payout leaves 1600 G
        assertEquals(1600, office.claim(0, incident(damage("sword", 500))).remainingCap());
    }

    @Test
    void theComponentBlockDiscountDoesNotLowerTheInsuranceSum() {
        ClaimOffice office = new ClaimOffice();
        // the 3 runes form a premium block, but each is still insured at 250 G
        office.quote(List.of(steelSword(), Map.of("type", "rune"),
                Map.of("type", "rune"), Map.of("type", "rune")));
        // insurance sum 1000 + 750 = 1750 G, cap 3500 G; a 400 G payout leaves 3100 G
        assertEquals(3100, office.claim(0, incident(damage("sword", 500))).remainingCap());
    }

    @Test
    void anAmuletIsInsuredAtSixHundredG() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(Map.of("type", "amulet")));
        // cap 1200 G; a 100 G payout leaves 1100 G
        assertEquals(1100, office.claim(0, incident(damage("amulet", 200))).remainingCap());
    }

    @Test
    void aStaffIsInsuredAtEightHundredG() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(Map.of("type", "staff")));
        // cap 1600 G; a 100 G payout leaves 1500 G
        assertEquals(1500, office.claim(0, incident(damage("staff", 200))).remainingCap());
    }

    @Test
    void aPotionIsInsuredAtFourHundredG() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(Map.of("type", "potion")));
        // cap 800 G; a 100 G payout leaves 700 G
        assertEquals(700, office.claim(0, incident(damage("potion", 200))).remainingCap());
    }

    @Test
    void aMoonstoneIsInsuredAtTwoHundredFiftyG() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(Map.of("type", "moonstone")));
        // cap 500 G; a 100 G payout leaves 400 G
        assertEquals(400, office.claim(0, incident(damage("moonstone", 200))).remainingCap());
    }

    // ---------- Cap exhaustion across claims ----------

    @Test
    void aClaimReducesTheRemainingCap() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(steelSword()));
        Settlement settlement = office.claim(0, incident(damage("sword", 1500)));
        assertEquals(1400, settlement.payout());
        assertEquals(600, settlement.remainingCap());
    }

    @Test
    void aPayoutIsLimitedToTheRemainingCap() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(steelSword()));
        office.claim(0, incident(damage("sword", 1500)));
        // the desired 1400 G is reduced to the 600 G remaining cap
        Settlement settlement = office.claim(0, incident(damage("sword", 1500)));
        assertEquals(600, settlement.payout());
        assertEquals(0, settlement.remainingCap());
    }

    // ---------- Multiple damages of the same type ----------

    @Test
    void eachDamageEntryOfTheSameTypeIsASeparateDamage() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(steelSword(), steelSword()));
        // two separate damages, each with its own deductible: 400 + 400
        assertEquals(800, office.claim(0,
                incident(damage("sword", 500), damage("sword", 500))).payout());
    }

    @Test
    void moreDamagesOfATypeThanInsuredItemsRejectsTheClaim() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(steelSword()));
        // reading adopted: the domain layer rejects the claim by throwing, and the CLI
        // turns that into a non-zero exit status
        assertThrows(IllegalArgumentException.class, () -> office.claim(0,
                incident(damage("sword", 500), damage("sword", 500))));
    }

    // ---------- Error contract (CLI exit status and stderr) ----------

    @Test
    void anUnknownItemTypeInAQuoteIsRejected() {
        ClaimOffice office = new ClaimOffice();
        // reading adopted: the domain layer rejects by throwing; the CLI turns that into
        // a non-zero exit status with a message on stderr and no results on stdout
        assertThrows(IllegalArgumentException.class,
                () -> office.quote(List.of(Map.of("type", "broomstick"))));
    }

    @Test
    void aDamageToAnItemNotInThePolicyIsRejected() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(steelSword()));
        assertThrows(IllegalArgumentException.class,
                () -> office.claim(0, incident(damage("amulet", 200))));
    }

    @Test
    void aDamageWithAnUnknownItemTypeIsRejected() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(steelSword()));
        assertThrows(IllegalArgumentException.class,
                () -> office.claim(0, incident(damage("broomstick", 200))));
    }

    @Test
    void aNegativeDamageAmountIsRejected() {
        ClaimOffice office = new ClaimOffice();
        office.quote(List.of(steelSword()));
        assertThrows(IllegalArgumentException.class,
                () -> office.claim(0, incident(damage("sword", -200))));
    }

    // ---------- CLI contract ----------

    @Test
    void theCliWritesOneResultPerStepInOrder() throws Exception {
        String scenario = """
                {"customer": {"yearsWithMHPCO": 0},
                 "steps": [{"op": "quote", "items": [{"type": "sword"}]},
                           {"op": "quote", "items": [{"type": "amulet"}]}]}
                """;
        // first quote 100 + 10 + 5 = 115 G; second quote 60 + 6 - 9 follow-up + 5 = 62 G
        assertEquals("{\"results\":[{\"premium\":115},{\"premium\":62}]}",
                ClaimOfficeCli.run(scenario));
    }

    @Test
    void theCliHandlesTheSchemaExampleScenario() throws Exception {
        String scenario = """
                {
                  "customer": {"yearsWithMHPCO": 5},
                  "steps": [
                    {"op": "quote",
                     "items": [{"type": "amulet", "material": "silver",
                                "enchantment": 2, "cursed": false}]},
                    {"op": "claim", "policy": 0,
                     "incident": {"cause": "fire",
                                  "damages": [{"itemType": "amulet", "amount": 200}]}}
                  ]
                }
                """;
        // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59 G; payout 100 G, cap 1200 - 100
        assertEquals("{\"results\":[{\"premium\":59},"
                + "{\"payout\":100,\"remainingCap\":1100}]}", ClaimOfficeCli.run(scenario));
    }
}
