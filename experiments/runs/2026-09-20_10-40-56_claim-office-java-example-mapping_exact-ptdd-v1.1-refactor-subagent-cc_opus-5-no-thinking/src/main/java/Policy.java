import java.math.BigDecimal;
import java.util.List;

/**
 * A policy the MHPCO has written over a list of items.
 *
 * <p>Knows which items it covers, and that settling an incident means paying
 * what is owed for it as far as the policy's payout cap allows. Defers what is
 * owed to the reimbursement rules and how far the cap allows to the cap
 * itself.
 */
final class Policy {

    private final List<Item> items;
    private final PayoutCap cap;

    Policy(List<Item> items) {
        this.items = List.copyOf(items);
        this.cap = new PayoutCap(this.items);
    }

    BigDecimal remainingCap() {
        return cap.remaining();
    }

    /**
     * Settles an incident against this policy, reducing the remaining cap by
     * what is paid out.
     */
    BigDecimal settle(Incident incident) {
        return cap.draw(Reimbursement.of(items, incident));
    }
}
