import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/** The items one MHPCO policy covers, and the payout cap remaining on it. */
class Policy {

    private static final BigDecimal COMPONENT_INSURANCE_VALUE = new BigDecimal("250");
    private static final BigDecimal CAP_MULTIPLE_OF_INSURANCE_SUM = new BigDecimal("2");

    private static final Map<String, BigDecimal> INSURANCE_VALUES = Map.of(
            "sword", new BigDecimal("1000"),
            "amulet", new BigDecimal("600"),
            "staff", new BigDecimal("800"),
            "potion", new BigDecimal("400"),
            "rune", COMPONENT_INSURANCE_VALUE,
            "moonstone", COMPONENT_INSURANCE_VALUE);

    private final List<Map<String, Object>> insuredItems;
    private BigDecimal remainingCap;

    Policy(List<Map<String, Object>> insuredItems) {
        this.insuredItems = List.copyOf(insuredItems);
        this.remainingCap = insuranceSum().multiply(CAP_MULTIPLE_OF_INSURANCE_SUM);
    }

    /** Every reported damage must refer to an item this policy actually covers. */
    void verifyCovers(List<Map<String, Object>> damages) {
        for (Map<String, Object> damage : damages) {
            String itemType = (String) damage.get("itemType");
            if (damagesOfType(damages, itemType) > countInsuredOfType(itemType)) {
                throw new IllegalArgumentException(
                        "policy does not cover that many items of type " + itemType);
            }
        }
    }

    private long damagesOfType(List<Map<String, Object>> damages, String itemType) {
        return damages.stream().filter(damage -> itemType.equals(damage.get("itemType"))).count();
    }

    private long countInsuredOfType(String itemType) {
        return insuredItems.stream().filter(item -> itemType.equals(item.get("type"))).count();
    }

    Map<String, Object> insuredItemOfType(String itemType) {
        for (Map<String, Object> item : insuredItems) {
            if (itemType.equals(item.get("type"))) {
                return item;
            }
        }
        return Map.of();
    }

    /** The total payout per policy is capped at twice the insurance sum. */
    BigDecimal limitToRemainingCap(BigDecimal desiredPayout) {
        return desiredPayout.min(remainingCap);
    }

    void recordPayout(BigDecimal payout) {
        remainingCap = remainingCap.subtract(payout);
    }

    BigDecimal remainingCap() {
        return remainingCap;
    }

    private BigDecimal insuranceSum() {
        BigDecimal sum = BigDecimal.ZERO;
        for (Map<String, Object> item : insuredItems) {
            sum = sum.add(INSURANCE_VALUES.get(item.get("type")));
        }
        return sum;
    }
}
