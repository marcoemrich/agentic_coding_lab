import java.util.List;

/** A reported damage event and the damages claimed for it. */
public record Incident(String cause, List<Damage> damages) {

    /** Rejects a damage report the MHPCO will not accept. */
    public void validate() {
        for (Damage damage : damages) {
            if (damage.amount() < 0) {
                throw new IllegalArgumentException(
                        "Damage amount cannot be negative: " + damage.amount());
            }
        }
    }
}
