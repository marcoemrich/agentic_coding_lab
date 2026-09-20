import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class ClaimOfficeCli {
    private static final int COMPONENT_BASE_PREMIUM = 25;
    private static final int DEDUCTIBLE_PER_DAMAGE_IN_G = 100;
    private static final int HUNDREDTHS_PER_G = 100;
    private static final int HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
    private static final int PROCESSING_FEE_IN_G = 5;
    private static final String ITEM_TYPE_FIELD = "type";
    private static final ObjectMapper JSON = new ObjectMapper();

    private ClaimOfficeCli() { }

    public static void main(String[] args) {
        int status = execute(System.in, System.out, System.err);
        if (status != 0) {
            System.exit(status);
        }
    }

    private static int quotePremium(JsonNode items, int yearsWithMhpco, boolean followUpContract) {
        int basePremium = quoteBasePremium(items);
        int premiumInHundredths = basePremium * HUNDREDTHS_PER_G
                + initialAssessmentSurchargeInHundredths(basePremium)
                + basePremiumOfCursedItems(items) * 50
                + highEnchantmentSurchargeBasis(items) * HIGH_ENCHANTMENT_SURCHARGE_PERCENT
                - loyaltyDiscountInHundredths(basePremium, yearsWithMhpco)
                - followUpContractDiscountInHundredths(basePremium, followUpContract)
                + PROCESSING_FEE_IN_G * HUNDREDTHS_PER_G;
        return roundPremiumInMhpcoFavor(premiumInHundredths);
    }

    private static int roundPremiumInMhpcoFavor(int premiumInHundredths) {
        return (premiumInHundredths + HUNDREDTHS_PER_G - 1) / HUNDREDTHS_PER_G;
    }

    private static int roundPayoutInMhpcoFavor(int payoutInHalfG) {
        return payoutInHalfG / 2;
    }

    private static int followUpContractDiscountInHundredths(int policyBasePremium, boolean followUpContract) {
        return followUpContract ? policyBasePremium * 15 : 0;
    }

    private static int initialAssessmentSurchargeInHundredths(int policyBasePremium) {
        return policyBasePremium * 10;
    }

    private static int loyaltyDiscountInHundredths(int policyBasePremium, int yearsWithMhpco) {
        return yearsWithMhpco >= 2 ? policyBasePremium * 20 : 0;
    }

    private static int highEnchantmentSurchargeBasis(JsonNode items) {
        int enchantedItemBasePremium = 0;
        for (JsonNode item : items) {
            if (isHighlyEnchanted(item)) {
                enchantedItemBasePremium += PriceList.entryFor(item.path(ITEM_TYPE_FIELD).asText()).basePremium();
            }
        }
        return enchantedItemBasePremium;
    }

    private static boolean isHighlyEnchanted(JsonNode item) {
        return item.path("enchantment").asInt() >= 5;
    }

    private static int basePremiumOfCursedItems(JsonNode items) {
        int cursedItemBasePremium = 0;
        for (JsonNode item : items) {
            if (item.path("cursed").asBoolean()) {
                cursedItemBasePremium += PriceList.entryFor(item.path(ITEM_TYPE_FIELD).asText()).basePremium();
            }
        }
        return cursedItemBasePremium;
    }

    private static int quoteBasePremium(JsonNode items) {
        int basePremium = 0;
        Map<String, Integer> alikeComponentCounts = new HashMap<>();
        for (JsonNode item : items) {
            String type = item.path(ITEM_TYPE_FIELD).asText();
            if ("rune".equals(type) || "moonstone".equals(type)) {
                alikeComponentCounts.merge(type, 1, Integer::sum);
            } else {
                basePremium += PriceList.entryFor(type).basePremium();
            }
        }
        for (int count : alikeComponentCounts.values()) {
            basePremium += componentBasePremium(count);
        }
        return basePremium;
    }

    private static int componentBasePremium(int alikeComponentCount) {
        return alikeComponentCount == 3 ? 60 : alikeComponentCount * COMPONENT_BASE_PREMIUM;
    }

    private static final class PriceList {
        private PriceList() { }

        private static PriceListEntry entryFor(String type) {
            return switch (type) {
                case "sword" -> new PriceListEntry(100, 1000);
                case "amulet" -> new PriceListEntry(60, 600);
                case "staff" -> new PriceListEntry(80, 800);
                case "potion" -> new PriceListEntry(40, 400);
                case "rune", "moonstone" -> new PriceListEntry(COMPONENT_BASE_PREMIUM, 250);
                default -> throw new IllegalArgumentException("Unknown item type: " + type);
            };
        }
    }

    private record PriceListEntry(int basePremium, int insuranceValue) { }

    public static int execute(InputStream input, PrintStream output, PrintStream error) {
        try {
            JsonNode scenario = JSON.readTree(input);
            ArrayNode results = JSON.createArrayNode();
            Map<Integer, Policy> policies = new HashMap<>();
            int yearsWithMhpco = scenario.path("customer").path("yearsWithMHPCO").asInt();
            int stepIndex = 0;
            for (JsonNode step : scenario.path("steps")) {
                if ("quote".equals(step.path("op").asText())) {
                    JsonNode items = step.path("items");
                    policies.put(stepIndex, new Policy(items));
                    ObjectNode result = JSON.createObjectNode();
                    result.put("premium", quotePremium(items, yearsWithMhpco, policies.size() > 1));
                    results.add(result);
                } else {
                    Policy policy = policies.get(step.path("policy").asInt());
                    int payout = policy.claim(step.path("incident").path("damages"));
                    ObjectNode result = JSON.createObjectNode();
                    result.put("payout", payout);
                    result.put("remainingCap", policy.remainingCap());
                    results.add(result);
                }
                stepIndex++;
            }
            ObjectNode response = JSON.createObjectNode();
            response.set("results", results);
            output.println(JSON.writeValueAsString(response));
            return 0;
        } catch (IOException | RuntimeException exception) {
            error.println(exception.getMessage());
            return 1;
        }
    }

    private static final class Policy {
        private final List<JsonNode> insuredItems = new ArrayList<>();
        private final ClaimCap claimCap;

        private Policy(JsonNode items) {
            for (JsonNode item : items) {
                insuredItems.add(item);
            }
            claimCap = ClaimCap.forInsuredItems(items);
        }

        private int claim(JsonNode damages) {
            return claimCap.pay(roundedUncappedPayoutFor(damages));
        }

        private int remainingCap() {
            return claimCap.remaining();
        }

        private int roundedUncappedPayoutFor(JsonNode damages) {
            int payoutInHalfG = 0;
            DamageCoverage damageCoverage = new DamageCoverage(insuredItems);
            for (JsonNode damage : damages) {
                JsonNode item = damageCoverage.coveredItemFor(damage.path("itemType").asText());
                int amount = validatedDamageAmount(damage);
                payoutInHalfG += ClaimClauses.reimbursementInHalfG(item, amount);
            }
            return roundPayoutInMhpcoFavor(payoutInHalfG);
        }

        private static int validatedDamageAmount(JsonNode damage) {
            int amount = damage.path("amount").asInt();
            if (amount < 0) {
                throw new IllegalArgumentException("Damage amount must not be negative");
            }
            return amount;
        }
    }

    private static final class ClaimCap {
        private int remaining;

        private ClaimCap(int initialCap) {
            remaining = initialCap;
        }

        private static ClaimCap forInsuredItems(JsonNode items) {
            int insuranceSum = 0;
            for (JsonNode item : items) {
                insuranceSum += PriceList.entryFor(item.path(ITEM_TYPE_FIELD).asText()).insuranceValue();
            }
            return new ClaimCap(insuranceSum * 2);
        }

        private int pay(int desiredPayout) {
            int payout = Math.min(desiredPayout, remaining);
            remaining -= payout;
            return payout;
        }

        private int remaining() {
            return remaining;
        }
    }

    private static final class DamageCoverage {
        private final List<JsonNode> availableItems;

        private DamageCoverage(List<JsonNode> insuredItems) {
            availableItems = new ArrayList<>(insuredItems);
        }

        private JsonNode coveredItemFor(String type) {
            for (int index = 0; index < availableItems.size(); index++) {
                if (type.equals(availableItems.get(index).path(ITEM_TYPE_FIELD).asText())) {
                    return availableItems.remove(index);
                }
            }
            throw new IllegalArgumentException("Damage item is not covered: " + type);
        }
    }

    private static final class ClaimClauses {
        private ClaimClauses() { }

        private static int reimbursementInHalfG(JsonNode item, int damageAmount) {
            int reimbursableDamageInHalfG = highEnchantmentClauseApplies(item)
                    ? damageAmount : damageAmount * 2;
            return Math.max(0, reimbursableDamageInHalfG - DEDUCTIBLE_PER_DAMAGE_IN_G * 2);
        }

        private static boolean highEnchantmentClauseApplies(JsonNode item) {
            return item.path("enchantment").asInt() >= 8;
        }
    }
}
