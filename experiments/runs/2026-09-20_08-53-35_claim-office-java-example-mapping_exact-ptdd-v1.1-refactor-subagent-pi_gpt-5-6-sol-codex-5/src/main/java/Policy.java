import java.util.List;

final class Policy {
    private final List<InsuredItem> items;
    private final PolicyPayoutCap payoutCap;

    Policy(List<InsuredItem> items) {
        this.items = List.copyOf(items);
        this.payoutCap = new PolicyPayoutCap(items);
    }

    boolean coversEveryDamage(List<DamageEvent> damages) {
        return PolicyDamageCoverage.coversEveryDamage(items, damages);
    }

    InsuredItem coveredItemFor(DamageEvent damage) {
        return items.stream()
                .filter(item -> item.type().equals(damage.itemType()))
                .findFirst()
                .orElseThrow();
    }

    int remainingCap() {
        return payoutCap.remaining();
    }

    int pay(int desiredPayout) {
        return payoutCap.settle(desiredPayout);
    }
}
