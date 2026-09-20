import java.math.BigDecimal;

/**
 * What the MHPCO reimburses for reported damage: the amount it reimburses for
 * the damage, less the deductible that applies per damage event.
 *
 * This is the one place that says how much an incident is worth to the
 * claimant. How far the MHPCO will actually go in paying that -- what the
 * policy's cap leaves of it -- is a separate decision, made where the policy
 * settles the claim. Whether the office will hear the reported damages at
 * all is another, made by {@link ReportedDamages} before any of them is
 * priced.
 */
public final class Reimbursement {

    private static final int DEDUCTIBLE_PER_DAMAGE_IN_G = 100;

    /**
     * The enchantment level from which the MHPCO reimburses damage at half.
     * It is not the level from which the office charges a high-enchantment
     * risk surcharge on a premium: the office decides what it considers risky
     * enough to charge extra for, and what it considers volatile enough to
     * reimburse only in part, for separate reasons and at separate levels.
     */
    private static final int VOLATILE_ENCHANTMENT_LEVEL = 8;

    private static final int VOLATILE_ITEM_REIMBURSEMENT_PERCENT = 50;

    private Reimbursement() {
    }

    /**
     * An incident is reimbursed damage by damage: the office settles each
     * reported damage on its own and pays the sum, because the deductible is
     * charged per damage event rather than once for the incident.
     *
     * The MHPCO keeps intermediate amounts as fractions and rounds only the
     * final payout, so each damage is settled as a fraction and the sum is
     * rounded to whole G once, here, in the office's favour.
     */
    public static int forIncident(Incident incident, Coverage coverage) {
        ReportedDamages.requireAllALoss(incident.damages());
        return MhpcoFavour.roundedOwedByTheOffice(incident.damages().stream()
                .map(damage -> forDamage(damage, coverage.damagedIn(damage)))
                .reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    /**
     * One reported damage is settled in two steps the MHPCO decides
     * separately: how much of the damage it reimburses at all, and then the
     * deductible it charges for the damage event.
     */
    private static BigDecimal forDamage(Damage damage, Item damagedItem) {
        return reimbursableAmount(damage, damagedItem)
                .subtract(BigDecimal.valueOf(DEDUCTIBLE_PER_DAMAGE_IN_G));
    }

    /**
     * How much of a reported damage the MHPCO reimburses, before the
     * deductible: damage to a volatile item is reimbursed at half, anything
     * else in full.
     */
    private static BigDecimal reimbursableAmount(Damage damage, Item damagedItem) {
        if (isVolatile(damagedItem)) {
            return Percentage.of(damage.amount(), VOLATILE_ITEM_REIMBURSEMENT_PERCENT);
        }
        return BigDecimal.valueOf(damage.amount());
    }

    /**
     * The MHPCO counts an item of enchantment level 8 or more as volatile:
     * too unstable to reimburse in full, whatever it is made of.
     */
    private static boolean isVolatile(Item item) {
        return item.enchantment() >= VOLATILE_ENCHANTMENT_LEVEL;
    }
}
