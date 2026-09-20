/**
 * One damaged item in an incident reported to the MHPCO.
 *
 * <p>A damage is what the item lost, so the MHPCO refuses a report of a
 * negative amount outright rather than reading it as a credit in its favour.
 */
record Damage(String itemType, int amount) {

    Damage {
        if (amount < 0) {
            throw new RejectedScenario(
                    "a damage of " + amount + " G to a " + itemType + " is not a damage");
        }
    }
}
