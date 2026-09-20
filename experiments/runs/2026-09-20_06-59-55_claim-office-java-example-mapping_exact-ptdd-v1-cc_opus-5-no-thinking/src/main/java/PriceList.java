import java.util.Map;

/** The MHPCO price list: what each kind of item is insured for and what it costs to insure. */
final class PriceList {

    private record Entry(int insuranceValue, int basePremium) {
    }

    private static final Map<String, Entry> ENTRIES = Map.of(
            "sword", new Entry(1000, 100),
            "amulet", new Entry(600, 60),
            "staff", new Entry(800, 80),
            "potion", new Entry(400, 40),
            "rune", new Entry(250, 25),
            "moonstone", new Entry(250, 25));

    private PriceList() {
    }

    static boolean lists(String type) {
        return ENTRIES.containsKey(type);
    }

    static int insuranceValueOf(String type) {
        return entryFor(type).insuranceValue();
    }

    static int basePremiumOf(String type) {
        return entryFor(type).basePremium();
    }

    private static Entry entryFor(String type) {
        return ENTRIES.get(type);
    }
}
