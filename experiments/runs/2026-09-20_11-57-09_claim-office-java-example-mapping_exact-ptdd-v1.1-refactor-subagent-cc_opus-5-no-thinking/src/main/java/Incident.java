import java.util.List;

/**
 * A damage event reported against a policy: what caused it, and what it damaged.
 */
public record Incident(String cause, List<Damage> damages) {
}
