/**
 * The office refuses to deal with the scenario and says why. A refusal is the
 * office's answer to the whole scenario, not a result within it.
 *
 * Each refusal is raised where the office holds what it takes to decide it,
 * rather than gathered into one gate: the {@link PriceList} refuses an item it
 * does not list, a {@link Coverage} refuses a damage naming a kind it does not
 * cover and an incident reporting more damages of a kind than it covers items,
 * and a {@link Damage} refuses a report that is no damage at all. The first
 * three read records the report knows nothing of; the last is decided on the
 * report alone, which is why it sits with the report and the others do not.
 */
public class RejectedScenario extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public RejectedScenario(String reason) {
        super(reason);
    }
}
