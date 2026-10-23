import java.math.BigDecimal;

/**
 * One damage the customer reports: which kind of item was damaged, and by how
 * much.
 *
 * A report the office will not read at all is refused here rather than settled
 * later, because it is refused on the report alone. The other refusals the
 * office issues — an item not on the price list, a kind the policy does not
 * cover, more damages of a kind than items covered — each need records this
 * report knows nothing of, so each belongs with the records it reads. What makes
 * a report no damage at all is this report's own business, and
 * {@link #requireIsHarmDone} is the one sentence a revision would touch.
 */
public record Damage(String itemType, BigDecimal amount) {

    public Damage {
        requireIsHarmDone(amount);
    }

    /**
     * A damage is harm done, so an amount below nothing is no damage the office
     * will read. Refusing a further kind of report — harm of exactly nothing,
     * say — would be a revision of this one sentence.
     */
    private static void requireIsHarmDone(BigDecimal amount) {
        if (amount.signum() < 0) {
            throw new RejectedScenario(
                    "a damage of " + amount + " G is no damage the MHPCO can read");
        }
    }
}
