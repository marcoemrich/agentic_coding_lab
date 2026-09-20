/** A single insurable object as listed in a quote. */
public record Item(String type, String material, Integer enchantment, boolean cursed) {

    public static Item of(String type) {
        return new Item(type, null, null, false);
    }
}
