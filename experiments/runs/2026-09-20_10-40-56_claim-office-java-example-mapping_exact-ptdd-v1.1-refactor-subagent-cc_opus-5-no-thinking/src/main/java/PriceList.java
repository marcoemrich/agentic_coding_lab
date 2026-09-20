import java.math.BigDecimal;
import java.util.Map;

/**
 * The MHPCO price list: every kind of item the MHPCO insures, and what it is
 * tariffed at.
 *
 * <p>A kind of item is tariffed at an insurance value — what the MHPCO
 * undertakes to cover it for — and a base premium — what it charges to cover
 * it. The two always travel together: a kind the MHPCO has taken on has both,
 * and a kind it has not taken on has neither, so they are listed as one entry
 * per kind rather than as two lists that could disagree.
 *
 * <p>The MHPCO tariffs main items individually and components as a category:
 * every component is listed at the same tariff, whatever it is made of.
 *
 * <p>Changes whenever the MHPCO revises its tariff or takes on a new kind of
 * item; knows nothing about how a premium is assembled from those amounts.
 */
final class PriceList {

    /**
     * What one kind of item is tariffed at.
     */
    private record Tariff(int insuranceValueInG, int basePremiumInG) {
    }

    private static final Tariff COMPONENT = new Tariff(250, 25);

    private static final Map<String, Tariff> TARIFFS = Map.of(
            "sword", new Tariff(1000, 100),
            "amulet", new Tariff(600, 60),
            "staff", new Tariff(800, 80),
            "potion", new Tariff(400, 40),
            "rune", COMPONENT,
            "moonstone", COMPONENT);

    private PriceList() {
    }

    static BigDecimal basePremiumFor(Item item) {
        return BigDecimal.valueOf(tariffFor(item).basePremiumInG());
    }

    static BigDecimal insuranceValueFor(Item item) {
        return BigDecimal.valueOf(tariffFor(item).insuranceValueInG());
    }

    /**
     * The MHPCO insures only what its price list names: an item of any other
     * kind is refused.
     */
    private static Tariff tariffFor(Item item) {
        Tariff tariff = TARIFFS.get(item.type());
        if (tariff == null) {
            throw new RejectedScenario("the MHPCO does not insure a " + item.type());
        }
        return tariff;
    }
}
