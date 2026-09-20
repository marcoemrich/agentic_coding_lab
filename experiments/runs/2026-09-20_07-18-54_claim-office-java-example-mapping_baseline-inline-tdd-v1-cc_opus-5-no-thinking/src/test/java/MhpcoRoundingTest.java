import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class MhpcoRoundingTest {

    @Test
    void premiumOf197Point5RoundsUpTo198() {
        assertEquals(198, MhpcoRounding.premium(new BigDecimal("197.5")));
    }

    @Test
    void premiumRoundsUpEvenForSmallFractions() {
        assertEquals(198, MhpcoRounding.premium(new BigDecimal("197.01")));
    }

    @Test
    void wholePremiumStaysUnchanged() {
        assertEquals(197, MhpcoRounding.premium(new BigDecimal("197")));
    }

    @Test
    void payoutOf350Point5RoundsDownTo350() {
        assertEquals(350, MhpcoRounding.payout(new BigDecimal("350.5")));
    }

    @Test
    void payoutRoundsDownEvenForLargeFractions() {
        assertEquals(350, MhpcoRounding.payout(new BigDecimal("350.99")));
    }

    @Test
    void wholePayoutStaysUnchanged() {
        assertEquals(350, MhpcoRounding.payout(new BigDecimal("350")));
    }
}
