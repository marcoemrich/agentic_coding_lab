import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

/** The examples in the kata state base premiums in isolation, before any modifier. */
class BasePremiumTest {

    @Test
    void chargesTwentyFiveGPerLooseComponent() {
        assertEquals(50, basePremium(runes(2)));
        assertEquals(100, basePremium(runes(4)));
        assertEquals(175, basePremium(runes(7)));
    }

    @Test
    void offersABlockPriceForExactlyThreeAlikeComponents() {
        assertEquals(60, basePremium(runes(3)));
    }

    @Test
    void formsBlocksOnlyFromComponentsOfTheSameType() {
        assertEquals(75, basePremium(concat(runes(2), moonstones(1))));
        assertEquals(120, basePremium(concat(runes(3), moonstones(3))));
    }

    private static int basePremium(List<Item> items) {
        return Quote.basePremium(items).intValueExact();
    }

    static List<Item> runes(int count) {
        return copies("rune", count);
    }

    static List<Item> moonstones(int count) {
        return copies("moonstone", count);
    }

    private static List<Item> copies(String type, int count) {
        List<Item> items = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            items.add(Item.of(type));
        }
        return items;
    }

    @SafeVarargs
    static List<Item> concat(List<Item>... parts) {
        List<Item> all = new ArrayList<>();
        for (List<Item> part : parts) {
            all.addAll(part);
        }
        return all;
    }
}
