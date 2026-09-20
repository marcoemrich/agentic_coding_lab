import java.util.List;

/**
 * What the item-specific risk surcharges of a policy add up to.
 *
 * The office assesses each insured item on its own -- a curse raises the premium of the
 * cursed item, not of its harmless neighbours -- and the policy carries the sum.
 */
public class PolicyRiskSurcharges {

    private final ItemRiskSurcharge itemRiskSurcharge = new ItemRiskSurcharge();

    public double forItems(List<Item> items) {
        double total = 0;
        for (Item item : items) {
            total += itemRiskSurcharge.forItem(item);
        }
        return total;
    }
}
