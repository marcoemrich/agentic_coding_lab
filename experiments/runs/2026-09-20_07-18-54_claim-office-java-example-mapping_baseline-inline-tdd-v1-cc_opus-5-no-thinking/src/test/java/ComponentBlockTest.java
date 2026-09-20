import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

class ComponentBlockTest {

    private static Item component(String type) {
        return new Item(type, null, null, false);
    }

    private static int componentPremium(String... types) {
        return ComponentBlocks.basePremium(List.of(types).stream()
                .map(ComponentBlockTest::component)
                .toList());
    }

    @Test
    void twoRunesCostFifty() {
        assertEquals(50, componentPremium("rune", "rune"));
    }

    @Test
    void threeRunesFormABlockAndCostSixty() {
        assertEquals(60, componentPremium("rune", "rune", "rune"));
    }

    @Test
    void fourRunesCostOneHundredBecauseTheBlockNeedsExactlyThree() {
        assertEquals(100, componentPremium("rune", "rune", "rune", "rune"));
    }

    @Test
    void sevenRunesCostOneHundredSeventyFive() {
        assertEquals(175, componentPremium("rune", "rune", "rune", "rune", "rune", "rune", "rune"));
    }

    @Test
    void differentComponentTypesDoNotFormABlock() {
        assertEquals(75, componentPremium("rune", "rune", "moonstone"));
    }

    @Test
    void twoBlocksOfDifferentTypesAreBothDiscounted() {
        assertEquals(120, componentPremium(
                "rune", "rune", "rune", "moonstone", "moonstone", "moonstone"));
    }

    @Test
    void noComponentsCostNothing() {
        assertEquals(0, componentPremium());
    }
}
