import java.util.List;

/**
 * The damage reports the MHPCO will settle at all: a damage is an amount the
 * claimant has lost, so the office declines one reported for a negative
 * amount. It declines the whole claim rather than settling the incident
 * around the damage it will not accept, so it reads the reports before it
 * settles any of them.
 *
 * This is the one place that decides what the office accepts as a damage
 * report. What an accepted damage is reimbursed is a separate decision, made
 * by {@link Reimbursement}: the office may change its clauses without
 * changing what it will hear, and may change what it will hear -- a damage of
 * nothing, a damage beyond what the item is insured for -- without changing
 * what it pays for a damage it accepts.
 *
 * It is the claim-side counterpart of {@link InsurableItems}, which decides
 * what the office will take on when quoting.
 */
public final class ReportedDamages {

    private ReportedDamages() {
    }

    public static void requireAllALoss(List<Damage> damages) {
        damages.stream()
                .filter(damage -> damage.amount() < 0)
                .findFirst()
                .ifPresent(damage -> {
                    throw new IllegalArgumentException(
                            "A damage cannot be reported for a negative amount: "
                                    + damage.amount());
                });
    }
}
