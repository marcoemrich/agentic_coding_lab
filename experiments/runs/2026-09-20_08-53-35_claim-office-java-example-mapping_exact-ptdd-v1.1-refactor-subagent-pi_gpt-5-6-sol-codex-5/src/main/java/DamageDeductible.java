final class DamageDeductible {
    private static final int AMOUNT_IN_HALF_G = 200;

    private DamageDeductible() { }

    static int applyTo(int reimbursableAmountInHalfG) {
        return Math.max(0, reimbursableAmountInHalfG - AMOUNT_IN_HALF_G);
    }
}
