import java.util.List;

/**
 * The policy base premium: the sum of the base premiums of all insured items.
 *
 * The office prices alike items as a group, so that the building-block offer can apply
 * to each group in turn; the policy base premium is the sum of those group prices.
 * Risk surcharges for individual items are not part of it -- they attach to the
 * affected item, not to the policy.
 */
public class PolicyBasePremium {

    private final AlikeItems alikeItems = new AlikeItems();
    private final ComponentBlockOffer blockOffer = new ComponentBlockOffer();

    public double forItems(List<Item> items) {
        double total = 0;
        for (List<Item> group : alikeItems.groupsIn(items)) {
            total += blockOffer.basePremiumFor(group);
        }
        return total;
    }
}
