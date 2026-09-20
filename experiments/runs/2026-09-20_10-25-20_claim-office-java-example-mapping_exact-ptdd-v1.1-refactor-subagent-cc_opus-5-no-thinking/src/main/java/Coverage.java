/**
 * What a policy covers over one incident, as a reimbursement needs to see it:
 * which insured item a reported damage was suffered by.
 *
 * Reimbursing a damage depends on the item that suffered it -- its
 * enchantment, its material -- but not on how that item is found among the
 * ones a policy covers. This is the name of that dependency, so the office's
 * reimbursement clauses and a policy's record of what it covers change for
 * their own reasons. An issued policy answers it for one incident at a time
 * through {@link CoveredItems#forOneIncident()}, because an insured item
 * answers at most one reported damage.
 */
@FunctionalInterface
public interface Coverage {

    /**
     * The insured item the reported damage was suffered by, or the office's
     * refusal of the whole claim when the policy covers no such item left.
     */
    Item damagedIn(Damage damage);
}
