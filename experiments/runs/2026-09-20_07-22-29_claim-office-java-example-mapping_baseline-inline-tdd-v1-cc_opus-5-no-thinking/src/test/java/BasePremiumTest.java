import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class BasePremiumTest {

    @Test
    void swordHasBasePremium100() {
        assertEquals(100, PriceList.basePremium("sword"));
    }

    @Test
    void amuletHasBasePremium60() {
        assertEquals(60, PriceList.basePremium("amulet"));
    }

    @Test
    void staffHasBasePremium80() {
        assertEquals(80, PriceList.basePremium("staff"));
    }

    @Test
    void potionHasBasePremium40() {
        assertEquals(40, PriceList.basePremium("potion"));
    }

    @Test
    void componentsHaveBasePremium25() {
        assertEquals(25, PriceList.basePremium("rune"));
        assertEquals(25, PriceList.basePremium("moonstone"));
    }

    @Test
    void swordIsInsuredFor1000() {
        assertEquals(1000, PriceList.insuranceValue("sword"));
    }

    @Test
    void amuletIsInsuredFor600() {
        assertEquals(600, PriceList.insuranceValue("amulet"));
    }

    @Test
    void staffIsInsuredFor800() {
        assertEquals(800, PriceList.insuranceValue("staff"));
    }

    @Test
    void potionIsInsuredFor400() {
        assertEquals(400, PriceList.insuranceValue("potion"));
    }

    @Test
    void componentsAreInsuredFor250() {
        assertEquals(250, PriceList.insuranceValue("rune"));
        assertEquals(250, PriceList.insuranceValue("moonstone"));
    }

    @Test
    void unknownItemTypeIsRejected() {
        assertThrows(ClaimOfficeException.class, () -> PriceList.basePremium("broomstick"));
        assertThrows(ClaimOfficeException.class, () -> PriceList.insuranceValue("broomstick"));
    }
}
