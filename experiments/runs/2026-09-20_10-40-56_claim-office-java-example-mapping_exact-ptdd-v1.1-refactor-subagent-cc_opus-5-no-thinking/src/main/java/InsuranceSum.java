import java.math.BigDecimal;
import java.util.List;

/**
 * The insurance sum a policy covers: the sum of the insurance values of its
 * items.
 *
 * <p>Insurance values are the MHPCO's unmodified valuations. Neither the
 * premium modifiers nor the building block offer bear on them.
 */
final class InsuranceSum {

    private InsuranceSum() {
    }

    static BigDecimal of(List<Item> items) {
        return items.stream()
                .map(PriceList::insuranceValueFor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
