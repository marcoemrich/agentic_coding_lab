import java.math.BigDecimal;
import java.util.List;

/**
 * The item-specific risk surcharges the MHPCO levies on the items of a quote.
 *
 * <p>Holds the MHPCO's reading of the scope question: an item-specific
 * surcharge is a percentage of the base premium of the affected item, not of
 * the policy base premium. The surcharges of a quote are therefore the sum,
 * over its items, of every recognised risk that item carries. Defers which
 * risks exist and what each costs to the MHPCO's list of insurable risks.
 *
 * <p>Changes whenever the MHPCO revises how an item-specific surcharge is
 * measured or accumulated; knows nothing about the policy-wide modifiers
 * (loyalty, first insurance, follow-up contract), which apply to the policy
 * base premium.
 */
final class RiskSurcharges {

    private RiskSurcharges() {
    }

    static BigDecimal of(List<Item> items) {
        return items.stream()
                .map(RiskSurcharges::surchargesOn)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static BigDecimal surchargesOn(Item item) {
        BigDecimal itemBasePremium = PriceList.basePremiumFor(item);
        return InsurableRisk.carriedBy(item).stream()
                .map(risk -> risk.surchargeRate().ofAmount(itemBasePremium))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
