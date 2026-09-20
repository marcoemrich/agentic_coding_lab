import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class PriceListTest {

    @Test
    void swordHasValue1000AndBasePremium100() {
        assertEquals(1000, PriceList.insuranceValue("sword"));
        assertEquals(100, PriceList.basePremium("sword"));
    }

    @Test
    void amuletHasValue600AndBasePremium60() {
        assertEquals(600, PriceList.insuranceValue("amulet"));
        assertEquals(60, PriceList.basePremium("amulet"));
    }

    @Test
    void staffHasValue800AndBasePremium80() {
        assertEquals(800, PriceList.insuranceValue("staff"));
        assertEquals(80, PriceList.basePremium("staff"));
    }

    @Test
    void potionHasValue400AndBasePremium40() {
        assertEquals(400, PriceList.insuranceValue("potion"));
        assertEquals(40, PriceList.basePremium("potion"));
    }

    @Test
    void componentsHaveValue250AndBasePremium25() {
        assertEquals(250, PriceList.insuranceValue("rune"));
        assertEquals(25, PriceList.basePremium("rune"));
        assertEquals(250, PriceList.insuranceValue("moonstone"));
        assertEquals(25, PriceList.basePremium("moonstone"));
    }

    @Test
    void runeIsAComponent() {
        assertEquals(true, PriceList.isComponent("rune"));
        assertEquals(true, PriceList.isComponent("moonstone"));
        assertEquals(false, PriceList.isComponent("sword"));
    }

    @Test
    void unknownTypeIsRejected() {
        org.junit.jupiter.api.Assertions.assertThrows(
                ClaimOfficeException.class, () -> PriceList.basePremium("broomstick"));
    }
}
