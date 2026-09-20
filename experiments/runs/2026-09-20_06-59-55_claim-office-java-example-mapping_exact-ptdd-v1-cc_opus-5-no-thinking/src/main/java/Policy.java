import java.util.List;
import java.util.Map;

/** An MHPCO policy: the insured items and how much of the payout cap is still available. */
final class Policy {

    private static final int CAP_FACTOR = 2;

    private final List<Map<String, Object>> insuredItems;
    private int remainingCap;

    Policy(List<Map<String, Object>> insuredItems, int insuranceSum) {
        this.insuredItems = List.copyOf(insuredItems);
        this.remainingCap = insuranceSum * CAP_FACTOR;
    }

    IncidentCoverage coverageForIncident() {
        return new IncidentCoverage(insuredItems);
    }

    int remainingCap() {
        return remainingCap;
    }

    int drawFromCap(double desiredPayout) {
        int payout = (int) Math.floor(Math.min(desiredPayout, remainingCap));
        remainingCap -= payout;
        return payout;
    }
}
