const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const KNOWN_COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const ITEM_INSURANCE_VALUES = {
    sword: 1000,
    amulet: 600,
    staff: 800,
    potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
function getInsuranceValue(itemType) {
    if (itemType in ITEM_INSURANCE_VALUES) {
        return ITEM_INSURANCE_VALUES[itemType];
    }
    if (KNOWN_COMPONENT_TYPES.has(itemType)) {
        return COMPONENT_INSURANCE_VALUE;
    }
    throw new Error(`Unknown item type: ${itemType}`);
}
function calculatePolicyInsuranceSum(items) {
    let total = 0;
    for (const item of items) {
        total += getInsuranceValue(item.type);
    }
    return total;
}
export function calculateClaim(policy, damages) {
    // Validate damages
    for (const damage of damages) {
        if (damage.amount < 0) {
            throw new Error('Damage amount cannot be negative');
        }
        // This will also throw for unknown types
        getInsuranceValue(damage.itemType);
    }
    // Count items in policy by type
    const itemCountByType = new Map();
    for (const item of policy.items) {
        itemCountByType.set(item.type, (itemCountByType.get(item.type) ?? 0) + 1);
    }
    // Count damaged items by type
    const damageCountByType = new Map();
    for (const damage of damages) {
        damageCountByType.set(damage.itemType, (damageCountByType.get(damage.itemType) ?? 0) + 1);
    }
    // Check that we have enough items for the damages
    for (const [itemType, damageCount] of damageCountByType) {
        const insuredCount = itemCountByType.get(itemType) ?? 0;
        if (damageCount > insuredCount) {
            throw new Error(`More damages for ${itemType} than items in policy`);
        }
    }
    // Calculate insurance sum and cap
    const insuranceSum = calculatePolicyInsuranceSum(policy.items);
    const cap = insuranceSum * 2;
    const remainingCap = policy.remainingCap ?? cap;
    // Calculate payout for each damage
    let totalPayout = 0;
    for (const damage of damages) {
        let payout = damage.amount;
        // Find the item to check for special clauses
        const item = policy.items.find(i => i.type === damage.itemType);
        if (!item) {
            throw new Error(`Item type ${damage.itemType} not in policy`);
        }
        // Apply special clauses (these reduce the payout)
        if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
            // High enchantment clause: 50% reimbursement
            payout = payout * HIGH_ENCHANTMENT_REIMBURSEMENT;
        }
        else if (item.material === 'dragon') {
            // Dragon material clause: full reimbursement (100%)
            // No change to payout
        }
        // Apply deductible
        payout -= DEDUCTIBLE;
        // Ensure non-negative
        if (payout < 0) {
            payout = 0;
        }
        totalPayout += payout;
    }
    // Apply cap
    const finalPayout = Math.min(totalPayout, remainingCap);
    // Round down for payouts
    const roundedPayout = Math.floor(finalPayout);
    return {
        payout: roundedPayout,
        remainingCap: remainingCap - roundedPayout,
    };
}
