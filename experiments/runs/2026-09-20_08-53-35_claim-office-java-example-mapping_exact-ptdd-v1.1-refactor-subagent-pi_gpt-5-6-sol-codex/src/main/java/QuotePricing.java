import com.fasterxml.jackson.databind.JsonNode;

final class QuotePricing {
    private QuotePricing() {
    }

    static int premium(JsonNode step, int yearsWithMhpco, boolean followUpContract) {
        int basePremium = 0;
        int itemSurchargesHundredths = 0;
        JsonNode items = step.path("items");
        for (JsonNode item : items) {
            int itemBasePremium = mainItemBasePremium(item.path("type").asText());
            basePremium += itemBasePremium;
            itemSurchargesHundredths += itemRiskSurchargeHundredths(item, itemBasePremium);
        }
        basePremium += componentsBasePremium(items);
        return adjustedPremiumWithItemSurchargesAndFee(
                basePremium, itemSurchargesHundredths, yearsWithMhpco, followUpContract);
    }

    private static int itemRiskSurchargeHundredths(JsonNode item, int itemBasePremium) {
        int surchargeHundredths = 0;
        if (item.path("cursed").asBoolean()) {
            surchargeHundredths += itemBasePremium * 50;
        }
        if (isHighlyEnchanted(item)) {
            surchargeHundredths += itemBasePremium * 30;
        }
        return surchargeHundredths;
    }

    private static boolean isHighlyEnchanted(JsonNode item) {
        return item.path("enchantment").asInt() >= 5;
    }

    private static int componentsBasePremium(JsonNode items) {
        return componentTypeBasePremium(items, "rune")
                + componentTypeBasePremium(items, "moonstone");
    }

    private static int componentTypeBasePremium(JsonNode items, String componentType) {
        int componentCount = 0;
        for (JsonNode item : items) {
            if (componentType.equals(item.path("type").asText())) {
                componentCount++;
            }
        }
        return componentBasePremium(componentCount);
    }

    private static int componentBasePremium(int componentCount) {
        return componentCount == 3 ? 60 : componentCount * 25;
    }

    private static int mainItemBasePremium(String itemType) {
        return switch (itemType) {
            case "sword" -> 100;
            case "amulet" -> 60;
            case "staff" -> 80;
            case "potion" -> 40;
            default -> 0;
        };
    }

    private static int adjustedPremiumWithItemSurchargesAndFee(
            int basePremium, int itemSurchargesHundredths, int yearsWithMhpco,
            boolean followUpContract) {
        int premiumHundredths = basePremium * 100
                + itemSurchargesHundredths
                + policyWideAdjustmentsHundredths(
                        basePremium, yearsWithMhpco, followUpContract)
                + 500;
        return roundPremiumInMhpcoFavor(premiumHundredths);
    }

    private static int roundPremiumInMhpcoFavor(int premiumHundredths) {
        return (premiumHundredths + 99) / 100;
    }

    private static int policyWideAdjustmentsHundredths(
            int basePremium, int yearsWithMhpco, boolean followUpContract) {
        int firstInsuranceSurchargeHundredths = basePremium * 10;
        int loyaltyDiscountHundredths = yearsWithMhpco >= 2 ? basePremium * 20 : 0;
        int followUpContractDiscountHundredths = followUpContract ? basePremium * 15 : 0;
        return firstInsuranceSurchargeHundredths
                - loyaltyDiscountHundredths
                - followUpContractDiscountHundredths;
    }
}
