import java.util.Map;

/** What the MHPCO knows about its business relationship with one customer. */
class CustomerRelationship {

    private static final int LOYALTY_YEARS = 2;

    private final int yearsWithMHPCO;
    private int contractsSold;

    CustomerRelationship(Map<String, Object> customer) {
        this.yearsWithMHPCO = ((Number) customer.get("yearsWithMHPCO")).intValue();
    }

    void recordContract() {
        contractsSold++;
    }

    boolean isLongStanding() {
        return yearsWithMHPCO >= LOYALTY_YEARS;
    }

    boolean isFollowUpContract() {
        return contractsSold > 1;
    }
}
