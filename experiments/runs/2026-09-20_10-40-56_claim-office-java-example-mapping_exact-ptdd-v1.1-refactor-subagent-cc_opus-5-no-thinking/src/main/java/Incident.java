import java.util.List;

/**
 * A damage event reported against a policy.
 */
record Incident(String cause, List<Damage> damages) {

    Incident {
        damages = List.copyOf(damages);
    }
}
