final class DamagePayout {
    private DamagePayout() { }

    static int forDamage(InsuredItem item, int damageAmount) {
        int payoutInHalfG = DamageDeductible.applyTo(
                DamageReimbursement.reimbursableAmountInHalfG(item, damageAmount));
        return PayoutRounding.downToWholeG(payoutInHalfG);
    }
}
