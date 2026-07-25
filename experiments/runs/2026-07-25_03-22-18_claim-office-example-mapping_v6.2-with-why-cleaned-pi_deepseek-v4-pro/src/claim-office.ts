type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };

type ResultEntry = { premium?: number; payout?: number; remainingCap?: number };
type ScenarioResult = { results: ResultEntry[] };

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENTS = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_PREMIUM = 25;

// Item-specific surcharge rates
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

// Policy-wide modifier rates
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const computeComponentPremium = (items: Array<{ type: string }>): number => {
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    componentCounts.set(item.type, (componentCounts.get(item.type) || 0) + 1);
  }
  let total = 0;
  for (const [, count] of componentCounts) {
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
  }
  return total;
};

const getItemSurcharge = (item: Item): number => {
  let surcharge = 0;
  if (item.cursed) {
    surcharge += CURSED_SURCHARGE_RATE;
  }
  if (item.enchantment && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
};

export const runScenario = (input: unknown): ScenarioResult => {
  const scenario = input as { customer: { yearsWithMHPCO: number }; steps: Array<{ op: string; items?: Item[]; policy?: number; incident?: { cause: string; damages: Array<{ itemType: string; amount: number }> } }> };
  const results: ResultEntry[] = [];
  const policies: Array<{ cap: number; remainingCap: number; items: Item[]; rawBase: number; insuranceSum: number }> = [];
  let quoteCount = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const items = step.items || [];
      for (const item of items) {
        if (!BASE_PREMIUMS.hasOwnProperty(item.type) && !COMPONENTS.has(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      let rawBase = 0;
      let insuranceSum = 0;
      let itemSurcharges = 0;
      const componentItems: Item[] = [];
      for (const item of items) {
        if (COMPONENTS.has(item.type)) {
          componentItems.push(item);
        } else {
          const itemPremium = BASE_PREMIUMS[item.type] || 0;
          rawBase += itemPremium;
          insuranceSum += INSURANCE_VALUES[item.type] || 0;
          itemSurcharges += itemPremium * getItemSurcharge(item);
        }
      }
      rawBase += computeComponentPremium(componentItems);
      insuranceSum += componentItems.length * 250;
      let total = rawBase + itemSurcharges;
      total += rawBase * FIRST_INSURANCE_RATE;
      if (scenario.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
        total -= rawBase * LOYALTY_DISCOUNT_RATE;
      }
      if (quoteCount > 0) {
        total -= rawBase * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
      }
      const premium = Math.ceil(total + PROCESSING_FEE);
      const cap = insuranceSum * 2;
      // Store policy for future claims
      const policyInfo = { cap, remainingCap: cap, items: [...items], rawBase, insuranceSum };
      results.push({ premium });
      policies[results.length - 1] = policyInfo;
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy!];
      const damages = step.incident!.damages;
      
      // Validate damages
      for (const dmg of damages) {
        if (dmg.amount < 0) {
          throw new Error(`Negative damage amount: ${dmg.amount}`);
        }
        if (!BASE_PREMIUMS.hasOwnProperty(dmg.itemType) && !COMPONENTS.has(dmg.itemType)) {
          throw new Error(`Unknown item type: ${dmg.itemType}`);
        }
        const matchCount = policy.items.filter(i => i.type === dmg.itemType).length;
        if (matchCount === 0) {
          throw new Error(`Item type ${dmg.itemType} not in policy`);
        }
        
        const damageCountForType = damages.filter(d => d.itemType === dmg.itemType).length;
        if (damageCountForType > matchCount) {
          throw new Error(`More ${dmg.itemType} damages (${damageCountForType}) than insured (${matchCount})`);
        }
      }
      
      let totalPayout = 0;
      for (const dmg of damages) {
        const insuredItem = policy.items.find(i => i.type === dmg.itemType);
        let payout = dmg.amount;
        // Special clauses: high enchantment (>=8) pays 50%, overrides dragon material
        if (insuredItem && insuredItem.enchantment && insuredItem.enchantment >= 8) {
          payout = Math.floor(payout * 0.5);
        }
        // Dragon material: full reimbursement (only applies if enchantment < 8)
        // No special handling needed - full reimbursement is the default
        payout -= 100; // deductible
        if (payout < 0) payout = 0;
        if (payout > policy.remainingCap) {
          payout = policy.remainingCap;
        }
        policy.remainingCap -= payout;
        totalPayout += payout;
      }
      results.push({ payout: totalPayout, remainingCap: policy.remainingCap });
    }
  }

  return { results };
};