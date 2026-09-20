/** One damaged item within an incident. */
public record Damage(String itemType, int amount) {

    public Damage {
        if (amount < 0) {
            throw new ClaimOfficeException("damage amount must not be negative: " + amount);
        }
    }
}
