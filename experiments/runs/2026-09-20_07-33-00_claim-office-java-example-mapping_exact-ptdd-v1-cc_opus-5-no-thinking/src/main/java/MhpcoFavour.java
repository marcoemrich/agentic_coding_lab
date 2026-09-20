/**
 * All amounts are rounded to whole G in the MHPCO's favour. Intermediate
 * amounts are kept as fractions; only the final premium or payout is rounded.
 */
final class MhpcoFavour {

    private MhpcoFavour() {
    }

    static int roundedPremium(double premium) {
        return (int) Math.ceil(premium);
    }

    static int roundedPayout(double payout) {
        return (int) Math.floor(payout);
    }
}
