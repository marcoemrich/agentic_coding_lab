import java.util.List;

/** Issues quotes and settles claims according to the MHPCO rules. */
class ClaimOffice {

    private static final int PROCESSING_FEE = 5;

    private final CustomerModifiers customerModifiers;

    ClaimOffice(Customer customer) {
        this.customerModifiers = new CustomerModifiers(customer);
    }

    int quote(List<Item> items) {
        double basePremium = policyBasePremium(items);
        double premium = basePremium + itemSurcharges(items)
                + basePremium * customerModifiers.netRate();
        customerModifiers.recordContract();
        return MhpcoFavour.roundedPremium(premium + PROCESSING_FEE);
    }

    Policy insure(List<Item> items) {
        return new Policy(items, quote(items));
    }

    Settlement claim(Policy policy, List<Damage> damages) {
        double payout = 0;
        for (DamagedItem damaged : policy.damagedItems(damages)) {
            payout += Reimbursement.forDamage(damaged.item(), damaged.amount());
        }
        int settled = policy.payOutUpToCap(MhpcoFavour.roundedPayout(payout));
        return new Settlement(settled, policy.remainingCap());
    }

    /** Item-specific modifiers apply to the base premium of the affected item. */
    private double itemSurcharges(List<Item> items) {
        double surcharges = 0;
        for (Item item : items) {
            surcharges += RiskSurcharges.forItem(item);
        }
        return surcharges;
    }

    private double policyBasePremium(List<Item> items) {
        double basePremium = ComponentBlocks.basePremiumOf(items);
        for (Item item : items) {
            if (!PriceList.isComponent(item.type())) {
                basePremium += PriceList.basePremiumOf(item);
            }
        }
        return basePremium;
    }
}
