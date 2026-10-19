import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;

import org.junit.jupiter.api.Test;

/**
 * Behaviors from prompt.md, ordered simple -> complex.
 *
 * Observable contract: every behavior is observed through the CLI scenario
 * protocol (JSON on stdin, JSON on stdout, non-zero exit plus stderr text for
 * rejections), because that is the only contract the specification fixes.
 *
 * Adopted readings where the specification leaves a choice:
 *  - "alike" components means components of exactly the same type.
 *  - the 3-component block requires exactly 3 of a type (4 runes -> no block).
 *  - the first-insurance surcharge applies to every quote's policy base
 *    premium, regardless of customer history.
 *  - rejections are observable as a non-zero CLI exit status with a non-empty
 *    stderr description and no results on stdout.
 */
class ClaimOfficeTest {

    // ---------- processing fee and single-item base premiums ----------

    @Test
    void emptyItemListCostsOnlyTheProcessingFee() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[]}]}");

        assertEquals("{\"results\":[{\"premium\":5}]}", stdout);
    }

    /** What the office reported: its exit status and what it wrote where. */
    private record Outcome(int status, String stdout, String stderr) {
    }

    /**
     * Runs the claim-office executable the way the specification describes it:
     * a process reading the scenario from stdin and answering on stdout.
     */
    private static Outcome executeClaimOffice(String scenario) {
        try {
            Process office = new ProcessBuilder(
                    Paths.get(System.getProperty("java.home"), "bin", "java").toString(),
                    "-cp", System.getProperty("java.class.path"), "ClaimOfficeCli")
                    .start();
            office.getOutputStream().write(scenario.getBytes(StandardCharsets.UTF_8));
            office.getOutputStream().close();
            String stdout = new String(office.getInputStream().readAllBytes(),
                    StandardCharsets.UTF_8);
            String stderr = new String(office.getErrorStream().readAllBytes(),
                    StandardCharsets.UTF_8);
            return new Outcome(office.waitFor(), stdout, stderr);
        } catch (Exception e) {
            throw new IllegalStateException("could not run the claim office", e);
        }
    }

    private static Outcome reportOffice(String scenario) {
        ByteArrayOutputStream stdout = new ByteArrayOutputStream();
        ByteArrayOutputStream stderr = new ByteArrayOutputStream();
        int status = new ClaimOfficeCli().report(
                new ByteArrayInputStream(scenario.getBytes(StandardCharsets.UTF_8)),
                new PrintStream(stdout, true, StandardCharsets.UTF_8),
                new PrintStream(stderr, true, StandardCharsets.UTF_8));
        return new Outcome(status, stdout.toString(StandardCharsets.UTF_8),
                stderr.toString(StandardCharsets.UTF_8));
    }

    /** What the office wrote on stdout for a scenario it accepts. */
    private static String runOffice(String scenario) {
        Outcome outcome = reportOffice(scenario);
        assertEquals(0, outcome.status(), "the office must accept the scenario");
        return outcome.stdout().trim();
    }

    @Test
    void swordHasBasePremium100() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":115}]}", stdout);
    }

    @Test
    void amuletHasBasePremium60() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"amulet\",\"material\":\"silver\",\"enchantment\":2,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":71}]}", stdout);
    }

    @Test
    void staffHasBasePremium80() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"staff\",\"material\":\"oak\",\"enchantment\":1,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":93}]}", stdout);
    }

    @Test
    void potionHasBasePremium40() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"potion\",\"material\":\"glass\",\"enchantment\":0,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":49}]}", stdout);
    }

    @Test
    void runeHasBasePremium25() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"rune\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":33}]}", stdout);
    }

    @Test
    void moonstoneHasBasePremium25() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"moonstone\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":33}]}", stdout);
    }

    // ---------- component blocks ----------

    @Test
    void twoRunesCostFiftyBase() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":60}]}", stdout);
    }

    @Test
    void threeAlikeComponentsFormABlockAtSixty() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":71}]}", stdout);
    }

    @Test
    void fourRunesGetNoBlockDiscount() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},"
                + "{\"type\":\"rune\"},{\"type\":\"rune\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":115}]}", stdout);
    }

    @Test
    void sevenRunesCostOneHundredSeventyFiveBase() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},"
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},"
                + "{\"type\":\"rune\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":198}]}", stdout);
    }

    @Test
    void mixedComponentTypesDoNotFormABlock() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"moonstone\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":88}]}", stdout);
    }

    @Test
    void eachComponentTypeFormsItsOwnBlock() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},"
                + "{\"type\":\"moonstone\"},{\"type\":\"moonstone\"},"
                + "{\"type\":\"moonstone\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":137}]}", stdout);
    }

    // ---------- item-specific modifiers ----------

    @Test
    void cursedItemAddsFiftyPercentRiskSurcharge() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":true}]}]}");

        assertEquals("{\"results\":[{\"premium\":165}]}", stdout);
    }

    @Test
    void enchantmentFiveAddsHighEnchantmentSurcharge() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":5,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":145}]}", stdout);
    }

    @Test
    void enchantmentFourAddsNoHighEnchantmentSurcharge() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":4,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":115}]}", stdout);
    }

    @Test
    void cursedAndHighlyEnchantedItemAddsBothSurcharges() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":5,\"cursed\":true}]}]}");

        assertEquals("{\"results\":[{\"premium\":195}]}", stdout);
    }

    @Test
    void itemSurchargeAppliesOnlyToTheAffectedItemsBasePremium() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":true},"
                + "{\"type\":\"amulet\",\"material\":\"silver\",\"enchantment\":1,\"cursed\":false}]}]}");

        // policy base 160 + 50 curse (on the sword's 100 alone) = 210,
        // + 16 first insurance (on the 160 policy base) + 5 fee = 231
        assertEquals("{\"results\":[{\"premium\":231}]}", stdout);
    }

    // ---------- policy-wide modifiers ----------

    @Test
    void twoYearsWithMhpcoGrantsLoyaltyDiscount() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":2},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]}]}");

        // 100 base + 10 first insurance - 20 loyalty + 5 fee = 95
        assertEquals("{\"results\":[{\"premium\":95}]}", stdout);
    }

    @Test
    void oneYearWithMhpcoGrantsNoLoyaltyDiscount() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":1},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":115}]}", stdout);
    }

    @Test
    void firstInsuranceSurchargeAppliesToEveryQuote() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"amulet\",\"material\":\"silver\",\"enchantment\":1,\"cursed\":false},"
                + "{\"type\":\"potion\",\"material\":\"glass\",\"enchantment\":0,\"cursed\":false}]}]}");

        // policy base 100 + 10 first insurance + 5 fee = 115
        assertEquals("{\"results\":[{\"premium\":115}]}", stdout);
    }

    @Test
    void followUpContractGrantsFifteenPercentDiscount() {
        String plainSword = "{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}";

        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[" + plainSword + "]},"
                + "{\"op\":\"quote\",\"items\":[" + plainSword + "]}]}");

        // second contract: 100 base + 10 first insurance - 15 follow-up + 5 fee = 100
        assertEquals("{\"results\":[{\"premium\":115},{\"premium\":100}]}", stdout);
    }

    @Test
    void everyContractAfterTheFirstGetsTheFollowUpDiscount() {
        String plainSword = "{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}";

        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[" + plainSword + "]},"
                + "{\"op\":\"quote\",\"items\":[" + plainSword + "]},"
                + "{\"op\":\"quote\",\"items\":[" + plainSword + "]}]}");

        assertEquals("{\"results\":[{\"premium\":115},{\"premium\":100},{\"premium\":100}]}",
                stdout);
    }

    // ---------- rounding ----------

    @Test
    void premiumRoundsUpInTheOfficesFavor() {
        // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"moonstone\"},{\"type\":\"moonstone\"},{\"type\":\"moonstone\"},"
                + "{\"type\":\"moonstone\"},{\"type\":\"moonstone\"},{\"type\":\"moonstone\"},"
                + "{\"type\":\"moonstone\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":198}]}", stdout);
    }

    @Test
    void payoutRoundsDownInTheOfficesFavor() {
        // half of 901 = 450.5, less the 100 deductible = 350.5 -> 350
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":9,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":901}]}}]}");

        assertEquals("{\"results\":[{\"premium\":145},"
                + "{\"payout\":350,\"remainingCap\":1650}]}", stdout);
    }

    @Test
    void intermediateAmountsAreNotRoundedDuringPremiumCalculation() {
        // 25 base + 2.5 first insurance - 5 loyalty + 5 fee = 27.5 -> 28.
        // Rounding the 2.5 surcharge on its own would give 29 instead.
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":5},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"rune\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":28}]}", stdout);
    }

    // ---------- integration premium examples ----------

    @Test
    void newcomerWithCursedSwordPays165() {
        // 100 base + 50 curse + 10 first insurance = 160, + 5 fee = 165
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":true}]}]}");

        assertEquals("{\"results\":[{\"premium\":165}]}", stdout);
    }

    @Test
    void longStandingCustomersSecondContractPays160() {
        // second contract: 100 base + 50 curse + 30 high enchantment
        // - 20 loyalty + 10 first insurance - 15 follow-up = 155, + 5 fee = 160
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":3},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"potion\"}]},"
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":7,\"cursed\":true}]}]}");

        assertEquals("{\"results\":[{\"premium\":41},{\"premium\":160}]}", stdout);
    }

    // ---------- claim basics ----------

    @Test
    void standardDamageIsReimbursedMinusTheDeductible() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":500}]}}]}");

        // 500 damage - 100 deductible = 400; cap 2000 - 400 = 1600 remaining
        assertEquals("{\"results\":[{\"premium\":115},"
                + "{\"payout\":400,\"remainingCap\":1600}]}", stdout);
    }

    @Test
    void componentDamageIsReimbursedMinusTheDeductible() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"rune\"}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"fire\","
                + "\"damages\":[{\"itemType\":\"rune\",\"amount\":200}]}}]}");

        // rune insurance value 250 -> cap 500; 200 damage - 100 deductible = 100
        assertEquals("{\"results\":[{\"premium\":33},"
                + "{\"payout\":100,\"remainingCap\":400}]}", stdout);
    }

    @Test
    void damageBelowTheDeductibleYieldsNoPayout() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"clumsiness\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":50}]}}]}");

        assertEquals("{\"results\":[{\"premium\":115},"
                + "{\"payout\":0,\"remainingCap\":2000}]}", stdout);
    }

    @Test
    void highEnchantmentDamageIsReimbursedAtHalf() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":9,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":1000}]}}]}");

        // 50 % of 1000 = 500, then the 100 deductible -> 400
        assertEquals("{\"results\":[{\"premium\":145},"
                + "{\"payout\":400,\"remainingCap\":1600}]}", stdout);
    }

    @Test
    void enchantmentSevenGetsNoHalvingClause() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":7,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":1000}]}}]}");

        assertEquals("{\"results\":[{\"premium\":145},"
                + "{\"payout\":900,\"remainingCap\":1100}]}", stdout);
    }

    @Test
    void dragonMaterialDamageIsFullyReimbursedBeforeDeductible() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"dragon\","
                + "\"enchantment\":5,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":800}]}}]}");

        assertEquals("{\"results\":[{\"premium\":145},"
                + "{\"payout\":700,\"remainingCap\":1300}]}", stdout);
    }

    @Test
    void enchantmentEightHalvingWinsOverDragonMaterial() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"dragon\","
                + "\"enchantment\":8,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":1000}]}}]}");

        assertEquals("{\"results\":[{\"premium\":145},"
                + "{\"payout\":400,\"remainingCap\":1600}]}", stdout);
    }

    @Test
    void halvingClauseWinsWhenBothClausesApply() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"dragon\","
                + "\"enchantment\":9,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":1000}]}}]}");

        // both clauses apply; the 50 % rule wins, then the deductible
        assertEquals("{\"results\":[{\"premium\":145},"
                + "{\"payout\":400,\"remainingCap\":1600}]}", stdout);
    }

    @Test
    void theDeductibleAppliesOncePerDamageEntry() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":false},"
                + "{\"type\":\"amulet\",\"material\":\"silver\",\"enchantment\":1,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":500},"
                + "{\"itemType\":\"amulet\",\"amount\":300}]}}]}");

        // 400 + 200 = 600; cap 3200 - 600 = 2600
        assertEquals("{\"results\":[{\"premium\":181},"
                + "{\"payout\":600,\"remainingCap\":2600}]}", stdout);
    }

    // ---------- insurance sum and cap ----------

    @Test
    void capIsTwiceTheSumOfTheItemsInsuranceValues() {
        // insurance sum 1000 + 600 = 1600, so the cap is 3200: a 5000 G damage
        // is reduced to the cap even though 4900 would otherwise be reimbursed
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":false},"
                + "{\"type\":\"amulet\",\"material\":\"silver\",\"enchantment\":1,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":5000}]}}]}");

        assertEquals("{\"results\":[{\"premium\":181},"
                + "{\"payout\":3200,\"remainingCap\":0}]}", stdout);
    }

    @Test
    void twoItemsOfTheSameTypeBothCountTowardTheInsuranceSum() {
        String sword = "{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}";

        // insurance sum 2 x 1000 = 2000, so the cap is 4000
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[" + sword + "," + sword + "]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":5000}]}}]}");

        assertEquals("{\"results\":[{\"premium\":225},"
                + "{\"payout\":4000,\"remainingCap\":0}]}", stdout);
    }

    @Test
    void theComponentBlockDiscountDoesNotReduceTheInsuranceSum() {
        // premium 100 + 60 (block) = 160 base, + 16 + 5 = 181;
        // insurance sum 1000 + 3 x 250 = 1750, so the cap is 3500
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\",\"enchantment\":3,\"cursed\":false},"
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":5000}]}}]}");

        assertEquals("{\"results\":[{\"premium\":181},"
                + "{\"payout\":3500,\"remainingCap\":0}]}", stdout);
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        // premium 165 with the curse surcharge, but the cap stays 2 x 1000
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":true}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":5000}]}}]}");

        assertEquals("{\"results\":[{\"premium\":165},"
                + "{\"payout\":2000,\"remainingCap\":0}]}", stdout);
    }

    @Test
    void firstClaimReportsTheRemainingCap() {
        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":1500}]}}]}");

        assertEquals("{\"results\":[{\"premium\":115},"
                + "{\"payout\":1400,\"remainingCap\":600}]}", stdout);
    }

    @Test
    void successiveClaimsExhaustTheCap() {
        String claim1500 = "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":1500}]}}";

        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}]},"
                + claim1500 + "," + claim1500 + "]}");

        // first claim takes 1400 of the 2000 cap; the second is reduced to 600
        assertEquals("{\"results\":[{\"premium\":115},"
                + "{\"payout\":1400,\"remainingCap\":600},"
                + "{\"payout\":600,\"remainingCap\":0}]}", stdout);
    }

    @Test
    void twoDamageEntriesOfTheSameTypeAreTreatedSeparately() {
        String sword = "{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}";

        String stdout = runOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[" + sword + "," + sword + "]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":500},"
                + "{\"itemType\":\"sword\",\"amount\":500}]}}]}");

        // each entry is a separate damage with its own deductible: 400 + 400
        assertEquals("{\"results\":[{\"premium\":225},"
                + "{\"payout\":800,\"remainingCap\":3200}]}", stdout);
    }

    // ---------- rejections (non-zero exit, stderr description, no results) ----------

    @Test
    void unknownItemTypeInAQuoteIsRejected() {
        Outcome outcome = reportOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"broomstick\"}]}]}");

        assertNotEquals(0, outcome.status(), "the office must reject the scenario");
        assertFalse(outcome.stderr().isBlank(), "the office must describe the rejection");
        assertFalse(outcome.stdout().contains("results"), "no results may be written");
    }

    @Test
    void claimForAnUninsuredItemTypeIsRejected() {
        Outcome outcome = reportOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"fire\","
                + "\"damages\":[{\"itemType\":\"amulet\",\"amount\":300}]}}]}");

        assertNotEquals(0, outcome.status(), "the office must reject the claim");
        assertFalse(outcome.stderr().isBlank(), "the office must describe the rejection");
    }

    @Test
    void claimForAnUnknownItemTypeIsRejected() {
        Outcome outcome = reportOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"fire\","
                + "\"damages\":[{\"itemType\":\"broomstick\",\"amount\":300}]}}]}");

        assertNotEquals(0, outcome.status(), "the office must reject the claim");
        assertFalse(outcome.stderr().isBlank(), "the office must describe the rejection");
    }

    @Test
    void moreDamagesOfATypeThanInsuredItemsIsRejected() {
        Outcome outcome = reportOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"dragon\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":500},"
                + "{\"itemType\":\"sword\",\"amount\":500}]}}]}");

        assertNotEquals(0, outcome.status(), "the whole claim must be rejected");
        assertFalse(outcome.stderr().isBlank(), "the office must describe the rejection");
    }

    @Test
    void negativeDamageAmountIsRejected() {
        Outcome outcome = reportOffice("{\"customer\":{\"yearsWithMHPCO\":0},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"fraud\","
                + "\"damages\":[{\"itemType\":\"sword\",\"amount\":-200}]}}]}");

        assertNotEquals(0, outcome.status(), "the office must reject the claim");
        assertFalse(outcome.stderr().isBlank(), "the office must describe the rejection");
    }

    // ---------- CLI protocol ----------

    @Test
    void resultsMirrorTheStepsInOrderAndShape() {
        // the schema's own example: a quote result then a claim result
        Outcome outcome = executeClaimOffice("{\"customer\":{\"yearsWithMHPCO\":5},\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"amulet\",\"material\":\"silver\","
                + "\"enchantment\":2,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{\"cause\":\"fire\","
                + "\"damages\":[{\"itemType\":\"amulet\",\"amount\":200}]}}]}");

        assertEquals(0, outcome.status(), outcome.stderr());
        // 60 base + 6 first insurance - 12 loyalty + 5 fee = 59; 200 - 100 = 100
        assertEquals("{\"results\":[{\"premium\":59},"
                + "{\"payout\":100,\"remainingCap\":1100}]}", outcome.stdout().trim());
    }

    @Test
    void successfulRunWritesOnlyTheResultsJson() {
        Outcome outcome = executeClaimOffice("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"staff\","
                + "\"material\":\"oak\",\"enchantment\":1,\"cursed\":false}]}]}");

        assertEquals(0, outcome.status(), outcome.stderr());
        assertTrue(outcome.stderr().isEmpty(), "the office must write nothing to stderr");
        assertEquals("{\"results\":[{\"premium\":93}]}", outcome.stdout().trim());
        assertTrue(outcome.stdout().trim().startsWith("{\"results\""),
                "stdout must hold nothing but the results document");
    }
}
