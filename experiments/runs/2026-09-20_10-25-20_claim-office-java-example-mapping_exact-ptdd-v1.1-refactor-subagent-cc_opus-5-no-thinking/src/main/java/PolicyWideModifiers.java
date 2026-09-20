import java.math.BigDecimal;

/**
 * The MHPCO's policy-wide premium modifiers. Unlike the item-specific risk
 * surcharges, these are measured against the policy premium as a whole and
 * depend on the customer's history with the MHPCO rather than on any item.
 *
 * This is the one place that says which modifiers are policy-wide: a further
 * policy-wide modifier is added here and nowhere else. So far the MHPCO grants
 * the loyalty discount and charges the initial assessment surcharge.
 */
public final class PolicyWideModifiers {

    private static final int LOYALTY_YEARS = 2;

    private static final int LOYALTY_DISCOUNT_PERCENT = 20;

    private static final int INITIAL_ASSESSMENT_SURCHARGE_PERCENT = 10;

    private static final int FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;

    private final Customer customer;

    private int contractsIssued;

    public PolicyWideModifiers(Customer customer) {
        this.customer = customer;
    }

    /**
     * The net effect of every policy-wide modifier on a policy premium:
     * positive amounts are charged to the customer, negative amounts are
     * granted to the customer. Each modifier states its own direction, so this
     * sum says only which modifiers the MHPCO applies policy-wide.
     */
    public BigDecimal totalPolicyModifiers(BigDecimal policyPremium) {
        return initialAssessmentSurcharge(policyPremium)
                .add(loyaltyDiscount(policyPremium))
                .add(followUpContractDiscount(policyPremium));
    }

    /**
     * The MHPCO notes that a contract has been issued to this customer. Every
     * later contract is a follow-up contract, which is what the follow-up
     * contract discount is measured against.
     */
    public void recordContractIssued() {
        contractsIssued++;
    }

    /**
     * Customers receive a 15 % discount on each contract after their first.
     */
    private BigDecimal followUpContractDiscount(BigDecimal policyPremium) {
        if (!hasAPreviousContract()) {
            return BigDecimal.ZERO;
        }
        return Percentage.of(policyPremium, FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT).negate();
    }

    private boolean hasAPreviousContract() {
        return contractsIssued > 0;
    }

    /**
     * Long-standing customers -- 2 or more years of business with the MHPCO --
     * receive a 20 % loyalty discount on the policy premium.
     */
    private BigDecimal loyaltyDiscount(BigDecimal policyPremium) {
        if (!isLongStandingCustomer()) {
            return BigDecimal.ZERO;
        }
        return Percentage.of(policyPremium, LOYALTY_DISCOUNT_PERCENT).negate();
    }

    /**
     * The MHPCO counts a customer as long-standing from 2 full years of
     * business onwards; a customer in their second year is still a newcomer.
     */
    private boolean isLongStandingCustomer() {
        return customer.yearsWithMHPCO() >= LOYALTY_YEARS;
    }

    /**
     * Every item in a quote is treated as a first insurance, regardless of the
     * customer's history with the MHPCO, and carries a 10 % initial assessment
     * surcharge on the policy premium.
     */
    private BigDecimal initialAssessmentSurcharge(BigDecimal policyPremium) {
        return Percentage.of(policyPremium, INITIAL_ASSESSMENT_SURCHARGE_PERCENT);
    }

}
