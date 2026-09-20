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
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final Map<String, Price> PRICE_LIST = Map.of(
            "sword", new Price(100, 1000),
            "amulet", new Price(60, 600),
            "staff", new Price(80, 800),
            "potion", new Price(40, 400),
            "rune", new Price(25, 250),
            "moonstone", new Price(25, 250));

    private ClaimOfficeCli() {
    }

    public static void main(String[] args) {
        int status = run(System.in, System.out, System.err);
        if (status != 0) {
            System.exit(status);
        }
    }

    static int run(InputStream input, PrintStream output, PrintStream error) {
        try {
            output.print(process(new String(input.readAllBytes())));
            return 0;
        } catch (RuntimeException | IOException exception) {
            error.println(exception.getMessage());
            return 1;
        }
    }

    static String process(String input) {
        try {
            return process(JSON.readTree(input));
        } catch (IOException exception) {
            throw new IllegalArgumentException("Invalid scenario", exception);
        }
    }

    private static String process(JsonNode scenario) throws IOException {
        int years = scenario.path("customer").path("yearsWithMHPCO").asInt();
        ArrayNode results = JSON.createArrayNode();
        List<Policy> policies = new ArrayList<>();
        int quoteNumber = 0;
        int stepIndex = 0;
        for (JsonNode step : scenario.path("steps")) {
            if ("quote".equals(step.path("op").asText())) {
                Policy policy = createPolicy(step.path("items"));
                policies.add(policy.atStep(stepIndex));
                ObjectNode result = JSON.createObjectNode();
                result.put("premium", premium(policy.items(), years, quoteNumber++));
                results.add(result);
            } else if ("claim".equals(step.path("op").asText())) {
                Policy policy = policyAtStep(policies, step.path("policy").asInt());
                int payout = policy.claim(step.path("incident").path("damages"));
                ObjectNode result = JSON.createObjectNode();
                result.put("payout", payout);
                result.put("remainingCap", policy.remainingCap());
                results.add(result);
            } else {
                throw new IllegalArgumentException("Unknown operation");
            }
            stepIndex++;
        }
        ObjectNode output = JSON.createObjectNode();
        output.set("results", results);
        return JSON.writeValueAsString(output);
    }

    private static Policy policyAtStep(List<Policy> policies, int step) {
        return policies.stream().filter(policy -> policy.step() == step).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown policy"));
    }

    private static Policy createPolicy(JsonNode itemNodes) {
        List<Item> items = new ArrayList<>();
        for (JsonNode node : itemNodes) {
            String type = node.path("type").asText();
            Price price = price(type);
            items.add(new Item(type, node.path("material").asText(),
                    node.path("enchantment").asInt(), node.path("cursed").asBoolean(), price));
        }
        return new Policy(items, -1, 0);
    }

    private static Price price(String type) {
        Price price = PRICE_LIST.get(type);
        if (price == null) {
            throw new IllegalArgumentException("Unknown item type: " + type);
        }
        return price;
    }

    private static int premium(List<Item> items, int years, int quoteNumber) {
        double policyBase = policyBase(items);
        double itemSurcharges = items.stream().mapToDouble(Item::surcharge).sum();
        double loyalty = years >= 2 ? policyBase * 0.20 : 0;
        double followUp = quoteNumber > 0 ? policyBase * 0.15 : 0;
        return (int) Math.ceil(policyBase + itemSurcharges + policyBase * 0.10
                - loyalty - followUp + 5);
    }

    private static double policyBase(List<Item> items) {
        Map<String, Long> componentCounts = new HashMap<>();
        double mainItems = 0;
        for (Item item : items) {
            if (item.isComponent()) {
                componentCounts.merge(item.type(), 1L, Long::sum);
            } else {
                mainItems += item.price().premium();
            }
        }
        double components = componentCounts.values().stream()
                .mapToDouble(count -> count == 3 ? 60 : count * 25).sum();
        return mainItems + components;
    }

    private record Price(int premium, int value) { }

    private record Item(String type, String material, int enchantment, boolean cursed, Price price) {
        boolean isComponent() {
            return "rune".equals(type) || "moonstone".equals(type);
        }

        double surcharge() {
            double result = cursed ? price.premium() * 0.50 : 0;
            if (!isComponent() && enchantment >= 5) {
                result += price.premium() * 0.30;
            }
            return result;
        }

        double reimbursable(int amount) {
            return enchantment >= 8 ? amount * 0.5 : amount;
        }
    }

    private static final class Policy {
        private final List<Item> items;
        private final int step;
        private int remainingCap;

        private Policy(List<Item> items, int step, int remainingCap) {
            this.items = List.copyOf(items);
            this.step = step;
            this.remainingCap = remainingCap;
        }

        Policy atStep(int quoteStep) {
            int insuranceSum = items.stream().mapToInt(item -> item.price().value()).sum();
            return new Policy(items, quoteStep, insuranceSum * 2);
        }

        int claim(JsonNode damages) {
            Map<String, Integer> used = new HashMap<>();
            double desired = 0;
            for (JsonNode damage : damages) {
                int amount = damage.path("amount").asInt();
                if (amount < 0) {
                    throw new IllegalArgumentException("Damage amount must not be negative");
                }
                String type = damage.path("itemType").asText();
                price(type);
                int occurrence = used.merge(type, 1, Integer::sum);
                Item item = items.stream().filter(candidate -> candidate.type().equals(type))
                        .skip(occurrence - 1L).findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("Damaged item is not insured: " + type));
                desired += Math.max(0, item.reimbursable(amount) - 100);
            }
            int payout = (int) Math.floor(Math.min(desired, remainingCap));
            remainingCap -= payout;
            return payout;
        }

        List<Item> items() { return items; }
        int step() { return step; }
        int remainingCap() { return remainingCap; }
    }
}
