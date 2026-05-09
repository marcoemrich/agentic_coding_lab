export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface DamageEvent {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

const ITEM_BASE_PREMIUMS: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const CURSE_SURCHARGE_RATE = 0.5; // 50%
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3; // 30%
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2; // 20%
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1; // 10%
const FOLLOW_UP_DISCOUNT_RATE = 0.15; // 15%
const PROCESSING_FEE = 5;

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_RATE = 0.5;
const DRAGON_MATERIAL = 'dragon';
const DEDUCTIBLE = 100;

function isComponentType(type: string): boolean {
  return type !== 'sword' && type !== 'amulet' && type !== 'staff' && type !== 'potion';
}

function getItemInsuranceValue(item: Item): number {
  if (ITEM_BASE_PREMIUMS[item.type]) {
    return ITEM_BASE_PREMIUMS[item.type].insuranceValue;
  }
  return COMPONENT_INSURANCE_VALUE;
}

function calculateBasePremium(items: Item[]): number {
  // Group components by type
  const componentsByType: Record<string, number> = {};
  let mainItemsPremium = 0;

  for (const item of items) {
    if (ITEM_BASE_PREMIUMS[item.type]) {
      mainItemsPremium += ITEM_BASE_PREMIUMS[item.type].basePremium;
    } else {
      componentsByType[item.type] = (componentsByType[item.type] || 0) + 1;
    }
  }

  let componentsPremium = 0;
  for (const [type, count] of Object.entries(componentsByType)) {
    // Block discount only applies if count is a multiple of 3
    if (count % COMPONENT_BLOCK_SIZE === 0) {
      // All items can be grouped into blocks
      const numBlocks = count / COMPONENT_BLOCK_SIZE;
      componentsPremium += numBlocks * COMPONENT_BLOCK_PREMIUM;
    } else {
      // No blocks apply if count is not a multiple of 3
      componentsPremium += count * COMPONENT_BASE_PREMIUM;
    }
  }

  return mainItemsPremium + componentsPremium;
}

function applyItemModifiers(basePremium: number, item: Item): number {
  let premium = basePremium;

  if (item.cursed) {
    premium += basePremium * CURSE_SURCHARGE_RATE;
  }

  if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    premium += basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }

  return premium;
}

function applyItemModifiersToTotal(items: Item[]): number {
  let modifiedPremium = 0;

  // Separate main items from components
  const mainItems = items.filter((i) => ITEM_BASE_PREMIUMS[i.type]);
  const components = items.filter((i) => !ITEM_BASE_PREMIUMS[i.type]);

  // Apply modifiers to main items
  for (const item of mainItems) {
    const itemBasePremium = ITEM_BASE_PREMIUMS[item.type].basePremium;
    modifiedPremium += applyItemModifiers(itemBasePremium, item);
  }

  // Apply modifiers to components
  const componentsByType: Record<string, Item[]> = {};
  for (const item of components) {
    if (!componentsByType[item.type]) {
      componentsByType[item.type] = [];
    }
    componentsByType[item.type].push(item);
  }

  for (const [type, typeComponents] of Object.entries(componentsByType)) {
    const count = typeComponents.length;

    // Block discount only applies if count is a multiple of 3
    if (count % COMPONENT_BLOCK_SIZE === 0) {
      // All items can be grouped into blocks
      const numBlocks = count / COMPONENT_BLOCK_SIZE;
      modifiedPremium += numBlocks * COMPONENT_BLOCK_PREMIUM;
    } else {
      // No blocks apply if count is not a multiple of 3
      // Apply modifiers to each individual component
      for (const item of typeComponents) {
        modifiedPremium += applyItemModifiers(COMPONENT_BASE_PREMIUM, item);
      }
    }
  }

  return modifiedPremium;
}

export class Engine {
  quote(
    customer: Customer & { items: Item[]; isFirstInsurance: boolean }
  ): number {
    if (customer.items.length === 0) {
      // Empty policy: only processing fee
      return PROCESSING_FEE;
    }

    const basePremium = calculateBasePremium(customer.items);
    const modifiedPremium = applyItemModifiersToTotal(customer.items);

    let finalPremium = modifiedPremium;

    // Apply policy-wide modifiers
    // Loyalty discount is 20% of the base premium (sum of item base premiums)
    if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
      finalPremium -= basePremium * LOYALTY_DISCOUNT_RATE;
    }

    // First insurance is always +10 (applies to all items as they're new)
    finalPremium += 10;

    // Follow-up contract is -15 for subsequent contracts
    if (!customer.isFirstInsurance) {
      finalPremium -= 15;
    }

    // Add processing fee and round up
    finalPremium += PROCESSING_FEE;
    return Math.ceil(finalPremium);
  }

  createPolicy(
    customer: Customer & { items: Item[]; isFirstInsurance: boolean }
  ): Policy {
    const insuranceSum = customer.items.reduce(
      (sum, item) => sum + getItemInsuranceValue(item),
      0
    );
    const cap = insuranceSum * 2;

    return {
      items: customer.items,
      insuranceSum,
      cap,
      remainingCap: cap,
    };
  }

  claim(policy: Policy, damages: DamageEvent[]): { payout: number; remainingCap: number } {
    let totalPayout = 0;

    for (const damage of damages) {
      const item = policy.items.find((i) => i.type === damage.itemType);
      if (!item) {
        throw new Error(`Item type ${damage.itemType} not found in policy`);
      }

      let reimbursementRate = 1; // Full reimbursement by default

      if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
        reimbursementRate = HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_RATE;
      }

      if (item.material === DRAGON_MATERIAL) {
        reimbursementRate = 1; // Dragon material overrides high enchantment if applicable
      }

      // Apply the clause that gives the lowest payout (highest rate for damage reduction)
      if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
        && item.material === DRAGON_MATERIAL) {
        // Both apply - use the 50% rule (it's worse)
        reimbursementRate = HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_RATE;
      }

      const reimbursed = Math.floor(damage.amount * reimbursementRate);
      const payout = Math.max(0, reimbursed - DEDUCTIBLE);

      totalPayout += payout;
    }

    // Cap the total payout
    const cappedPayout = Math.min(totalPayout, policy.remainingCap);
    policy.remainingCap -= cappedPayout;

    return {
      payout: cappedPayout,
      remainingCap: policy.remainingCap,
    };
  }
}
