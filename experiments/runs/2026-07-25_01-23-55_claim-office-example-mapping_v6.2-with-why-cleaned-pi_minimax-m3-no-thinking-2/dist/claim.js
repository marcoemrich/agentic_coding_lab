const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
function reimbursementRate(item) {
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD) {
        return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
    }
    return 1.0;
}
function nextAvailableItem(policy, type, used) {
    const matching = policy.items.filter((i) => i.type === type);
    const consumed = used[type] ?? 0;
    if (consumed >= matching.length) {
        return null;
    }
    return matching[consumed];
}
export function claim(input) {
    const { policy, damages } = input;
    for (const damage of damages) {
        if (damage.amount < 0) {
            throw new Error(`negative damage amount: ${damage.amount}`);
        }
    }
    let total = 0;
    const used = {};
    for (const damage of damages) {
        const item = nextAvailableItem(policy, damage.itemType, used);
        if (item === null) {
            throw new Error(`item not in policy: ${damage.itemType}`);
        }
        used[damage.itemType] = (used[damage.itemType] ?? 0) + 1;
        const rate = reimbursementRate(item);
        total += damage.amount * rate - DEDUCTIBLE;
    }
    const payout = Math.max(0, Math.min(total, policy.remainingCap));
    return {
        payout: Math.floor(payout),
        remainingCap: policy.remainingCap - Math.floor(payout),
    };
}
