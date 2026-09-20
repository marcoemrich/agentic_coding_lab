import java.util.ArrayList;
import java.util.List;

/**
 * The insured items of a policy that have not yet answered for a damage in this incident.
 *
 * The office reads a damage report one entry at a time and strikes off the item that
 * answers for it, so that no item answers twice within one incident.
 *
 * This is also where the office raises its objections to a reported damage. A report it will
 * not accept is refused here, before any item is struck off and before any amount is settled:
 * an amount that is not a damage at all, and a damage no remaining insured item answers for
 * — whether because the policy never covered that type or because every item of that type
 * has already answered within this incident.
 */
public class UnclaimedCover {

    private final List<Item> unclaimed;

    public UnclaimedCover(List<Item> items) {
        this.unclaimed = new ArrayList<>(items);
    }

    public Item claimAgainst(Damage damage) {
        if (damage.amount() < 0) {
            throw new ClaimOfficeException(
                    "A damage cannot be reported as a negative amount: " + damage.amount());
        }
        for (int position = 0; position < unclaimed.size(); position++) {
            if (unclaimed.get(position).type().equals(damage.itemType())) {
                return unclaimed.remove(position);
            }
        }
        throw new ClaimOfficeException(
                "The policy does not cover a further item of type " + damage.itemType());
    }
}
