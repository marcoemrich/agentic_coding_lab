import java.math.BigDecimal;
import java.util.List;

/**
 * The ceiling the MHPCO puts on what one policy ever pays out, and what is
 * left of it.
 *
 * <p>The MHPCO pays out at most twice the insurance sum over the whole life of
 * a policy. The cap is measured against the unmodified insurance sum: the
 * premium modifiers and the building block offer bear on what the customer
 * pays, never on what the MHPCO is willing to pay back. Once the cap is
 * exhausted a claim is reduced to whatever is left of it rather than refused.
 *
 * <p>Changes whenever the MHPCO revises how far it will go for a single
 * policy; knows nothing about which items are covered or what an incident is
 * worth before the cap bears on it.
 */
final class PayoutCap {

    private static final BigDecimal CAP_MULTIPLE = BigDecimal.valueOf(2);

    private BigDecimal remaining;

    PayoutCap(List<Item> items) {
        this.remaining = InsuranceSum.of(items).multiply(CAP_MULTIPLE);
    }

    /**
     * What is still available to pay out under this policy.
     */
    BigDecimal remaining() {
        return remaining;
    }

    /**
     * Draws the owed amount against the cap, returning what the cap allows and
     * reducing what is left by exactly that much.
     */
    BigDecimal draw(BigDecimal owed) {
        BigDecimal allowed = owed.min(remaining);
        remaining = remaining.subtract(allowed);
        return allowed;
    }
}
