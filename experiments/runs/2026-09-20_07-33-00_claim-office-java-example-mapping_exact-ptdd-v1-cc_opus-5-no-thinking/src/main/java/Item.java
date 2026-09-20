/** An item a customer wishes to insure. */
record Item(String type, String material, int enchantment, boolean cursed) {

    Item(String type) {
        this(type, "", 0, false);
    }
}
