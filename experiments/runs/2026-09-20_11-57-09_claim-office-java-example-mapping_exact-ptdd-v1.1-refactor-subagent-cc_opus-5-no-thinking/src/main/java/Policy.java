import java.util.List;

/**
 * A policy the office has issued: what it covers, and what is left of its cap.
 *
 * The cap is what the office will ever pay out on the policy, so it is consumed as claims
 * are settled: a claim is paid only as far as the cap still reaches, and what it does not
 * reach is not paid at all.
 */
public class Policy {

    private final List<Item> items;

    private int remainingCap;

    public Policy(List<Item> items) {
        this.items = items;
        this.remainingCap = PolicyCover.of(items).cap();
    }

    /**
     * The cover this policy has left to answer for one incident: every insured item, each
     * able to answer for a single damage before the office objects.
     *
     * A fresh cover is handed out for each incident, because an item that answered for a
     * damage in one incident is insured again for the next.
     */
    public UnclaimedCover unclaimedCover() {
        return new UnclaimedCover(items);
    }

    public int settle(int desiredPayout) {
        int payout = Math.min(desiredPayout, remainingCap);
        remainingCap -= payout;
        return payout;
    }

    public int remainingCap() {
        return remainingCap;
    }
}
