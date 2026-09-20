import java.util.Map;
import java.util.Set;

/**
 * The MHPCO price list: what the office charges to insure a single item, and what it
 * insures that item for.
 *
 * The office prices two kinds of item differently. Each main item has its own listing, a
 * single entry stating both of its figures. Components -- runes, moonstones -- share one
 * uniform listing, so a new component type joins the list without figures of its own.
 *
 * The list is also the office's statement of what it insures: a type the list does not
 * name is a type the office does not cover, and asking about it is met with an objection.
 * Membership and figures are one fact per type, which is why they are kept together in one
 * entry -- taking on a new line of business is a single new listing.
 */
public class PriceList {

    /**
     * What the list says about one type of item: the two figures the office quotes from.
     */
    private record Listing(int basePremium, int insuranceValue) {
    }

    private static final Map<String, Listing> MAIN_ITEM_LISTINGS = Map.of(
            "sword", new Listing(100, 1000),
            "amulet", new Listing(60, 600),
            "staff", new Listing(80, 800),
            "potion", new Listing(40, 400));

    private static final Set<String> COMPONENT_TYPES = Set.of("rune", "moonstone");

    private static final Listing COMPONENT_LISTING = new Listing(25, 250);

    public boolean isComponent(Item item) {
        return COMPONENT_TYPES.contains(item.type());
    }

    public int basePremiumFor(Item item) {
        return listingFor(item).basePremium();
    }

    public int insuranceValueOf(Item item) {
        return listingFor(item).insuranceValue();
    }

    /**
     * The office's one act of looking a type up: components are all covered by the uniform
     * component listing, a main item by its own, and a type with no listing is not insured
     * at all.
     */
    private Listing listingFor(Item item) {
        if (isComponent(item)) {
            return COMPONENT_LISTING;
        }
        Listing listing = MAIN_ITEM_LISTINGS.get(item.type());
        if (listing == null) {
            throw new ClaimOfficeException("The office does not insure items of type " + item.type());
        }
        return listing;
    }
}
