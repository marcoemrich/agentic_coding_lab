import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * The MHPCO price list: one published tariff row per insurable item type,
 * stating what the office charges as that item's base premium and what it
 * insures the item for. Main items are listed individually; every component
 * shares one row, because the office prices and insures a rune exactly as it
 * does a moonstone, and a building block of alike components is offered at a
 * special rate.
 *
 * The block rate is the one tariff decision that is not a property of a single
 * item: a block is a quantity of <em>alike</em> components, so the tariff also
 * decides which items count as alike (see {@link #alikenessGroupOf}) and groups
 * them before pricing. It groups for pricing only: the insured values are read
 * per item, because an offer on what the office charges is no revaluation of
 * what it insures.
 *
 * This is the office's tariff. It changes on its own schedule, independently of
 * the modifier rules in {@link PremiumPolicy}.
 */
public class PriceList {

    /**
     * What the office charges and insures for one item type, and whether the
     * office regards that type as a component rather than a main item. The
     * figures are revised on their own schedules — a rate revision repricing
     * premiums need not revalue the items — but they are published together, as
     * one row of the price list, because they describe the same insured thing.
     *
     * Component-hood is published in the same row because it is the same
     * decision as pricing the type alike: the office regards exactly those
     * types it charges and insures at the component rate as components, and
     * only the block offer asks (see {@link #qualifiesForBlockRate}). Listing
     * the component types a second time elsewhere would let a new component
     * type be priced without earning the block offer.
     */
    private record Tariff(BigDecimal basePremium, BigDecimal insuranceValue, boolean component) {

        static Tariff mainItem(String basePremium, String insuranceValue) {
            return new Tariff(new BigDecimal(basePremium), new BigDecimal(insuranceValue), false);
        }
    }

    /** Every component is charged and insured alike, whatever its type. */
    private static final Tariff COMPONENT_TARIFF =
            new Tariff(new BigDecimal("25"), new BigDecimal("250"), true);

    /** The published price list: the item types the office insures, and at what. */
    private static final Map<String, Tariff> TARIFF = Map.of(
            "sword", Tariff.mainItem("100", "1000"),
            "amulet", Tariff.mainItem("60", "600"),
            "staff", Tariff.mainItem("80", "800"),
            "potion", Tariff.mainItem("40", "400"),
            "rune", COMPONENT_TARIFF,
            "moonstone", COMPONENT_TARIFF);

    /** A building block of exactly 3 alike components is offered at this rate. */
    private static final BigDecimal COMPONENT_BLOCK_BASE_PREMIUM = new BigDecimal("60");
    private static final int COMPONENT_BLOCK_SIZE = 3;

    /**
     * The insurance sum of a policy: the sum of its items' insurance values,
     * each item valued on its own.
     *
     * This deliberately asks nothing about holdings, while
     * {@link #policyBasePremium} prices alike items together. The two figures of
     * a tariff row are read on different terms because the block rate is an
     * offer on what the office <em>charges</em>, not a revaluation of what it
     * <em>insures</em>: a block of 3 runes is charged 60 G but still insured for
     * 3 x 250 G, so the cap it earns is untouched by the discount. Any future
     * holding-dependent offer belongs in the premium fold alone; a revision that
     * also revalued a holding would be the first to group items here.
     */
    public BigDecimal insuranceSum(List<InsuredItem> insuredItems) {
        BigDecimal total = BigDecimal.ZERO;
        for (InsuredItem insuredItem : insuredItems) {
            total = total.add(tariffFor(insuredItem.type()).insuranceValue());
        }
        return total;
    }

    /**
     * The base premium for all items a policy covers, alike items priced
     * together because the block rate is an offer on a holding rather than on a
     * single item. This is the one fold that groups: {@link #insuranceSum}
     * values each item on its own, as the block offer leaves the insured values
     * alone.
     */
    public BigDecimal policyBasePremium(List<InsuredItem> insuredItems) {
        BigDecimal total = BigDecimal.ZERO;
        for (Map.Entry<String, Integer> alikeItems : groupedByAlikeness(insuredItems).entrySet()) {
            total = total.add(basePremium(alikeItems.getKey(), alikeItems.getValue()));
        }
        return total;
    }

    /**
     * The base premium of one insured item on its own, which is what an
     * item-specific surcharge such as the curse surcharge is charged on. A
     * component priced within a block is not charged on its own.
     */
    public BigDecimal basePremium(InsuredItem insuredItem) {
        return basePremium(insuredItem.type(), 1);
    }

    private static Map<String, Integer> groupedByAlikeness(List<InsuredItem> insuredItems) {
        Map<String, Integer> counts = new LinkedHashMap<>();
        for (InsuredItem insuredItem : insuredItems) {
            counts.merge(alikenessGroupOf(insuredItem.type()), 1, Integer::sum);
        }
        return counts;
    }

    /**
     * The office counts two items as alike when they are of exactly the same
     * type, not merely of the same family: 2 runes and a moonstone are three
     * loose components priced at 75 G, never a block, because a moonstone is not
     * a rune. Widening "alike" to a family (rune-y, gemstone-y) would mean
     * returning a family name here instead of the type itself.
     */
    private static String alikenessGroupOf(String itemType) {
        return itemType;
    }

    /**
     * The tariff row for an item type. The office insures only the items on its
     * price list, so an item it does not recognize is no business of its own.
     */
    private static Tariff tariffFor(String itemType) {
        Tariff tariff = TARIFF.get(itemType);
        if (tariff == null) {
            throw new RejectedScenario("the MHPCO does not insure items of type " + itemType);
        }
        return tariff;
    }

    /**
     * What a holding of alike items of one type costs: the type's own rate per
     * item, except that a block of components is offered at the block rate.
     */
    private static BigDecimal basePremium(String itemType, int count) {
        if (qualifiesForBlockRate(itemType, count)) {
            return COMPONENT_BLOCK_BASE_PREMIUM;
        }
        return tariffFor(itemType).basePremium().multiply(BigDecimal.valueOf(count));
    }

    /**
     * The office grants the block rate only to a holding of exactly 3 alike
     * components. It neither prices a part of a block at the block rate (4
     * components are not a block) nor breaks a larger holding down into blocks
     * (7 components are priced as 7, not as two blocks and one loose component).
     * Main items are never blocked: 3 swords are 3 swords.
     */
    private static boolean qualifiesForBlockRate(String itemType, int alikeItemCount) {
        return tariffFor(itemType).component() && alikeItemCount == COMPONENT_BLOCK_SIZE;
    }
}
