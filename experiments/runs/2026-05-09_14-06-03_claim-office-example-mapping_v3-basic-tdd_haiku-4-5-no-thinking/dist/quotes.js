const BASE_PREMIUMS = {
    sword: 100,
    amulet: 60,
    staff: 80,
    potion: 40,
};
// Known component types
const KNOWN_COMPONENTS = new Set([
    'rune',
    'moonstone',
]);
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60; // for exactly 3 alike components
const PROCESSING_FEE = 5;
// Modifiers (applied as percentages of base)
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
function isMainItem(type) {
    return type in BASE_PREMIUMS;
}
function groupComponents(items) {
    const groups = new Map();
    for (const item of items) {
        if (!isMainItem(item.type)) {
            if (!groups.has(item.type)) {
                groups.set(item.type, []);
            }
            groups.get(item.type).push(item);
        }
    }
    return groups;
}
function calculateComponentBasePremium(items) {
    const groups = groupComponents(items);
    let total = 0;
    for (const [, groupItems] of groups) {
        // Block only applies to EXACTLY 3 components of the same type
        if (groupItems.length === 3) {
            total += COMPONENT_BLOCK_PREMIUM;
        }
        else {
            // No block: pay per-component premium
            total += groupItems.length * COMPONENT_BASE_PREMIUM;
        }
    }
    return total;
}
export function calculateQuote(customer, items, isFollowUp = false) {
    // Validate all items - must be either main items or known components
    for (const item of items) {
        if (!isMainItem(item.type) && !KNOWN_COMPONENTS.has(item.type)) {
            throw new Error(`Unknown item type: ${item.type}`);
        }
    }
    // Calculate ORIGINAL base premium (no surcharges, for policy-wide modifiers)
    let originalBasePremium = 0;
    // Calculate MODIFIED base premium (with item-specific surcharges)
    let modifiedBasePremium = 0;
    // Process main items
    for (const item of items) {
        if (isMainItem(item.type)) {
            const itemBasePremium = BASE_PREMIUMS[item.type];
            originalBasePremium += itemBasePremium;
            let itemPremium = itemBasePremium;
            // Apply item-specific modifiers (adds to base)
            if (item.cursed) {
                itemPremium += itemBasePremium * CURSE_SURCHARGE;
            }
            if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
                itemPremium += itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE;
            }
            modifiedBasePremium += itemPremium;
        }
    }
    // Add components base premium (same for both, no item-specific modifiers)
    const componentPremium = calculateComponentBasePremium(items);
    originalBasePremium += componentPremium;
    modifiedBasePremium += componentPremium;
    // Apply policy-wide modifiers
    let premium = modifiedBasePremium;
    // First insurance: 10% of ORIGINAL base premium
    premium += originalBasePremium * FIRST_INSURANCE_SURCHARGE;
    // Loyalty discount: applied to ORIGINAL base premium
    if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
        premium -= originalBasePremium * LOYALTY_DISCOUNT;
    }
    // Follow-up contract discount: applied to ORIGINAL base premium
    if (isFollowUp) {
        premium -= originalBasePremium * FOLLOW_UP_DISCOUNT;
    }
    // Processing fee
    premium += PROCESSING_FEE;
    // Round in the MHPCO's favor (up for premiums, down for payouts)
    return Math.ceil(premium);
}
