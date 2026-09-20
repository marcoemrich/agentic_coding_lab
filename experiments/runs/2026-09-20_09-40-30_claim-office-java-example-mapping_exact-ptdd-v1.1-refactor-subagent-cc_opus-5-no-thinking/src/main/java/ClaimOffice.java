import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

public class ClaimOffice {

    /** A flat charge the office adds to every premium, after every modifier. */
    private static final BigDecimal PROCESSING_FEE = BigDecimal.valueOf(5);

    private final Customer customer;
    private final ContractHistory contractHistory = new ContractHistory();

    public ClaimOffice(Customer customer) {
        this.customer = customer;
    }

    /**
     * The office quotes the premium for the items and, in doing so, writes the
     * contract: the premium is priced against the customer's file as it stands, and
     * only then does the new contract enter that file.
     */
    public int quote(List<Item> items) {
        int premium = premiumFor(items);
        contractHistory.recordContractWritten();
        return premium;
    }

    /** The office writes a policy for the items, charging the quoted premium. */
    public Policy insure(List<Item> items) {
        return new Policy(items, quote(items));
    }

    /** The office settles a claim reported against one of its policies. */
    public Settlement claim(Policy policy, Incident incident) {
        return ClaimSettlement.forIncident(policy, incident);
    }

    /** What the office charges for these items: every scope's contribution, plus the fee. */
    private int premiumFor(List<Item> items) {
        BigDecimal premiumBeforeFee = PolicyModifiers.applyTo(
                        PolicyBasePremium.of(items),
                        customer.isLongStanding(),
                        contractHistory.nextContractIsFollowUp())
                .add(ItemRiskRating.surchargesFor(items));
        return roundInOfficeFavour(premiumBeforeFee.add(PROCESSING_FEE));
    }

    /**
     * A premium is rounded up: the MHPCO rounds in its own favour. Intermediate
     * amounts stay exact fractions, so only this final step loses the remainder.
     */
    private static int roundInOfficeFavour(BigDecimal premium) {
        return premium.setScale(0, RoundingMode.CEILING).intValueExact();
    }
}
