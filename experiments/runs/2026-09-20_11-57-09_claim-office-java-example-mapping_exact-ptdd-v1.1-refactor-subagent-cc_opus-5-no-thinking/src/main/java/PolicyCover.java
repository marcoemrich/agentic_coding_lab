import java.util.List;

/**
 * What a policy is worth to the office: the insurance sum it has underwritten, and the
 * cap on everything it will ever pay out on that policy.
 *
 * The insurance sum is the plain sum of the listed insurance values of the covered items.
 * It is deliberately taken from the price list rather than from the premium: a block
 * discount lowers what the customer pays without lowering what the office insures, and a
 * risk surcharge raises the premium without raising the cap.
 */
public class PolicyCover {

    private static final int CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

    private final int insuranceSum;

    private PolicyCover(int insuranceSum) {
        this.insuranceSum = insuranceSum;
    }

    public static PolicyCover of(List<Item> items) {
        PriceList priceList = new PriceList();
        int sum = 0;
        for (Item item : items) {
            sum += priceList.insuranceValueOf(item);
        }
        return new PolicyCover(sum);
    }

    /**
     * The ceiling the office underwrote: everything it will ever pay out on this policy,
     * twice the insurance sum.
     */
    public int cap() {
        return CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSum;
    }
}
