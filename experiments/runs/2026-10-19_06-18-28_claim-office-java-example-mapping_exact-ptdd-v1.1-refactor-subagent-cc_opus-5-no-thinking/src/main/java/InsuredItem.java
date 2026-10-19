/**
 * An item a policy covers, as the office records it.
 *
 * The office reads the recorded facts to classify the item's risk, so the
 * classifications live here with the facts they read, while what each risk
 * costs is the premium rules' business in {@link PremiumPolicy}. The
 * enchantment level carries more than one such classification: the premium
 * rules surcharge a high enchantment from level 5 up, and the claim rules have
 * their own, higher threshold, so each threshold is named for the rule it
 * serves rather than sharing one vague "enchanted" predicate.
 */
public record InsuredItem(String type, boolean cursed, int enchantment) {

    private static final int HIGH_ENCHANTMENT_LEVEL = 5;
    private static final int UNRULY_ENCHANTMENT_LEVEL = 8;

    /**
     * The office counts an item as highly enchanted, and so as carrying a risk
     * worth a surcharge, from enchantment level 5 up.
     */
    public boolean isHighlyEnchanted() {
        return enchantment >= HIGH_ENCHANTMENT_LEVEL;
    }

    /**
     * From enchantment level 8 up the office considers an item too unruly for
     * its damage to be reimbursed in full. What such a damage earns instead is
     * the claim rules' clause to state, in {@link ClaimPolicy}.
     */
    public boolean isTooUnrulyToReimburseInFull() {
        return enchantment >= UNRULY_ENCHANTMENT_LEVEL;
    }
}
