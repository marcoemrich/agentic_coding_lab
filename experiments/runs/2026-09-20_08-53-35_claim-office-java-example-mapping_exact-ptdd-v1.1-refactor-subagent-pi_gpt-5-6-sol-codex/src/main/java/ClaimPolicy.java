import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.List;

final class ClaimPolicy {
    record ClaimResult(int payout, int remainingCap) {
    }

    private final List<JsonNode> insuredItems = new ArrayList<>();
    private final PolicyPayoutCap payoutCap;

    ClaimPolicy(JsonNode items) {
        int insuranceSum = 0;
        for (JsonNode item : items) {
            insuredItems.add(item.deepCopy());
            insuranceSum += InsuranceValuation.forItemType(item.path("type").asText());
        }
        payoutCap = new PolicyPayoutCap(insuranceSum);
    }

    ClaimResult claim(JsonNode incident) {
        long desiredPayoutInHalfGold = desiredPayoutInHalfGold(incident);
        int desiredPayout = roundPayoutDown(desiredPayoutInHalfGold);
        int payout = payoutCap.limitAndConsume(desiredPayout);
        return new ClaimResult(payout, payoutCap.remaining());
    }

    private static int roundPayoutDown(long payoutInHalfGold) {
        return (int) (payoutInHalfGold / DamageReimbursement.HALF_GOLD_UNITS_PER_GOLD);
    }

    private long desiredPayoutInHalfGold(JsonNode incident) {
        long desiredPayoutInHalfGold = 0;
        DamageOccurrenceCoverage coverage = new DamageOccurrenceCoverage(insuredItems);
        for (JsonNode damage : incident.path("damages")) {
            JsonNode item = coverage.claimInsuredOccurrence(damage.path("itemType").asText());
            DamageReport damageReport = new DamageReport(damage);
            desiredPayoutInHalfGold += DamageReimbursement.payoutInHalfGold(item, damageReport);
        }
        return desiredPayoutInHalfGold;
    }

}
