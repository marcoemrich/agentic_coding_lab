import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

/** All amounts are rounded to whole G in the MHPCO's favor, and only at the very end. */
class RoundingTest {

    @Test
    void roundsAPremiumUp() {
        assertEquals(198, Money.asPremium(new BigDecimal("197.5")));
        assertEquals(198, Money.asPremium(new BigDecimal("197.1")));
        assertEquals(197, Money.asPremium(new BigDecimal("197")));
    }

    @Test
    void roundsAPayoutDown() {
        assertEquals(350, Money.asPayout(new BigDecimal("350.5")));
        assertEquals(350, Money.asPayout(new BigDecimal("350.9")));
        assertEquals(350, Money.asPayout(new BigDecimal("350")));
    }
}
