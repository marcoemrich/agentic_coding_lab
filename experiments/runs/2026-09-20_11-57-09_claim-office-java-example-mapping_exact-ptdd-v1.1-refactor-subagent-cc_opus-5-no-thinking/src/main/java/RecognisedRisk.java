/**
 * A risk the MHPCO recognises on a single insured item, and the surcharge rate it carries.
 *
 * The office's risk catalogue: each entry names one hazard, says when an item carries it,
 * and at what rate. Revising a threshold or a rate is a change to one entry; recognising
 * a new hazard is a new entry.
 */
public enum RecognisedRisk {

    CURSE(0.50) {
        @Override
        boolean isCarriedBy(Item item) {
            return item.cursed();
        }
    },

    HIGH_ENCHANTMENT(0.30) {
        /** The enchantment level from which the office surcharges a premium for risk. */
        private static final int SURCHARGED_ENCHANTMENT_LEVEL = 5;

        @Override
        boolean isCarriedBy(Item item) {
            return item.enchantment() >= SURCHARGED_ENCHANTMENT_LEVEL;
        }
    };

    private final double rate;

    RecognisedRisk(double rate) {
        this.rate = rate;
    }

    abstract boolean isCarriedBy(Item item);

    double rate() {
        return rate;
    }
}
