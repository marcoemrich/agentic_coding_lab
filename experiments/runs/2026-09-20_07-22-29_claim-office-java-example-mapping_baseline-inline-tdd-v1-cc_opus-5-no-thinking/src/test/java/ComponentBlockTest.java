import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

/** The block of 3 alike components costs 60 G instead of 3 x 25 G. */
class ComponentBlockTest {

    private static Item component(String type) {
        return new Item(type, null, 0, false);
    }

    private static int basePremiumOf(String... types) {
        return Premium.policyBasePremium(List.of(types).stream().map(ComponentBlockTest::component).toList())
                .intValueExact();
    }

    @Test
    void twoRunesCostFullPrice() {
        assertEquals(50, basePremiumOf("rune", "rune"));
    }

    @Test
    void threeRunesFormABlock() {
        assertEquals(60, basePremiumOf("rune", "rune", "rune"));
    }

    @Test
    void fourRunesAreNoBlockBecauseTheBlockRequiresExactlyThree() {
        assertEquals(100, basePremiumOf("rune", "rune", "rune", "rune"));
    }

    @Test
    void sevenRunesAreNoBlock() {
        assertEquals(175, basePremiumOf("rune", "rune", "rune", "rune", "rune", "rune", "rune"));
    }

    @Test
    void differentComponentTypesDoNotFormABlock() {
        assertEquals(75, basePremiumOf("rune", "rune", "moonstone"));
    }

    @Test
    void eachComponentTypeFormsItsOwnBlock() {
        assertEquals(120, basePremiumOf(
                "rune", "rune", "rune", "moonstone", "moonstone", "moonstone"));
    }

    @Test
    void mainItemsAreSummedAtTheirBasePremium() {
        assertEquals(160, basePremiumOf("sword", "amulet"));
    }

    @Test
    void theBlockDiscountAppliesNextToMainItems() {
        assertEquals(160, basePremiumOf("sword", "rune", "rune", "rune"));
    }
}
