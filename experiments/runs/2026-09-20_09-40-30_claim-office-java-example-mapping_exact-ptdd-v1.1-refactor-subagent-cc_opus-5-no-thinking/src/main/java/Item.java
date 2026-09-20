/**
 * An item a customer wishes to insure. Components such as runes carry no material
 * and no enchantment level; for them {@code material} is null and {@code enchantment}
 * is zero.
 */
public record Item(String type, String material, int enchantment, boolean cursed) {

    /** A plain item: no material recorded, unenchanted and not cursed. */
    public Item(String type) {
        this(type, null, 0, false);
    }
}
