import java.util.Map;

/** The MHPCO price list: insurance values and base premiums per item type. */
final class PriceList {

    private static final Map<String, Entry> ENTRIES = Map.of(
            "sword", new Entry(1000, 100),
            "amulet", new Entry(600, 60),
            "staff", new Entry(800, 80),
            "potion", new Entry(400, 40),
            "rune", new Entry(250, 25),
            "moonstone", new Entry(250, 25));

    private PriceList() {
    }

    static int basePremium(String type) {
        return entry(type).basePremium();
    }

    static int insuranceValue(String type) {
        return entry(type).insuranceValue();
    }

    private static Entry entry(String type) {
        Entry entry = ENTRIES.get(type);
        if (entry == null) {
            throw new ClaimOfficeException("unknown item type: " + type);
        }
        return entry;
    }

    private record Entry(int insuranceValue, int basePremium) {
    }
}
