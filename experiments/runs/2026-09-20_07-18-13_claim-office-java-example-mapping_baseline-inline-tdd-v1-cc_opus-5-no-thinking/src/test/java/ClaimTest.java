import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import org.junit.jupiter.api.Test;

class ClaimTest {

    @Test
    void reimbursesTheDamageMinusTheDeductible() {
        assertEquals(400, payout(sword("steel", 3), damage("sword", 500)));
        assertEquals(100, payout(Item.of("rune"), damage("rune", 200)));
    }

    @Test
    void chargesTheDeductibleOncePerDamagedItem() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        office.quote(List.of(sword("steel", 3), new Item("amulet", "silver", 1, false)));
        Claim claim = office.claim(0, List.of(damage("sword", 500), damage("amulet", 300)));
        assertEquals(600, claim.payout());
    }

    @Test
    void halvesTheDamageOfHighlyEnchantedItems() {
        assertEquals(400, payout(sword("steel", 9), damage("sword", 1000)));
        assertEquals(400, payout(sword("steel", 8), damage("sword", 1000)));
        assertEquals(900, payout(sword("steel", 7), damage("sword", 1000)));
    }

    @Test
    void fullyReimbursesDragonMaterialUnlessHighlyEnchanted() {
        assertEquals(700, payout(sword("dragon", 5), damage("sword", 800)));
        assertEquals(400, payout(sword("dragon", 8), damage("sword", 1000)));
        assertEquals(400, payout(sword("dragon", 9), damage("sword", 1000)));
    }

    @Test
    void capsThePayoutAtTwiceTheInsuranceSum() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        office.quote(List.of(sword("steel", 3)));

        Claim first = office.claim(0, List.of(damage("sword", 1500)));
        assertEquals(1400, first.payout());
        assertEquals(600, first.remainingCap());

        Claim second = office.claim(0, List.of(damage("sword", 1500)));
        assertEquals(600, second.payout());
        assertEquals(0, second.remainingCap());
    }

    @Test
    void treatsEachDamageEntryOfTheSameTypeSeparately() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        office.quote(List.of(sword("steel", 3), sword("steel", 3)));
        Claim claim = office.claim(0, List.of(damage("sword", 500), damage("sword", 300)));
        assertEquals(600, claim.payout());
        assertEquals(3400, claim.remainingCap());
    }

    @Test
    void rejectsMoreDamagesOfATypeThanThePolicyCovers() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        office.quote(List.of(sword("steel", 3)));
        assertThrows(ScenarioException.class,
                () -> office.claim(0, List.of(damage("sword", 100), damage("sword", 100))));
    }

    @Test
    void rejectsDamageToAnItemThatIsNotInsured() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        office.quote(List.of(sword("steel", 3)));
        assertThrows(ScenarioException.class, () -> office.claim(0, List.of(damage("amulet", 100))));
        assertThrows(ScenarioException.class, () -> office.claim(0, List.of(damage("broomstick", 100))));
    }

    @Test
    void rejectsNegativeDamageAmounts() {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        office.quote(List.of(sword("steel", 3)));
        assertThrows(ScenarioException.class, () -> office.claim(0, List.of(damage("sword", -200))));
    }

    private static int payout(Item insured, Damage damage) {
        ClaimOffice office = new ClaimOffice(new Customer(0));
        office.quote(List.of(insured));
        return office.claim(0, List.of(damage)).payout();
    }

    private static Item sword(String material, int enchantment) {
        return new Item("sword", material, enchantment, false);
    }

    private static Damage damage(String itemType, int amount) {
        return new Damage(itemType, amount);
    }
}
