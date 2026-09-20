final class ItemCatalog {
    private ItemCatalog() { }

    static int basePremium(String type) {
        return switch (type) {
            case "sword" -> 100;
            case "amulet" -> 60;
            case "staff" -> 80;
            case "potion" -> 40;
            case "rune", "moonstone" -> 25;
            default -> throw unknown(type);
        };
    }

    static int insuranceValue(String type) {
        return switch (type) {
            case "sword" -> 1000;
            case "amulet" -> 600;
            case "staff" -> 800;
            case "potion" -> 400;
            case "rune", "moonstone" -> 250;
            default -> throw unknown(type);
        };
    }

    private static IllegalArgumentException unknown(String type) {
        return new IllegalArgumentException("Unknown item type: " + type);
    }
}
