import java.math.BigDecimal;
import java.util.List;

/** A policy created by a quote step: the items it covers and the payout cap left on it. */
public class Policy {

    private static final BigDecimal CAP_FACTOR = BigDecimal.valueOf(2);

    private final int premium;
    private final List<Item> items;
    private BigDecimal remainingCap;

    public Policy(int premium, List<Item> items) {
        this.premium = premium;
        this.items = List.copyOf(items);
        this.remainingCap = Quote.insuranceSum(items).multiply(CAP_FACTOR);
    }

    public int premium() {
        return premium;
    }

    public List<Item> items() {
        return items;
    }

    public BigDecimal remainingCap() {
        return remainingCap;
    }

    public void reduceCapBy(BigDecimal payout) {
        remainingCap = remainingCap.subtract(payout);
    }
}
