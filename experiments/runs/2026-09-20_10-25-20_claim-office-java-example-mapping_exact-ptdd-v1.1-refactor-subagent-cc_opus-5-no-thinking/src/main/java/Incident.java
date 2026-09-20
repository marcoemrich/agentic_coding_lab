import java.util.List;

/**
 * A damage event reported against a policy: what happened, and what it
 * damaged.
 */
public record Incident(String cause, List<Damage> damages) {
}
