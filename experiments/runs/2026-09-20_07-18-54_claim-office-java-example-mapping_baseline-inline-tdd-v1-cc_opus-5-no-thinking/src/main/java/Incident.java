import java.util.List;

/** A damage event reported against a policy. */
public record Incident(String cause, List<Damage> damages) {

    public Incident {
        damages = List.copyOf(damages);
    }
}
