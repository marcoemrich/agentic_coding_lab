import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Prices policies and settles claims for one customer.
 *
 * <p>Rejections are signalled by throwing {@link IllegalArgumentException}: an uninsurable item
 * type, a damaged item the policy does not cover, more damages of a type than are insured, and a
 * negative damage amount. The specification gives all of these the same observable outcome, so
 * the type carries no distinction between them -- a caller translating the domain to a CLI
 * reports every one the same way, with a non-zero exit status and a description on stderr.
 */
class ClaimOffice {

    /** Every component (rune, moonstone, ...) carries the same base premium. */
    private static final int COMPONENT_BASE_PREMIUM = 25;

    /** A building block of 3 alike components is offered at a special base premium. */
    private static final int COMPONENT_BLOCK_SIZE = 3;
    private static final int COMPONENT_BLOCK_BASE_PREMIUM = 60;

    private static final Map<String, Integer> BASE_PREMIUMS = Map.of(
            "sword", 100,
            "amulet", 60,
            "staff", 80,
            "potion", 40,
            "rune", COMPONENT_BASE_PREMIUM,
            "moonstone", COMPONENT_BASE_PREMIUM);

    /** Every component (rune, moonstone, ...) carries the same insurance value. */
    private static final int COMPONENT_INSURANCE_VALUE = 250;

    private static final Map<String, Integer> INSURANCE_VALUES = Map.of(
            "sword", 1000,
            "amulet", 600,
            "staff", 800,
            "potion", 400,
            "rune", COMPONENT_INSURANCE_VALUE,
            "moonstone", COMPONENT_INSURANCE_VALUE);

    private static final int CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

    /** Binding JSON field name from the specification's schema. */
    private static final String TYPE_FIELD = "type";

    private static final String CURSED_FIELD = "cursed";

    private static final double CURSE_SURCHARGE_RATE = 0.50;

    private static final String ENCHANTMENT_FIELD = "enchantment";

    /**
     * The premium-side enchantment threshold. The specification uses a different, higher
     * threshold for the payout halving clause, so this one is not "the" enchantment level.
     */
    private static final int HIGH_ENCHANTMENT_LEVEL = 5;
    private static final double HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.30;

    private static final int LOYALTY_YEARS = 2;
    private static final double LOYALTY_DISCOUNT_RATE = 0.20;

    private static final double FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

    private static final String ITEM_TYPE_FIELD = "itemType";

    private static final String AMOUNT_FIELD = "amount";

    private static final int DEDUCTIBLE = 100;

    /** The payout-side enchantment rule; distinct from the premium-side threshold of 5. */
    private static final int HEAVY_ENCHANTMENT_LEVEL = 8;
    private static final double HEAVY_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.50;

    private static final int PROCESSING_FEE = 5;
    private static final double FIRST_INSURANCE_SURCHARGE_RATE = 0.10;

    private final int yearsWithMhpco;

    private int contractsIssued;

    private final List<Policy> policies = new ArrayList<>();

    /** The office pays at most twice a policy's insurance sum over that policy's lifetime. */
    private static final class Policy {

        private final List<Map<String, Object>> insuredItems;

        private double remainingCap;

        private Policy(List<Map<String, Object>> insuredItems, double insuranceSum) {
            this.insuredItems = insuredItems;
            this.remainingCap = insuranceSum * CAP_MULTIPLE_OF_INSURANCE_SUM;
        }

        /** The office never pays more than the cap still remaining on this policy. */
        private double drawDown(double desiredPayout) {
            double granted = Math.min(desiredPayout, remainingCap);
            remainingCap -= granted;
            return granted;
        }

        /**
         * A mutable copy for one claim to consume. The policy's own list is never touched, so a
         * claim rejected partway through leaves the policy intact.
         */
        private List<Map<String, Object>> unclaimedItems() {
            return new ArrayList<>(insuredItems);
        }
    }

    ClaimOffice(int yearsWithMhpco) {
        this.yearsWithMhpco = yearsWithMhpco;
    }

    /**
     * Issues a contract: prices the items and records that the customer now has one more
     * contract, so the next quote receives the follow-up discount. The package-private
     * intermediate observation points below deliberately do not issue anything and leave the
     * contract count untouched.
     */
    int quote(List<Map<String, Object>> items) {
        int premium = premiumFor(items);
        contractsIssued++;
        policies.add(new Policy(List.copyOf(items), insuranceSumOf(items)));
        return premium;
    }

    /**
     * Summed per item, never per group: the specification is explicit that the building block
     * discount affects the premium only, not the insurance sum.
     */
    private double insuranceSumOf(List<Map<String, Object>> items) {
        double insuranceSum = 0;
        for (Map<String, Object> item : items) {
            insuranceSum += fromPriceList(INSURANCE_VALUES, typeOf(item));
        }
        return insuranceSum;
    }

    /**
     * Single statement of the rejection rule: the price list defines which types are insurable,
     * so a type absent from a price-list column is rejected regardless of which column was asked.
     */
    /** The item's type, read from the binding JSON field. */
    private static String typeOf(Map<String, Object> item) {
        return (String) item.get(TYPE_FIELD);
    }

    /**
     * Each damage is settled against a distinct insured item, so a claim naming more items of
     * a type than the policy covers is rejected and each item's own clauses apply. This is the
     * claim-time validation site; an unknown type is rejected here too rather than by a type
     * check, because {@link #fromPriceList} already prevented it from entering a policy.
     */
    private static Map<String, Object> claimOne(List<Map<String, Object>> unclaimedItems, String type) {
        for (int i = 0; i < unclaimedItems.size(); i++) {
            if (type.equals(typeOf(unclaimedItems.get(i)))) {
                return unclaimedItems.remove(i);
            }
        }
        throw new IllegalArgumentException("Item not insured: " + type);
    }

    /** Damage entries name their item through the binding {@code itemType} field. */
    private static String damagedItemType(Map<String, Object> damage) {
        return (String) damage.get(ITEM_TYPE_FIELD);
    }

    /**
     * Quote-time validation: the price list defines which types are insurable, so a type absent
     * from a price-list column is rejected regardless of which column was asked.
     */
    private int fromPriceList(Map<String, Integer> priceList, String type) {
        Integer value = priceList.get(type);
        if (value == null) {
            throw new IllegalArgumentException("Unknown item type: " + type);
        }
        return value;
    }

    /**
     * The specification's premium formula: item base premiums plus item-specific surcharges,
     * plus the policy-wide modifiers -- which are percentages of the policy base premium alone,
     * not of the item surcharges -- and finally the processing fee, rounded at the very end.
     */
    private int premiumFor(List<Map<String, Object>> items) {
        double premium = premiumBeforePolicyModifiers(items)
                + policyModifiersOn(policyBasePremium(items))
                + PROCESSING_FEE;
        return roundPremiumInOfficeFavour(premium);
    }

    /** Observation point on the pricing rules only; issues nothing (see {@link #quote}). */
    double policyBasePremium(List<Map<String, Object>> items) {
        double total = 0;
        for (Map.Entry<String, List<Map<String, Object>>> alike : groupByType(items).entrySet()) {
            total += basePremiumOfAlikeItems(alike.getKey(), alike.getValue());
        }
        return total;
    }

    /**
     * Settles a claim against a policy: resolves each damaged item against the policy's insured
     * items, sums the payout per damage event, draws the total down against the policy's
     * remaining cap and rounds once at the end. The dragon-material clause is not applied: on
     * this specification it is not behaviourally distinguishable (see the dragon tests).
     *
     * <p>Each damage consumes a distinct insured item (see {@link #claimOne}). A consequence
     * beyond the listed behaviours: where a policy holds several items of one type with
     * differing properties, each damage is priced against its own item's clauses -- a plain
     * sword and an enchantment-9 sword insured together pay 1300 for two 1000 damages, not
     * 1800. The specification's examples use identical items, so no behaviour pins this.
     */
    int claim(int policyIndex, List<Map<String, Object>> damages) {
        Policy policy = policies.get(policyIndex);
        List<Map<String, Object>> unclaimedItems = policy.unclaimedItems();
        double payout = 0;
        for (Map<String, Object> damage : damages) {
            payout += payoutForDamage(damage, claimOne(unclaimedItems, damagedItemType(damage)));
        }
        return roundPayoutInOfficeFavour(policy.drawDown(payout));
    }

    /** A deductible applies per damage event, that is, once per damaged item. */
    private double payoutForDamage(Map<String, Object> damage, Map<String, Object> insuredItem) {
        double amount = damageAmountOf(damage);
        return reimbursedShareOf(amount, insuredItem) - DEDUCTIBLE;
    }

    /**
     * A damage report must state a non-negative amount. Unlike the other two rejection sites,
     * this one judges the request rather than the items: {@link #fromPriceList} asks whether a
     * type is insurable at all and {@link #claimOne} whether this policy covers it, while a
     * negative amount is simply malformed input.
     */
    private static double damageAmountOf(Map<String, Object> damage) {
        int amount = (Integer) damage.get(AMOUNT_FIELD);
        if (amount < 0) {
            throw new IllegalArgumentException("Negative damage amount: " + amount);
        }
        return amount;
    }

    /** Damage to a heavily enchanted item is reimbursed at half the damage amount. */
    private double reimbursedShareOf(double amount, Map<String, Object> insuredItem) {
        if (isHeavilyEnchanted(insuredItem)) {
            return amount * HEAVY_ENCHANTMENT_REIMBURSEMENT_SHARE;
        }
        return amount;
    }

    /**
     * Heavily enchanted for payout purposes (level >= 8). Distinct from the premium-side
     * "highly enchanted" threshold of 5; the specification names neither term.
     */
    private boolean isHeavilyEnchanted(Map<String, Object> item) {
        Object enchantment = item.get(ENCHANTMENT_FIELD);
        return enchantment instanceof Integer level && level >= HEAVY_ENCHANTMENT_LEVEL;
    }

    /** Payouts round down; premiums round up. Both favour the office. */
    private int roundPayoutInOfficeFavour(double payout) {
        return (int) Math.floor(payout);
    }

    int remainingCap(int policyIndex) {
        return (int) policies.get(policyIndex).remainingCap;
    }

    double premiumBeforePolicyModifiers(List<Map<String, Object>> items) {
        return policyBasePremium(items) + itemSurcharges(items);
    }

    private double itemSurcharges(List<Map<String, Object>> items) {
        double total = 0;
        for (Map.Entry<String, List<Map<String, Object>>> alike : groupByType(items).entrySet()) {
            List<Map<String, Object>> group = alike.getValue();
            double attributed = attributedBasePremium(alike.getKey(), group);
            for (Map<String, Object> item : group) {
                total += itemSurchargesOn(item, attributed);
            }
        }
        return total;
    }

    /**
     * Share of a group's base premium attributed to each member, so that item-specific
     * modifiers have a per-item base to apply to. Within a building block the members are
     * indistinguishable, so the block's premium is split evenly; no specification example
     * combines a block with a cursed or enchanted component.
     */
    private double attributedBasePremium(String type, List<Map<String, Object>> group) {
        return basePremiumOfAlikeItems(type, group) / group.size();
    }

    private double itemSurchargesOn(Map<String, Object> item, double itemBasePremium) {
        double surcharges = 0;
        if (isCursed(item)) {
            surcharges += itemBasePremium * CURSE_SURCHARGE_RATE;
        }
        if (isHighlyEnchanted(item)) {
            surcharges += itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
        }
        return surcharges;
    }

    /** Items carrying no "cursed" field at all -- components, for instance -- are not cursed. */
    private boolean isCursed(Map<String, Object> item) {
        return Boolean.TRUE.equals(item.get(CURSED_FIELD));
    }

    /** Highly enchanted for premium purposes; the payout clause uses its own threshold. */
    private boolean isHighlyEnchanted(Map<String, Object> item) {
        Object enchantment = item.get(ENCHANTMENT_FIELD);
        return enchantment instanceof Integer level && level >= HIGH_ENCHANTMENT_LEVEL;
    }

    private Map<String, List<Map<String, Object>>> groupByType(List<Map<String, Object>> items) {
        return items.stream().collect(Collectors.groupingBy(ClaimOffice::typeOf));
    }

    private double basePremiumOfAlikeItems(String type, List<Map<String, Object>> alike) {
        if (formsComponentBlock(alike)) {
            return COMPONENT_BLOCK_BASE_PREMIUM;
        }
        return alike.size() * fromPriceList(BASE_PREMIUMS, type);
    }

    /**
     * The specification scopes the building block to components; this predicate does not yet
     * check the type. Two symptoms follow, sharing this one root cause: 3 alike main items also
     * form a block, and -- because the block branch returns before the price list is consulted --
     * a group of exactly 3 unknown-type items is priced at the block premium instead of being
     * rejected. No behaviour activated so far discriminates either case; both are closed by a
     * later behaviour, not here.
     */
    private boolean formsComponentBlock(List<Map<String, Object>> alike) {
        return alike.size() == COMPONENT_BLOCK_SIZE;
    }

    /**
     * Policy-wide modifiers (loyalty, first insurance, follow-up contract) apply to the policy
     * base premium. Item-specific modifiers (cursed, high enchantment) apply to the affected
     * item's own base premium and therefore do not belong here.
     */
    private double policyModifiersOn(double policyBasePremium) {
        // Every quote is a first insurance: the specification treats each newly insured item as
        // such regardless of customer history, so this surcharge applies unconditionally -- even
        // on a follow-up contract.
        double modifiers = policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
        if (isLongStandingCustomer()) {
            modifiers -= policyBasePremium * LOYALTY_DISCOUNT_RATE;
        }
        if (isFollowUpContract()) {
            modifiers -= policyBasePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
        }
        return modifiers;
    }

    /** Every contract after the customer's first is a follow-up contract. */
    private boolean isFollowUpContract() {
        return contractsIssued > 0;
    }

    private boolean isLongStandingCustomer() {
        return yearsWithMhpco >= LOYALTY_YEARS;
    }

    /** Premiums round up; the office's favour means the opposite direction for payouts. */
    private int roundPremiumInOfficeFavour(double premium) {
        return (int) Math.ceil(premium);
    }
}
