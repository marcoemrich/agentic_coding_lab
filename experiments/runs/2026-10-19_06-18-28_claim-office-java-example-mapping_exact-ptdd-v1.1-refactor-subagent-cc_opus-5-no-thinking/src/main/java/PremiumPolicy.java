import java.math.BigDecimal;
import java.util.List;

/**
 * The MHPCO premium rules: the two scopes of premium modifier, the processing
 * fee, applied to the base premium the {@link PriceList} states for the insured
 * items.
 *
 * A premium is a charge to the customer, so its fraction of a G is rounded in
 * the office's favor by {@link InOfficesFavor}.
 */
public class PremiumPolicy {

    private static final BigDecimal CURSE_SURCHARGE_RATE = new BigDecimal("0.50");
    private static final BigDecimal HIGH_ENCHANTMENT_SURCHARGE_RATE = new BigDecimal("0.30");
    private static final BigDecimal FIRST_INSURANCE_SURCHARGE_RATE = new BigDecimal("0.10");
    private static final BigDecimal LOYALTY_DISCOUNT_RATE = new BigDecimal("0.20");
    private static final BigDecimal FOLLOW_UP_CONTRACT_DISCOUNT_RATE = new BigDecimal("0.15");
    private static final BigDecimal PROCESSING_FEE = new BigDecimal("5");

    private final PriceList priceList;

    /** The premium rules read their base premiums from the office's price list. */
    public PremiumPolicy(PriceList priceList) {
        this.priceList = priceList;
    }

    /**
     * The office charges both kinds of modifier on a base premium, never on each
     * other: an item modifier on the affected item's own base premium, a
     * policy-wide modifier on the policy base premium. So the two are summed
     * alongside the base premium rather than compounded in sequence, and the
     * processing fee is added at the very end.
     */
    public int quote(Customer customer, List<InsuredItem> insuredItems) {
        BigDecimal policyBasePremium = priceList.policyBasePremium(insuredItems);
        BigDecimal premium = policyBasePremium
                .add(itemRiskSurcharges(insuredItems))
                .add(policyWideModifiers(policyBasePremium, customer))
                .add(PROCESSING_FEE);
        return InOfficesFavor.charge(premium).intValueExact();
    }

    /**
     * Item-scope modifiers: each is charged on the base premium of the affected
     * item alone, so a modifier on one item never touches another item's share
     * of the policy. What one item's risks cost is {@link #riskSurcharge}'s
     * business; this rule only states that the policy owes the sum of them.
     */
    private BigDecimal itemRiskSurcharges(List<InsuredItem> insuredItems) {
        BigDecimal surcharges = BigDecimal.ZERO;
        for (InsuredItem insuredItem : insuredItems) {
            surcharges = surcharges.add(riskSurcharge(insuredItem));
        }
        return surcharges;
    }

    /**
     * What the risks the office reads in one item cost, charged on that item's
     * own base premium. A curse and a high enchantment are separate risks, so an
     * item carrying both is surcharged for both rather than letting the graver
     * risk absorb the other.
     */
    private BigDecimal riskSurcharge(InsuredItem insuredItem) {
        BigDecimal itemBasePremium = priceList.basePremium(insuredItem);
        BigDecimal surcharge = BigDecimal.ZERO;
        if (insuredItem.cursed()) {
            surcharge = surcharge.add(itemBasePremium.multiply(CURSE_SURCHARGE_RATE));
        }
        if (insuredItem.isHighlyEnchanted()) {
            surcharge = surcharge.add(itemBasePremium.multiply(HIGH_ENCHANTMENT_SURCHARGE_RATE));
        }
        return surcharge;
    }

    /**
     * Policy-scope modifiers: each is charged on the policy base premium, the
     * sum of all item base premiums. Every quote is a first insurance of the
     * items it covers, whatever the customer's history.
     */
    private BigDecimal policyWideModifiers(BigDecimal policyBasePremium, Customer customer) {
        return firstInsuranceSurcharge(policyBasePremium)
                .subtract(loyaltyDiscount(policyBasePremium, customer))
                .subtract(followUpContractDiscount(policyBasePremium, customer));
    }

    /**
     * Every contract after the customer's first earns a discount, however long
     * they have been with the office.
     */
    private static BigDecimal followUpContractDiscount(BigDecimal policyBasePremium,
            Customer customer) {
        if (!customer.holdsFollowUpContract()) {
            return BigDecimal.ZERO;
        }
        return policyBasePremium.multiply(FOLLOW_UP_CONTRACT_DISCOUNT_RATE);
    }

    /**
     * Every quote is a first insurance of the items it covers, whatever the
     * customer's history, so this surcharge is charged on every policy.
     */
    private static BigDecimal firstInsuranceSurcharge(BigDecimal policyBasePremium) {
        return policyBasePremium.multiply(FIRST_INSURANCE_SURCHARGE_RATE);
    }

    /**
     * The office rewards a long-standing customer with a discount on the policy
     * base premium. Who counts as long-standing is the customer's standing to
     * answer; this rule only states what that standing is worth.
     */
    private static BigDecimal loyaltyDiscount(BigDecimal policyBasePremium, Customer customer) {
        if (!customer.isLongStanding()) {
            return BigDecimal.ZERO;
        }
        return policyBasePremium.multiply(LOYALTY_DISCOUNT_RATE);
    }
}
