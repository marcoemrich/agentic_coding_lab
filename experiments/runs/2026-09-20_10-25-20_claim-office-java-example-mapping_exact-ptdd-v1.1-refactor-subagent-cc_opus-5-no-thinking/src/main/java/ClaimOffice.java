import java.math.BigDecimal;
import java.util.List;

public class ClaimOffice {

    private static final int PROCESSING_FEE_IN_G = 5;

    private final PolicyWideModifiers policyWideModifiers;

    public ClaimOffice(Customer customer) {
        this.policyWideModifiers = new PolicyWideModifiers(customer);
    }

    /**
     * The policy base premium is the sum of the base premiums of the main items
     * and of the components, each priced by its own MHPCO pricing policy.
     *
     * The MHPCO names this amount in its own rules, so it is observable inside
     * the domain; it is not part of what the office offers a caller, which is
     * a quote.
     */
    int basePremium(List<Item> items) {
        return MainItemPricing.mainItemsBasePremium(items)
                + ComponentPricing.componentsBasePremium(items);
    }

    /**
     * Item-specific modifiers apply to the base premium of the affected item,
     * not to the policy total.
     */
    BigDecimal premiumAfterItemModifiers(List<Item> items) {
        return BigDecimal.valueOf(basePremium(items))
                .add(ItemRiskSurcharges.totalItemSurcharges(items));
    }

    /**
     * The MHPCO issues a policy over the items it has agreed to cover.
     */
    public Policy insure(List<Item> items) {
        return new Policy(accepted(items));
    }

    /**
     * The items the MHPCO agrees to cover. The office declines the whole
     * request rather than working around an item it does not insure, and it
     * decides this the same way whether it is quoting for the items or issuing
     * a policy over them.
     */
    private static List<Item> accepted(List<Item> items) {
        InsurableItems.requireAllInsurable(items);
        return items;
    }

    /**
     * What the MHPCO would charge to insure these items, priced only for items
     * the office has accepted.
     *
     * The MHPCO assembles the premium from a base premium and two families of
     * modifier. Neither family is measured against the other's amounts: the
     * item-specific risk surcharges are measured against the base premium of
     * each affected item, the policy-wide modifiers against the policy base
     * premium as a whole. Both are therefore added to the policy base premium
     * side by side rather than in sequence, and the processing fee is added at
     * the very end.
     */
    public int quote(List<Item> items) {
        List<Item> insuredItems = accepted(items);
        BigDecimal policyBasePremium = BigDecimal.valueOf(basePremium(insuredItems));
        BigDecimal quotedPremium = premiumAfterItemModifiers(insuredItems)
                .add(policyWideModifiers.totalPolicyModifiers(policyBasePremium))
                .add(BigDecimal.valueOf(PROCESSING_FEE_IN_G));
        policyWideModifiers.recordContractIssued();
        return MhpcoFavour.roundedOwedToTheOffice(quotedPremium);
    }
}
