/** A single insurable item as described in a quote step. */
public record Item(String type, String material, int enchantment, boolean cursed) {
}
