import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * How the MHPCO settles damage reported against a policy: it resolves each reported
 * damage to the insured item it names, asks its reimbursement clauses how much of
 * that damage it recognises, withholds the deductible per damage event, and pays out
 * the total.
 *
 * <p>Separate from what the office charges: a premium is priced from the price list,
 * the customer's file and the item's risk, while a payout is decided from the damage
 * and the damaged item alone. The two change for different reasons -- so much so that
 * the office's own favour points in opposite directions, rounding a premium up but a
 * payout down.
 */
public final class ClaimSettlement {

    /** The MHPCO keeps this much of every damage event to itself. */
    private static final BigDecimal DEDUCTIBLE_PER_DAMAGE = BigDecimal.valueOf(100);

    private ClaimSettlement() {
    }

    /** What the office pays out for everything the incident damaged. */
    public static Settlement forIncident(Policy policy, Incident incident) {
        BigDecimal payout = BigDecimal.ZERO;
        for (DamagedItem damagedItem : policy.damagedItemsFor(incident.damages())) {
            payout = payout.add(reimbursementFor(damagedItem));
        }
        int paid = policy.drawAgainstCap(roundInOfficeFavour(payout));
        return new Settlement(paid, policy.remainingCap());
    }

    /** What the office reimburses for one damaged item, after its deductible. */
    private static BigDecimal reimbursementFor(DamagedItem damagedItem) {
        return ReimbursementClause
                .recognisedAmountOf(damagedItem.damage(), damagedItem.item())
                .subtract(DEDUCTIBLE_PER_DAMAGE);
    }

    /**
     * A payout is rounded down: the MHPCO rounds in its own favour. Intermediate
     * amounts stay exact fractions, so only this final step loses the remainder.
     */
    private static int roundInOfficeFavour(BigDecimal payout) {
        return payout.setScale(0, RoundingMode.FLOOR).intValueExact();
    }
}
