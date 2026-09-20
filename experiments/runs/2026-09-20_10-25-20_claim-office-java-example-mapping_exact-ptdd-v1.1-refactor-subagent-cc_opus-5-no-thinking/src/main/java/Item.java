/**
 * An item a customer wishes to insure. Components such as runes and
 * moonstones carry no material, enchantment or curse.
 */
public record Item(String type, String material, int enchantment, boolean cursed) {

    public Item(String type) {
        this(type, null, 0, false);
    }
}
