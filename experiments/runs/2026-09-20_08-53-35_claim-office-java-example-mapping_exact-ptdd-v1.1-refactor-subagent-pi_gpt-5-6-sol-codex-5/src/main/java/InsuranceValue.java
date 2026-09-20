final class InsuranceValue {
    private InsuranceValue() { }

    static int forItemType(String itemType) {
        return switch (itemType) {
            case "sword" -> 1000;
            case "amulet" -> 600;
            case "staff" -> 800;
            case "potion" -> 400;
            case "rune", "moonstone" -> 250;
            default -> 0;
        };
    }
}
