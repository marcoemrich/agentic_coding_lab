import static java.util.stream.Collectors.counting;
import static java.util.stream.Collectors.groupingBy;

import java.util.List;
import java.util.Map;

/**
 * What a policy covers: the items the office recorded when it wrote the policy,
 * able to say which of them a reported damage is settled on.
 *
 * Reading a damage report against the covered items is a decision of its own,
 * revised on its own schedule and quite apart from what one damage earns or what
 * the cap allows.
 */
record Coverage(List<InsuredItem> insuredItems) {

    static Coverage of(List<InsuredItem> insuredItems) {
        return new Coverage(List.copyOf(insuredItems));
    }

    /**
     * What the office requires of an incident before it settles any of it: the
     * damages reported of a kind can be no more than the items of that kind the
     * policy covers, because each damage reported is a separate damage to a
     * separate covered item. An incident reporting more is no claim the office
     * will settle, and it refuses the claim whole rather than settling the part
     * it does cover.
     */
    void requireIncidentIsCovered(List<Damage> damages) {
        for (Map.Entry<String, Long> reported : countedByKind(damages).entrySet()) {
            if (reported.getValue() > coveredOfKind(reported.getKey())) {
                throw new RejectedScenario("the policy covers fewer items of type "
                        + reported.getKey() + " than the incident reports damaged");
            }
        }
    }

    /**
     * How many damages the incident reports of each kind of item. The kind is
     * read from the damage report verbatim, as {@link #isOfKind} reads it of a
     * covered item, so that the two sides of the comparison count the same kinds.
     */
    private static Map<String, Long> countedByKind(List<Damage> damages) {
        return damages.stream().collect(groupingBy(Damage::itemType, counting()));
    }

    /** How many items of the kind a damage report names the policy covers. */
    private long coveredOfKind(String damagedItemType) {
        return insuredItems.stream()
                .filter(insuredItem -> isOfKind(insuredItem, damagedItemType))
                .count();
    }

    /**
     * The covered item whose terms a reported damage is settled on: the office
     * looks the reported kind of item up among the items it covers, and the
     * claim rules read the clauses from it. A damage naming a kind of item the
     * coverage does not include is no claim the office will settle.
     *
     * The office matches by the kind of item reported. Several covered items of
     * one kind are alike in everything the claim rules read, so which of them a
     * damage is settled on cannot change what it earns; what matters is that
     * there are enough of them, which
     * {@link #requireIncidentIsCovered} has already established.
     */
    InsuredItem itemDamagedBy(Damage damage) {
        for (InsuredItem insuredItem : insuredItems) {
            if (isOfKind(insuredItem, damage.itemType())) {
                return insuredItem;
            }
        }
        throw new RejectedScenario(
                "the policy does not cover an item of type " + damage.itemType());
    }

    /**
     * Whether a covered item is of the kind a damage report names, which is all
     * the office asks of a covered item to settle a damage on it. Recognizing a
     * damage by something narrower than the kind reported would be a revision of
     * this one sentence.
     */
    private static boolean isOfKind(InsuredItem insuredItem, String damagedItemType) {
        return insuredItem.type().equals(damagedItemType);
    }
}
