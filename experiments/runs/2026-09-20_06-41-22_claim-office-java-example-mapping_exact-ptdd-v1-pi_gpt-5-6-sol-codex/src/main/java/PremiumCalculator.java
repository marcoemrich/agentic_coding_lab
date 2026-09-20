import com.fasterxml.jackson.databind.JsonNode;
import java.math.BigDecimal;
import java.math.RoundingMode;

final class PremiumCalculator {
    int quote(JsonNode items, int yearsWithMhpco, boolean followUpContract) {
        int basePremium = 0;
        BigDecimal itemRisk = BigDecimal.ZERO;
        for (JsonNode item : items) {
            int itemBase = ItemCatalog.basePremium(item.path("type").asText());
            basePremium += itemBase;
            itemRisk = itemRisk.add(itemRiskSurcharge(item, itemBase));
        }
        basePremium = componentBlockPremium(items, basePremium);
        BigDecimal premium = BigDecimal.valueOf(basePremium)
                .multiply(customerPolicyRate(yearsWithMhpco, followUpContract))
                .add(itemRisk).add(BigDecimal.valueOf(5));
        return premium.setScale(0, RoundingMode.CEILING).intValueExact();
    }

    private BigDecimal customerPolicyRate(int yearsWithMhpco, boolean followUpContract) {
        BigDecimal rate = yearsWithMhpco >= 2 ? new BigDecimal("0.90") : new BigDecimal("1.10");
        return followUpContract ? rate.subtract(new BigDecimal("0.15")) : rate;
    }

    private BigDecimal itemRiskSurcharge(JsonNode item, int itemBase) {
        BigDecimal riskRate = item.path("cursed").asBoolean()
                ? new BigDecimal("0.50") : BigDecimal.ZERO;
        if (item.path("enchantment").asInt() >= 5) {
            riskRate = riskRate.add(new BigDecimal("0.30"));
        }
        return BigDecimal.valueOf(itemBase).multiply(riskRate);
    }

    private int componentBlockPremium(JsonNode items, int regularPremium) {
        int blockDiscount = count(items, "rune") == 3 ? 15 : 0;
        blockDiscount += count(items, "moonstone") == 3 ? 15 : 0;
        return regularPremium - blockDiscount;
    }

    private int count(JsonNode items, String type) {
        int count = 0;
        for (JsonNode item : items) {
            if (type.equals(item.path("type").asText())) {
                count++;
            }
        }
        return count;
    }

}
