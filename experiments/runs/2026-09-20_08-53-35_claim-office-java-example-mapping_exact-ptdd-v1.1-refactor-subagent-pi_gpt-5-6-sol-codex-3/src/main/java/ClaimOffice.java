import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class ClaimOffice {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final String ITEM_TYPE_FIELD = "type";
    private static final int COMPONENT_BASE_PREMIUM = 25;
    private static final int BUILDING_BLOCK_SIZE = 3;
    private static final int BUILDING_BLOCK_BASE_PREMIUM = 60;
    private static final int PROCESSING_FEE = 5;

    private ClaimOffice() {
    }

    public static String process(String scenario) throws Exception {
        JsonNode input = JSON.readTree(scenario);
        ArrayNode results = JSON.createArrayNode();
        int yearsWithMhpco = input.path("customer").path("yearsWithMHPCO").asInt();
        int priorContracts = 0;
        Map<Integer, Policy> policies = new HashMap<>();
        int stepIndex = 0;
        for (JsonNode step : input.path("steps")) {
            ObjectNode result;
            if ("quote".equals(step.path("op").asText())) {
                JsonNode items = step.path("items");
                result = JSON.createObjectNode();
                result.put("premium", quotePremium(items, yearsWithMhpco,
                        priorContracts > 0));
                policies.put(stepIndex, new Policy(items));
                priorContracts++;
            } else {
                Policy policy = policies.get(step.path("policy").asInt());
                if (policy == null) {
                    throw new IllegalArgumentException("Claim references no earlier policy");
                }
                result = policy.claim(step.path("incident").path("damages"));
            }
            results.add(result);
            stepIndex++;
        }
        ObjectNode output = JSON.createObjectNode();
        output.set("results", results);
        return JSON.writeValueAsString(output);
    }

    private static int quotePremium(JsonNode items, int yearsWithMhpco,
                                    boolean followUpContract) {
        return roundPremiumInMhpcoFavor(
                exactPremium(items, yearsWithMhpco, followUpContract));
    }

    private static double exactPremium(JsonNode items, int yearsWithMhpco,
                                       boolean followUpContract) {
        int basePremium = itemsBasePremium(items);
        return basePremium
                + initialAssessmentSurcharge(basePremium)
                + itemSpecificSurcharges(items)
                - loyaltyDiscount(basePremium, yearsWithMhpco)
                - followUpContractDiscount(basePremium, followUpContract)
                + PROCESSING_FEE;
    }

    private static int roundPremiumInMhpcoFavor(double exactPremium) {
        return (int) Math.ceil(exactPremium);
    }

    private static int roundPayoutInMhpcoFavor(double exactPayout) {
        return (int) Math.floor(exactPayout);
    }

    private static double followUpContractDiscount(int policyBasePremium,
                                                   boolean followUpContract) {
        return followUpContract ? policyBasePremium * 15 / 100.0 : 0;
    }

    private static double loyaltyDiscount(int policyBasePremium, int yearsWithMhpco) {
        return yearsWithMhpco >= 2 ? policyBasePremium / 5.0 : 0;
    }

    private static double itemSpecificSurcharges(JsonNode items) {
        double surcharge = 0;
        for (JsonNode item : items) {
            surcharge += cursedSurcharge(item);
            surcharge += highEnchantmentSurcharge(item);
        }
        return surcharge;
    }

    private static double cursedSurcharge(JsonNode item) {
        return item.path("cursed").asBoolean()
                ? ItemPriceList.basePremium(item.path(ITEM_TYPE_FIELD).asText()) / 2.0
                : 0;
    }

    private static double highEnchantmentSurcharge(JsonNode item) {
        return isHighlyEnchanted(item)
                ? ItemPriceList.basePremium(item.path(ITEM_TYPE_FIELD).asText()) * 3 / 10.0
                : 0;
    }

    private static boolean isHighlyEnchanted(JsonNode item) {
        return item.path("enchantment").asInt() >= 5;
    }

    private static int itemsBasePremium(JsonNode items) {
        int basePremium = 0;
        Map<String, Integer> componentCounts = new HashMap<>();
        for (JsonNode item : items) {
            String type = item.path(ITEM_TYPE_FIELD).asText();
            if (ItemPriceList.isComponent(type)) {
                componentCounts.merge(type, 1, Integer::sum);
            } else {
                basePremium += ItemPriceList.basePremium(type);
            }
        }
        for (int componentCount : componentCounts.values()) {
            basePremium += componentsBasePremium(componentCount);
        }
        return basePremium;
    }

    private static int componentsBasePremium(int componentCount) {
        return componentCount == BUILDING_BLOCK_SIZE
                ? BUILDING_BLOCK_BASE_PREMIUM
                : componentCount * COMPONENT_BASE_PREMIUM;
    }

    private static double initialAssessmentSurcharge(int basePremium) {
        return basePremium / 10.0;
    }

    private static final class ItemPriceList {
        private ItemPriceList() {
        }

        private static boolean isComponent(String itemType) {
            return "rune".equals(itemType) || "moonstone".equals(itemType);
        }

        private static int basePremium(String itemType) {
            return switch (itemType) {
                case "sword" -> 100;
                case "amulet" -> 60;
                case "staff" -> 80;
                case "potion" -> 40;
                default -> throw new IllegalArgumentException("Unknown item type: " + itemType);
            };
        }

        private static int insuranceValue(String itemType) {
            return switch (itemType) {
                case "sword" -> 1000;
                case "amulet" -> 600;
                case "staff" -> 800;
                case "potion" -> 400;
                case "rune", "moonstone" -> 250;
                default -> throw new IllegalArgumentException("Unknown item type: " + itemType);
            };
        }
    }

    private static final class Policy {
        private final JsonNode items;
        private final PolicyPayoutCap payoutCap;

        private Policy(JsonNode items) {
            this.items = items.deepCopy();
            payoutCap = new PolicyPayoutCap(items);
        }

        private ObjectNode claim(JsonNode damages) {
            DamageEntryCoverage damageEntryCoverage = new DamageEntryCoverage(items);
            double desiredPayout = 0;
            for (JsonNode damage : damages) {
                String type = damage.path("itemType").asText();
                int amount = damage.path("amount").asInt();
                DamageAmount.requireNonNegative(amount);
                JsonNode item = damageEntryCoverage.consumeCoveredItemFor(type);
                desiredPayout += DamageReimbursement.payoutFor(item, amount);
            }
            int payout = payoutCap.limitAndRecord(desiredPayout);
            ObjectNode result = JSON.createObjectNode();
            result.put("payout", payout);
            result.put("remainingCap", payoutCap.remaining());
            return result;
        }

    }

    private static final class PolicyPayoutCap {
        private static final double INSURANCE_SUM_MULTIPLIER = 2.0;
        private double remaining;

        private PolicyPayoutCap(JsonNode items) {
            remaining = PolicyInsuranceSum.forItems(items) * INSURANCE_SUM_MULTIPLIER;
        }

        private int limitAndRecord(double desiredPayout) {
            double cappedPayout = Math.min(desiredPayout, remaining);
            int finalPayout = roundPayoutInMhpcoFavor(cappedPayout);
            remaining -= finalPayout;
            return finalPayout;
        }

        private int remaining() {
            return (int) remaining;
        }
    }

    private static final class PolicyInsuranceSum {
        private PolicyInsuranceSum() {
        }

        private static int forItems(JsonNode items) {
            int insuranceSum = 0;
            for (JsonNode item : items) {
                insuranceSum += ItemPriceList.insuranceValue(
                        item.path(ITEM_TYPE_FIELD).asText());
            }
            return insuranceSum;
        }
    }

    private static final class DamageEntryCoverage {
        private final Map<String, List<JsonNode>> availableItemsByType = new HashMap<>();

        private DamageEntryCoverage(JsonNode coveredItems) {
            for (JsonNode item : coveredItems) {
                availableItemsByType.computeIfAbsent(
                        item.path(ITEM_TYPE_FIELD).asText(), ignored -> new ArrayList<>()).add(item);
            }
        }

        private JsonNode consumeCoveredItemFor(String damagedItemType) {
            List<JsonNode> availableItems = availableItemsByType.get(damagedItemType);
            if (availableItems == null || availableItems.isEmpty()) {
                throw new IllegalArgumentException(
                        "Damaged item is not covered: " + damagedItemType);
            }
            return availableItems.remove(0);
        }
    }

    private static final class DamageAmount {
        private DamageAmount() {
        }

        private static void requireNonNegative(int amount) {
            if (amount < 0) {
                throw new IllegalArgumentException("Damage amount must not be negative");
            }
        }
    }

    private static final class DamageReimbursement {
        private DamageReimbursement() {
        }

        private static double payoutFor(JsonNode item, int damageAmount) {
            double reimbursableDamage = HighEnchantmentReimbursement.forDamage(item, damageAmount);
            return DamageEventDeductible.applyTo(reimbursableDamage);
        }
    }

    private static final class DamageEventDeductible {
        private static final int AMOUNT = 100;

        private DamageEventDeductible() {
        }

        private static double applyTo(double reimbursableDamage) {
            return Math.max(0, reimbursableDamage - AMOUNT);
        }
    }

    private static final class HighEnchantmentReimbursement {
        private static final int MINIMUM_ENCHANTMENT_LEVEL = 8;

        private HighEnchantmentReimbursement() {
        }

        private static double forDamage(JsonNode item, int damageAmount) {
            return appliesTo(item) ? damageAmount / 2.0 : damageAmount;
        }

        private static boolean appliesTo(JsonNode item) {
            return item.path("enchantment").asInt() >= MINIMUM_ENCHANTMENT_LEVEL;
        }
    }
}
