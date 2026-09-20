/**
 * An item offered for insurance, as described in the scenario.
 *
 * Components such as runes carry no material and no enchantment level.
 */
public record Item(String type, String material, int enchantment, boolean cursed) {

    public Item(String type) {
        this(type, null, 0, false);
    }
}
