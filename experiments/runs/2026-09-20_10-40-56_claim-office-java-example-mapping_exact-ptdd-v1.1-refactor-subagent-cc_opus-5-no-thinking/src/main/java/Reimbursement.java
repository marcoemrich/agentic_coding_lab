import java.math.BigDecimal;
import java.util.List;

/**
 * What the MHPCO reimburses for an incident, before the policy's cap is
 * applied.
 *
 * <p>Knows that a deductible applies per damage event — once for each damaged
 * item — and that it is taken off after the clauses have said how much of the
 * damage is reimbursed at all. Defers which item a damage entry names, and
 * what the clauses make of it, to those two.
 */
final class Reimbursement {

    private static final BigDecimal DEDUCTIBLE_IN_G = BigDecimal.valueOf(100);

    private Reimbursement() {
    }

    static BigDecimal of(List<Item> insured, Incident incident) {
        BigDecimal reimbursement = BigDecimal.ZERO;
        for (DamagedItem damaged : DamagedItem.of(insured, incident.damages())) {
            reimbursement = reimbursement.add(reimbursementFor(damaged));
        }
        return reimbursement;
    }

    private static BigDecimal reimbursementFor(DamagedItem damaged) {
        BigDecimal damage = BigDecimal.valueOf(damaged.damage().amount());
        return DamageClause.reimbursedPartOf(damaged.insured(), damage)
                .subtract(DEDUCTIBLE_IN_G)
                .max(BigDecimal.ZERO);
    }
}
