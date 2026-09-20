import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

/**
 * Test list for the MHPCO Claim Office kata.
 *
 * Observable contract adopted for rejection cases: the specification says the
 * CLI "exits with a non-zero status code and writes an error description to
 * stderr". The most defensible in-process reading is that the scenario engine
 * signals rejection by throwing an exception, which ClaimOfficeCli translates
 * into exit status 1 plus a stderr message and no stdout results. Tests assert
 * the thrown rejection at the engine boundary, plus one CLI-level test that the
 * translation to a non-zero status and stderr actually happens.
 */
class ClaimOfficeTest {

    // --- Base premiums per item type (price list) ---

    @Test
    void emptyItemListCostsOnlyTheProcessingFee() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[]}]}");

        assertEquals("{\"results\":[{\"premium\":5}]}", output);
    }

    @Test
    void swordHasBasePremium100() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"sword\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":115}]}", output);
    }

    @Test
    void amuletHasBasePremium60() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"amulet\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":71}]}", output);
    }

    @Test
    void staffHasBasePremium80() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"staff\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":93}]}", output);
    }

    @Test
    void potionHasBasePremium40() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"potion\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":49}]}", output);
    }

    @Test
    void runeHasBasePremium25() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"rune\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":33}]}", output);
    }

    @Test
    void moonstoneHasBasePremium25() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"moonstone\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":33}]}", output);
    }

    @Test
    void policyBasePremiumIsTheSumOfItemBasePremiums() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\"},{\"type\":\"amulet\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":181}]}", output);
    }

    // --- Component building blocks ---

    @Test
    void twoRunesCostFiftyBase() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":60}]}", output);
    }

    @Test
    void threeRunesFormABlockCostingSixtyBase() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":71}]}", output);
    }

    @Test
    void fourRunesCostOneHundredBase() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},"
                + "{\"type\":\"rune\"},{\"type\":\"rune\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":115}]}", output);
    }

    @Test
    void sevenRunesCostOneHundredSeventyFiveBase() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":198}]}", output);
    }

    @Test
    void mixedComponentTypesFormNoBlock() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},"
                + "{\"type\":\"moonstone\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":88}]}", output);
    }

    @Test
    void eachComponentTypeFormsItsOwnBlock() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},"
                + "{\"type\":\"moonstone\"},{\"type\":\"moonstone\"},"
                + "{\"type\":\"moonstone\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":137}]}", output);
    }

    // --- Item-specific modifiers ---

    @Test
    void cursedItemAddsFiftyPercentSurcharge() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":true}]}]}");

        assertEquals("{\"results\":[{\"premium\":165}]}", output);
    }

    @Test
    void enchantmentFiveAddsHighEnchantmentSurcharge() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":5,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":145}]}", output);
    }

    @Test
    void enchantmentFourAddsNoHighEnchantmentSurcharge() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":4,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":115}]}", output);
    }

    @Test
    void cursedAndHighlyEnchantedItemGetsBothSurcharges() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":5,\"cursed\":true}]}]}");

        assertEquals("{\"results\":[{\"premium\":195}]}", output);
    }

    @Test
    void itemModifiersApplyOnlyToTheAffectedItemsBasePremium() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":true},"
                + "{\"type\":\"amulet\",\"material\":\"silver\","
                + "\"enchantment\":1,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":231}]}", output);
    }

    // --- Policy-wide modifiers ---

    @Test
    void twoYearsWithMhpcoGrantsLoyaltyDiscount() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":2},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":95}]}", output);
    }

    @Test
    void oneYearWithMhpcoGrantsNoLoyaltyDiscount() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":1},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":115}]}", output);
    }

    @Test
    void firstInsuranceSurchargeAppliesToEveryQuote() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":3},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"amulet\","
                + "\"material\":\"silver\",\"enchantment\":1,\"cursed\":false}]}]}");

        assertEquals("{\"results\":[{\"premium\":59}]}", output);
    }

    @Test
    void secondContractGetsFollowUpDiscount() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":3},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"potion\"}]},"
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":7,\"cursed\":true}]}]}");

        assertEquals("{\"results\":[{\"premium\":41},{\"premium\":160}]}", output);
    }

    @Test
    void thirdContractAlsoGetsFollowUpDiscount() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"amulet\"}]},"
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"amulet\"}]},"
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"amulet\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":71},{\"premium\":62},"
                + "{\"premium\":62}]}", output);
    }

    @Test
    void processingFeeIsAddedAtTheVeryEnd() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":2},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"amulet\"}]},"
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"amulet\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":59},{\"premium\":50}]}", output);
    }

    // --- Rounding ---

    @Test
    void premiumIsRoundedUp() {
        // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 G
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"},{\"type\":\"rune\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":198}]}", output);
    }

    @Test
    void onlyTheFinalPremiumIsRounded() {
        // second quote, 2-year customer, one moonstone:
        // 25 base + 2.5 first insurance - 5 loyalty - 3.75 follow-up = 18.75
        // + 5 fee = 23.75 -> 24 G; rounding each term separately would give 25 G
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":2},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"potion\"}]},"
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"moonstone\"}]}]}");

        assertEquals("{\"results\":[{\"premium\":41},{\"premium\":24}]}", output);
    }

    // --- Integration examples ---

    @Test
    void newcomerWithCursedSwordPays165() {
        // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165 G
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":true}]}]}");

        assertEquals("{\"results\":[{\"premium\":165}]}", output);
    }

    @Test
    void longStandingCustomersSecondContractPays160() {
        // 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first
        // insurance - 15 follow-up = 155 + 5 fee = 160 G
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":3},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"amulet\"}]},"
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":7,\"cursed\":true}]}]}");

        assertEquals("{\"results\":[{\"premium\":59},{\"premium\":160}]}", output);
    }

    // --- Claims: standard reimbursement and deductible ---

    @Test
    void standardDamageIsReimbursedMinusDeductible() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":500}]}}]}");

        assertEquals("{\"results\":[{\"premium\":115},"
                + "{\"payout\":400,\"remainingCap\":1600}]}", output);
    }

    @Test
    void componentDamageIsReimbursedMinusDeductible() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"rune\"}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"rune\",\"amount\":200}]}}]}");

        assertEquals("{\"results\":[{\"premium\":33},"
                + "{\"payout\":100,\"remainingCap\":400}]}", output);
    }

    @Test
    void damageBelowTheDeductibleYieldsNoPayout() {
        // Reading adopted: the spec defines no negative payout, so a damage
        // below the deductible reimburses nothing and consumes no cap.
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":50}]}}]}");

        assertEquals("{\"results\":[{\"premium\":115},"
                + "{\"payout\":0,\"remainingCap\":2000}]}", output);
    }

    @Test
    void deductibleAppliesPerDamagedItem() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false},"
                + "{\"type\":\"amulet\",\"material\":\"silver\","
                + "\"enchantment\":1,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"dragon attack\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":500},"
                + "{\"itemType\":\"amulet\",\"amount\":300}]}}]}");

        assertEquals("{\"results\":[{\"premium\":181},"
                + "{\"payout\":600,\"remainingCap\":2600}]}", output);
    }

    // --- Claims: special clauses ---

    @Test
    void highEnchantmentDamageIsHalved() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":9,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":1000}]}}]}");

        assertEquals("{\"results\":[{\"premium\":145},"
                + "{\"payout\":400,\"remainingCap\":1600}]}", output);
    }

    @Test
    void dragonMaterialDamageIsFullyReimbursed() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"dragon\",\"enchantment\":5,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":800}]}}]}");

        assertEquals("{\"results\":[{\"premium\":145},"
                + "{\"payout\":700,\"remainingCap\":1300}]}", output);
    }

    @Test
    void highEnchantmentWinsOverDragonMaterial() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"dragon\",\"enchantment\":9,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":1000}]}}]}");

        assertEquals("{\"results\":[{\"premium\":145},"
                + "{\"payout\":400,\"remainingCap\":1600}]}", output);
    }

    @Test
    void enchantmentEightTriggersTheHalvingClause() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"dragon\",\"enchantment\":8,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":1000}]}}]}");

        assertEquals("{\"results\":[{\"premium\":145},"
                + "{\"payout\":400,\"remainingCap\":1600}]}", output);
    }

    // --- Claims: payout rounding ---

    @Test
    void payoutIsRoundedDown() {
        // enchantment 9 sword, damage 901: 450.5 halved - 100 deductible = 350.5
        // -> payout 350 G; the cap keeps the unrounded 1649.5, reported as 1649
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":9,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":901}]}}]}");

        assertEquals("{\"results\":[{\"premium\":145},"
                + "{\"payout\":350,\"remainingCap\":1649}]}", output);
    }

    // --- Claims: insurance sum and cap ---

    @Test
    void capIsTwiceTheInsuranceSumOfAllItems() {
        // sword 1000 + amulet 600 = 1600 insurance sum, cap 3200;
        // a 200 G damage pays 100 G and leaves 3100 G of cap
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false},"
                + "{\"type\":\"amulet\",\"material\":\"silver\","
                + "\"enchantment\":1,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":200}]}}]}");

        assertEquals("{\"results\":[{\"premium\":181},"
                + "{\"payout\":100,\"remainingCap\":3100}]}", output);
    }

    @Test
    void premiumModifiersDoNotRaiseTheCap() {
        // cursed sword: premium 165 G, but the cap stays 2 x 1000 G
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":true}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":2200}]}}]}");

        assertEquals("{\"results\":[{\"premium\":165},"
                + "{\"payout\":2000,\"remainingCap\":0}]}", output);
    }

    @Test
    void blockDiscountDoesNotLowerTheInsuranceSum() {
        // premium base 100 + 60 (rune block) = 160 -> 181 G
        // insurance sum 1000 + 3 x 250 = 1750 G, cap 3500 G
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false},"
                + "{\"type\":\"rune\"},{\"type\":\"rune\"},"
                + "{\"type\":\"rune\"}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":200}]}}]}");

        assertEquals("{\"results\":[{\"premium\":181},"
                + "{\"payout\":100,\"remainingCap\":3400}]}", output);
    }

    @Test
    void firstClaimReportsTheRemainingCap() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":1500}]}}]}");

        assertEquals("{\"results\":[{\"premium\":115},"
                + "{\"payout\":1400,\"remainingCap\":600}]}", output);
    }

    @Test
    void successiveClaimIsLimitedByTheRemainingCap() {
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":1500}]}},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"theft\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":1500}]}}]}");

        assertEquals("{\"results\":[{\"premium\":115},"
                + "{\"payout\":1400,\"remainingCap\":600},"
                + "{\"payout\":600,\"remainingCap\":0}]}", output);
    }

    // --- Claims: multiple items of the same type ---

    @Test
    void twoSwordsDoubleTheInsuranceSum() {
        // insurance sum 2 x 1000 = 2000 G, cap 4000 G
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false},"
                + "{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":200}]}}]}");

        assertEquals("{\"results\":[{\"premium\":225},"
                + "{\"payout\":100,\"remainingCap\":3900}]}", output);
    }

    @Test
    void repeatedDamageEntriesAreSeparateDamagesWithOwnDeductibles() {
        // two damages of 500 G: (500 - 100) + (500 - 100) = 800 G
        String output = ClaimOffice.run("{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false},"
                + "{\"type\":\"sword\",\"material\":\"steel\","
                + "\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"dragon attack\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":500},"
                + "{\"itemType\":\"sword\",\"amount\":500}]}}]}");

        assertEquals("{\"results\":[{\"premium\":225},"
                + "{\"payout\":800,\"remainingCap\":3200}]}", output);
    }

    @Test
    void moreDamageEntriesThanInsuredItemsIsRejected() {
        String scenario = "{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"dragon attack\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":500},"
                + "{\"itemType\":\"sword\",\"amount\":500}]}}]}";

        assertThrows(IllegalArgumentException.class, () -> ClaimOffice.run(scenario));
    }

    // --- Rejections ---

    @Test
    void unknownItemTypeIsRejected() {
        String scenario = "{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"broomstick\"}]}]}";

        assertThrows(IllegalArgumentException.class, () -> ClaimOffice.run(scenario));
    }

    @Test
    void damageToAnItemNotInThePolicyIsRejected() {
        String scenario = "{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"amulet\",\"amount\":200}]}}]}";

        assertThrows(IllegalArgumentException.class, () -> ClaimOffice.run(scenario));
    }

    @Test
    void damageWithUnknownItemTypeIsRejected() {
        String scenario = "{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"broomstick\",\"amount\":200}]}}]}";

        assertThrows(IllegalArgumentException.class, () -> ClaimOffice.run(scenario));
    }

    @Test
    void negativeDamageAmountIsRejected() {
        String scenario = "{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"sword\","
                + "\"material\":\"steel\",\"enchantment\":3,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"sword\",\"amount\":-200}]}}]}";

        assertThrows(IllegalArgumentException.class, () -> ClaimOffice.run(scenario));
    }

    // --- CLI adapter ---

    @Test
    void cliTranslatesStdinScenarioToStdoutResults() {
        String scenario = "{\"customer\":{\"yearsWithMHPCO\":5},"
                + "\"steps\":["
                + "{\"op\":\"quote\",\"items\":[{\"type\":\"amulet\","
                + "\"material\":\"silver\",\"enchantment\":2,\"cursed\":false}]},"
                + "{\"op\":\"claim\",\"policy\":0,\"incident\":{"
                + "\"cause\":\"fire\",\"damages\":["
                + "{\"itemType\":\"amulet\",\"amount\":200}]}}]}";
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayOutputStream err = new ByteArrayOutputStream();

        int status = ClaimOfficeCli.run(
                new ByteArrayInputStream(scenario.getBytes(StandardCharsets.UTF_8)),
                new PrintStream(out, true, StandardCharsets.UTF_8),
                new PrintStream(err, true, StandardCharsets.UTF_8));

        assertEquals(0, status);
        assertEquals("{\"results\":[{\"premium\":59},"
                + "{\"payout\":100,\"remainingCap\":1100}]}",
                out.toString(StandardCharsets.UTF_8).trim());
    }

    @Test
    void cliReportsRejectionOnStderrWithNonZeroStatus() throws Exception {
        String scenario = "{\"customer\":{\"yearsWithMHPCO\":0},"
                + "\"steps\":[{\"op\":\"quote\",\"items\":["
                + "{\"type\":\"broomstick\"}]}]}";
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayOutputStream err = new ByteArrayOutputStream();

        int status = ClaimOfficeCli.run(
                new ByteArrayInputStream(scenario.getBytes(StandardCharsets.UTF_8)),
                new PrintStream(out, true, StandardCharsets.UTF_8),
                new PrintStream(err, true, StandardCharsets.UTF_8));

        assertNotEquals(0, status);
        assertEquals("", out.toString(StandardCharsets.UTF_8));
        assertTrue(err.toString(StandardCharsets.UTF_8).contains("broomstick"));
    }
}
