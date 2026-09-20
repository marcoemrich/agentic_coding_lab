/**
 * The risk surcharges the office adds for a single insured item.
 *
 * A cursed item and a highly enchanted item each carry a risk surcharge on that item's
 * own base premium, not on the premium of the whole policy. An item that is both carries
 * both surcharges.
 */
public class ItemRiskSurcharge {

    private final PriceList priceList = new PriceList();

    public double forItem(Item item) {
        double basePremium = priceList.basePremiumFor(item);
        return basePremium * totalRateFor(item);
    }

    /**
     * Each risk the office recognises is assessed on its own; an item that carries
     * several risks carries the sum of their rates.
     */
    private double totalRateFor(Item item) {
        double rate = 0;
        for (RecognisedRisk risk : RecognisedRisk.values()) {
            if (risk.isCarriedBy(item)) {
                rate += risk.rate();
            }
        }
        return rate;
    }
}
