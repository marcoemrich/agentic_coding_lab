record DamageEvent(String itemType, int amount) {
    boolean hasNegativeAmount() {
        return amount < 0;
    }
}
