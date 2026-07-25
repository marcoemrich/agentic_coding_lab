const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const ITEM_RATES = {
    sword: { basePremium: 100, insuranceValue: 1000 },
    amulet: { basePremium: 60, insuranceValue: 600 },
    staff: { basePremium: 80, insuranceValue: 800 },
    potion: { basePremium: 40, insuranceValue: 400 },
    rune: { basePremium: 25, insuranceValue: 250 },
    moonstone: { basePremium: 25, insuranceValue: 250 },
};
const BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
function perItemBase(type, count, rates) {
    if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) {
        return BLOCK_PREMIUM / count;
    }
    return rates.basePremium;
}
function perItemSurcharge(item, base) {
    let surcharge = 0;
    if (item.cursed) {
        surcharge += base * CURSE_RATE;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
        surcharge += base * HIGH_ENCHANTMENT_RATE;
    }
    return surcharge;
}
function policyModifierFor(policyBase, yearsWithMHPCO, contractNumber) {
    let rate = FIRST_INSURANCE_RATE;
    if (yearsWithMHPCO >= LOYALTY_THRESHOLD) {
        rate -= LOYALTY_DISCOUNT_RATE;
    }
    if (contractNumber > 1) {
        rate -= FOLLOWUP_DISCOUNT_RATE;
    }
    return policyBase * rate;
}
export function quote(items, customer, contractNumber) {
    const counts = {};
    for (const item of items) {
        counts[item.type] = (counts[item.type] ?? 0) + 1;
    }
    let policyBase = 0;
    let itemSurcharges = 0;
    let insuranceSum = 0;
    for (const item of items) {
        const rates = ITEM_RATES[item.type];
        if (rates === undefined) {
            throw new Error(`unknown item type: ${item.type}`);
        }
        const count = counts[item.type];
        const base = perItemBase(item.type, count, rates);
        policyBase += base;
        itemSurcharges += perItemSurcharge(item, base);
        insuranceSum += rates.insuranceValue;
    }
    const policyModifier = policyModifierFor(policyBase, customer.yearsWithMHPCO, contractNumber);
    return {
        premium: Math.ceil(policyBase + itemSurcharges + policyModifier + PROCESSING_FEE),
        insuranceSum,
    };
}
