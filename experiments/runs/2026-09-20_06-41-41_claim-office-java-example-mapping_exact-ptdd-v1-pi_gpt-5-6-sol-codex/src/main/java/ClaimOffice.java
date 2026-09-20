import com.fasterxml.jackson.databind.JsonNode;

final class ClaimOffice {
    private static final String TYPE = "type";
    private static final String ENCHANTMENT = "enchantment";

    record ClaimResult(int payout, int remainingCap) {}

    Policy createPolicy(JsonNode items) {
        int insuranceSum = 0;
        for (JsonNode item : items) {
            insuranceSum += insuranceValue(item.path(TYPE).asText());
        }
        return new Policy(items, insuranceSum);
    }

    ClaimResult claim(Policy policy, JsonNode incident) {
        int desiredPayout = desiredReimbursement(policy, incident);
        int payout = policy.payUpToCap(desiredPayout);
        return new ClaimResult(payout, policy.remainingCap());
    }

    private int desiredReimbursement(Policy policy, JsonNode incident) {
        int reimbursementInHundredths = 0;
        java.util.Map<String, Integer> usedByType = new java.util.HashMap<>();
        for (JsonNode damage : incident.path("damages")) {
            String type = damage.path("itemType").asText();
            if (damage.path("amount").asInt() < 0) {
                throw new IllegalArgumentException("Damage amount must not be negative");
            }
            int occurrence = usedByType.getOrDefault(type, 0);
            JsonNode item = insuredItem(policy.items(), type, occurrence);
            usedByType.put(type, occurrence + 1);
            int reimbursementRate = reimbursementRate(item);
            reimbursementInHundredths += Math.max(0,
                    damage.path("amount").asInt() * reimbursementRate - 10_000);
        }
        return reimbursementInHundredths / 100;
    }

    private int reimbursementRate(JsonNode item) {
        return item.has(ENCHANTMENT) && item.path(ENCHANTMENT).asInt() >= 8 ? 50 : 100;
    }

    private JsonNode insuredItem(JsonNode items, String type, int occurrence) {
        int found = 0;
        for (JsonNode item : items) {
            if (type.equals(item.path(TYPE).asText())) {
                if (found == occurrence) {
                    return item;
                }
                found++;
            }
        }
        throw new IllegalArgumentException("Damage item is not covered by policy: " + type);
    }

    int quote(JsonNode items, int yearsWithMhpco, int previousContracts) {
        int basePremium = 0;
        int itemSurchargesInHundredths = 0;
        for (JsonNode item : items) {
            int itemBase = itemBasePremium(item);
            basePremium += itemBase;
            itemSurchargesInHundredths += itemRiskSurcharge(item, itemBase);
        }
        basePremium -= componentBlockDiscount(items, "rune");
        basePremium -= componentBlockDiscount(items, "moonstone");
        int loyaltyDiscount = loyaltyDiscount(basePremium, yearsWithMhpco);
        int followUpDiscount = followUpDiscount(basePremium, previousContracts);
        int premiumInHundredths = basePremium * 110 + itemSurchargesInHundredths
                - loyaltyDiscount - followUpDiscount + 500;
        return (premiumInHundredths + 99) / 100;
    }

    private int followUpDiscount(int basePremium, int previousContracts) {
        return previousContracts > 0 ? basePremium * 15 : 0;
    }

    private int loyaltyDiscount(int basePremium, int yearsWithMhpco) {
        return yearsWithMhpco >= 2 ? basePremium * 20 : 0;
    }

    private int itemRiskSurcharge(JsonNode item, int itemBase) {
        int surcharge = item.path("cursed").asBoolean() ? itemBase * 50 : 0;
        if (item.has(ENCHANTMENT) && item.path(ENCHANTMENT).asInt() >= 5) {
            surcharge += itemBase * 30;
        }
        return surcharge;
    }

    private int componentBlockDiscount(JsonNode items, String componentType) {
        int count = 0;
        for (JsonNode item : items) {
            if (componentType.equals(item.path(TYPE).asText())) {
                count++;
            }
        }
        return count == 3 ? 15 : 0;
    }

    private int insuranceValue(String type) {
        if ("sword".equals(type)) {
            return 1000;
        }
        if ("amulet".equals(type)) {
            return 600;
        }
        if ("staff".equals(type)) {
            return 800;
        }
        if ("potion".equals(type)) {
            return 400;
        }
        if ("rune".equals(type) || "moonstone".equals(type)) {
            return 250;
        }
        return 0;
    }

    private int itemBasePremium(JsonNode item) {
        String type = item.path(TYPE).asText();
        if ("sword".equals(type)) {
            return 100;
        }
        if ("amulet".equals(type)) {
            return 60;
        }
        if ("staff".equals(type)) {
            return 80;
        }
        if ("potion".equals(type)) {
            return 40;
        }
        if ("rune".equals(type) || "moonstone".equals(type)) {
            return 25;
        }
        throw new IllegalArgumentException("Unknown item type: " + type);
    }
}
