/** Damage of the given amount in G to one insured item of the given type. */
public record Damage(String itemType, int amount) {

    public Damage {
        if (amount < 0) {
            throw new IllegalArgumentException(
                    "damage cannot be reported for a negative amount: " + amount);
        }
    }
}
