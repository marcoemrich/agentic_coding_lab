import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

class ClaimOffice {

    private static final BigDecimal PROCESSING_FEE = new BigDecimal("5");
    private static final BigDecimal DEDUCTIBLE_PER_DAMAGE = new BigDecimal("100");
    private static final int HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
    private static final BigDecimal HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = new BigDecimal("0.50");
    private static final BigDecimal FIRST_INSURANCE_SURCHARGE_RATE = new BigDecimal("0.10");
    private static final BigDecimal CURSE_SURCHARGE_RATE = new BigDecimal("0.50");
    private static final BigDecimal HIGH_ENCHANTMENT_SURCHARGE_RATE = new BigDecimal("0.30");
    private static final BigDecimal LOYALTY_DISCOUNT_RATE = new BigDecimal("0.20");
    private static final BigDecimal FOLLOW_UP_CONTRACT_DISCOUNT_RATE = new BigDecimal("0.15");
    private static final int HIGH_ENCHANTMENT_LEVEL = 5;

    private static final BigDecimal COMPONENT_BASE_PREMIUM = new BigDecimal("25");
    private static final Set<String> COMPONENT_TYPES = Set.of("rune", "moonstone");
    private static final int BLOCK_SIZE = 3;
    private static final BigDecimal BLOCK_BASE_PREMIUM = new BigDecimal("60");

    private static final Map<String, BigDecimal> BASE_PREMIUMS = Map.of(
            "sword", new BigDecimal("100"),
            "amulet", new BigDecimal("60"),
            "staff", new BigDecimal("80"),
            "potion", new BigDecimal("40"),
            "rune", COMPONENT_BASE_PREMIUM,
            "moonstone", COMPONENT_BASE_PREMIUM);

    private final CustomerRelationship relationship;
    private final Map<Integer, Policy> policies = new LinkedHashMap<>();
    private int stepsProcessed;

    ClaimOffice() {
        this(Map.of("yearsWithMHPCO", 0));
    }

    ClaimOffice(Map<String, Object> customer) {
        this.relationship = new CustomerRelationship(customer);
    }

    int quote(List<Map<String, Object>> items) {
        items.forEach(item -> requireInsurableType(typeOf(item)));
        relationship.recordContract();
        policies.put(stepsProcessed++, new Policy(items));
        BigDecimal basePremium = policyBasePremium(items);
        BigDecimal premium = basePremium
                .add(itemRiskSurcharges(items))
                .add(customerHistoryModifiers(basePremium));
        return roundPremiumInOfficesFavour(premium.add(PROCESSING_FEE));
    }

    Settlement claim(int policyIndex, Map<String, Object> incident) {
        stepsProcessed++;
        Policy policy = policies.get(policyIndex);
        damagesIn(incident).forEach(this::requireNonNegativeAmount);
        policy.verifyCovers(damagesIn(incident));
        BigDecimal payout = BigDecimal.ZERO;
        for (Map<String, Object> damage : damagesIn(incident)) {
            payout = payout.add(reimbursementFor(damage, policy));
        }
        int settledPayout = roundPayoutInOfficesFavour(policy.limitToRemainingCap(payout));
        policy.recordPayout(BigDecimal.valueOf(settledPayout));
        return new Settlement(settledPayout, policy.remainingCap().intValue());
    }

    private BigDecimal reimbursementFor(Map<String, Object> damage, Policy policy) {
        Map<String, Object> item = policy.insuredItemOfType((String) damage.get("itemType"));
        return coveredShareOf(amountOf(damage), item)
                .subtract(DEDUCTIBLE_PER_DAMAGE)
                .max(BigDecimal.ZERO);
    }

    /**
     * The high-enchantment clause takes precedence over the dragon-material clause,
     * which reimburses in full -- as does an item to which no clause applies.
     */
    private BigDecimal coveredShareOf(BigDecimal damageAmount, Map<String, Object> item) {
        if (isHighlyEnchantedForClaims(item)) {
            return damageAmount.multiply(HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE);
        }
        return damageAmount;
    }

    private boolean isHighlyEnchantedForClaims(Map<String, Object> item) {
        return enchantmentOf(item) >= HIGH_ENCHANTMENT_CLAIM_LEVEL;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> damagesIn(Map<String, Object> incident) {
        return (List<Map<String, Object>>) incident.get("damages");
    }

    private BigDecimal amountOf(Map<String, Object> damage) {
        return new BigDecimal(((Number) damage.get("amount")).toString());
    }

    private BigDecimal customerHistoryModifiers(BigDecimal basePremium) {
        BigDecimal modifiers = basePremium.multiply(FIRST_INSURANCE_SURCHARGE_RATE);
        if (relationship.isLongStanding()) {
            modifiers = modifiers.subtract(basePremium.multiply(LOYALTY_DISCOUNT_RATE));
        }
        if (relationship.isFollowUpContract()) {
            modifiers = modifiers.subtract(
                    basePremium.multiply(FOLLOW_UP_CONTRACT_DISCOUNT_RATE));
        }
        return modifiers;
    }

    private BigDecimal policyBasePremium(List<Map<String, Object>> items) {
        BigDecimal total = BigDecimal.ZERO;
        for (Map.Entry<String, List<Map<String, Object>>> group
                : groupAlikeItemsByType(items).entrySet()) {
            total = total.add(basePremiumForAlikeItems(group.getKey(), group.getValue().size()));
        }
        return total;
    }

    private BigDecimal itemRiskSurcharges(List<Map<String, Object>> items) {
        BigDecimal total = BigDecimal.ZERO;
        for (Map<String, Object> item : items) {
            total = total.add(riskSurchargeFor(item));
        }
        return total;
    }

    private BigDecimal riskSurchargeFor(Map<String, Object> item) {
        BigDecimal basePremium = BASE_PREMIUMS.get(typeOf(item));
        BigDecimal surcharge = BigDecimal.ZERO;
        if (isCursed(item)) {
            surcharge = surcharge.add(basePremium.multiply(CURSE_SURCHARGE_RATE));
        }
        if (isHighlyEnchanted(item)) {
            surcharge = surcharge.add(basePremium.multiply(HIGH_ENCHANTMENT_SURCHARGE_RATE));
        }
        return surcharge;
    }

    private boolean isCursed(Map<String, Object> item) {
        return Boolean.TRUE.equals(item.get("cursed"));
    }

    private boolean isHighlyEnchanted(Map<String, Object> item) {
        return enchantmentOf(item) >= HIGH_ENCHANTMENT_LEVEL;
    }

    private int enchantmentOf(Map<String, Object> item) {
        Object enchantment = item.get("enchantment");
        return enchantment == null ? 0 : ((Number) enchantment).intValue();
    }

    private Map<String, List<Map<String, Object>>> groupAlikeItemsByType(
            List<Map<String, Object>> items) {
        Map<String, List<Map<String, Object>>> grouped = new LinkedHashMap<>();
        for (Map<String, Object> item : items) {
            grouped.computeIfAbsent(typeOf(item), type -> new ArrayList<>()).add(item);
        }
        return grouped;
    }

    private BigDecimal basePremiumForAlikeItems(String type, int count) {
        if (formsAComponentBlock(type, count)) {
            return BLOCK_BASE_PREMIUM;
        }
        return BASE_PREMIUMS.get(type).multiply(BigDecimal.valueOf(count));
    }

    private boolean formsAComponentBlock(String type, int count) {
        return COMPONENT_TYPES.contains(type) && count == BLOCK_SIZE;
    }

    /** A damage report states what was lost, never a negative amount. */
    private void requireNonNegativeAmount(Map<String, Object> damage) {
        if (amountOf(damage).signum() < 0) {
            throw new IllegalArgumentException("a damage amount may not be negative: "
                    + damage.get("amount"));
        }
    }

    /** The MHPCO insures only the item types on its price list. */
    private void requireInsurableType(String itemType) {
        if (!BASE_PREMIUMS.containsKey(itemType)) {
            throw new IllegalArgumentException("the MHPCO does not insure items of type "
                    + itemType);
        }
    }

    private String typeOf(Map<String, Object> item) {
        return (String) item.get("type");
    }

    /** A premium the office receives is rounded up, in its favour. */
    private int roundPremiumInOfficesFavour(BigDecimal premium) {
        return premium.setScale(0, RoundingMode.CEILING).intValue();
    }

    /** A payout the office pays is rounded down, in its favour. */
    private int roundPayoutInOfficesFavour(BigDecimal payout) {
        return payout.setScale(0, RoundingMode.FLOOR).intValue();
    }
}
