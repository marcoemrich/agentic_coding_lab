import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

class PremiumTest {

    private static Item plain(String type) {
        return new Item(type, null, 0, false);
    }

    private static List<Item> runes(int count) {
        List<Item> items = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            items.add(plain("rune"));
        }
        return items;
    }

    private static void assertAmount(String expected, BigDecimal actual) {
        assertEquals(0, new BigDecimal(expected).compareTo(actual), "expected " + expected + " but was " + actual);
    }

    @Test
    void mainItemsHaveBasePremiumsFromPriceList() {
        assertAmount("100", Policy.basePremium(List.of(plain("sword"))));
        assertAmount("60", Policy.basePremium(List.of(plain("amulet"))));
        assertAmount("80", Policy.basePremium(List.of(plain("staff"))));
        assertAmount("40", Policy.basePremium(List.of(plain("potion"))));
    }

    @Test
    void componentsCost25EachOutsideOfBlocks() {
        assertAmount("25", Policy.basePremium(List.of(plain("rune"))));
        assertAmount("50", Policy.basePremium(List.of(plain("rune"), plain("rune"))));
        assertAmount("25", Policy.basePremium(List.of(plain("moonstone"))));
    }

    @Test
    void blockOfThreeAlikeComponentsCosts60() {
        assertAmount("50", Policy.basePremium(runes(2)));
        assertAmount("60", Policy.basePremium(runes(3)));
        assertAmount("100", Policy.basePremium(runes(4)));
        assertAmount("175", Policy.basePremium(runes(7)));
    }

    @Test
    void blocksRequireComponentsOfExactlySameType() {
        List<Item> twoRunesOneMoonstone = List.of(plain("rune"), plain("rune"), plain("moonstone"));
        assertAmount("75", Policy.basePremium(twoRunesOneMoonstone));

        List<Item> threeAndThree = new ArrayList<>(runes(3));
        threeAndThree.addAll(List.of(plain("moonstone"), plain("moonstone"), plain("moonstone")));
        assertAmount("120", Policy.basePremium(threeAndThree));
    }

    @Test
    void emptyItemListHasZeroBasePremium() {
        assertAmount("0", Policy.basePremium(List.of()));
    }
}
