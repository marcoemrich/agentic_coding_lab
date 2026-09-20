/**
 * One reported damage together with the insured item it struck. The policy establishes
 * this pairing when it resolves an incident's damages against what it covers; every
 * later step of a settlement needs both halves together, so they travel together
 * rather than as two lists to be re-aligned by position.
 */
record DamagedItem(Damage damage, Item item) {
}
