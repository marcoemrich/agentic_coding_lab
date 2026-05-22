export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCH_RATE = 0.3;
const HIGH_ENCH_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;

const MAIN_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE = 25;
const BLOCK_BASE = 60;
const BLOCK_SIZE = 3;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

interface PricedUnit {
  base: number;
  cursed: boolean;
  enchantment: number;
}

function priceItems(items: Item[]): PricedUnit[] {
  const units: PricedUnit[] = [];
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      units.push({
        base: MAIN_BASE[item.type],
        cursed: item.cursed ?? false,
        enchantment: item.enchantment ?? 0,
      });
    }
  }
  for (const count of Object.values(componentCounts)) {
    if (count === BLOCK_SIZE) {
      units.push({ base: BLOCK_BASE, cursed: false, enchantment: 0 });
    } else {
      for (let i = 0; i < count; i++) units.push({ base: COMPONENT_BASE, cursed: false, enchantment: 0 });
    }
  }
  return units;
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCH_PAYOUT_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";
const HIGH_ENCH_PAYOUT_THRESHOLD = 8;

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  let insuranceSum = 0;
  for (const item of items) {
    insuranceSum += INSURANCE_VALUES[item.type];
  }
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

export function claim(policy: Policy, incident: Incident): ClaimResult {
  // Match each damage to an item of the corresponding type (one item, one damage)
  const itemPool: Item[] = [...policy.items];
  let totalPayout = 0;
  for (const damage of incident.damages) {
    const idx = itemPool.findIndex((it) => it.type === damage.itemType);
    if (idx === -1) {
      throw new Error(`damage references item not in policy: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    const item = itemPool.splice(idx, 1)[0];
    let reimbursable = damage.amount;
    const isDragon = item.material === DRAGON_MATERIAL;
    const isHighEnch = (item.enchantment ?? 0) >= HIGH_ENCH_PAYOUT_THRESHOLD;
    if (isHighEnch) {
      reimbursable = damage.amount * HIGH_ENCH_PAYOUT_RATE;
    } else if (isDragon) {
      reimbursable = damage.amount;
    }
    const afterDeductible = Math.max(0, reimbursable - DEDUCTIBLE);
    totalPayout += afterDeductible;
  }
  const capped = Math.min(totalPayout, policy.remainingCap);
  const payout = Math.floor(capped);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function quote(customer: Customer, items: Item[], priorContracts: number): number {
  const units = priceItems(items);
  let policyBase = 0;
  let itemSurcharges = 0;
  for (const u of units) {
    policyBase += u.base;
    if (u.cursed) itemSurcharges += u.base * CURSE_RATE;
    if (u.enchantment >= HIGH_ENCH_THRESHOLD) itemSurcharges += u.base * HIGH_ENCH_RATE;
  }
  let policyMods = policyBase * FIRST_INSURANCE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    policyMods -= policyBase * LOYALTY_RATE;
  }
  if (priorContracts > 0) {
    policyMods -= policyBase * FOLLOW_UP_RATE;
  }
  return Math.ceil(policyBase + itemSurcharges + policyMods + PROCESSING_FEE);
}
