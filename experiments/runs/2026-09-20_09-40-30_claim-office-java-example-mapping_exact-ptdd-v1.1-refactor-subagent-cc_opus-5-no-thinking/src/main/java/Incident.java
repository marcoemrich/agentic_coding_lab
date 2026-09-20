import java.util.List;

/** One damage event reported against a policy, with the damage it caused. */
public record Incident(String cause, List<Damage> damages) {
}
