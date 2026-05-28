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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_PREMIUM = 60;

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface Incident {
  cause: string;
  damages: Array<{ itemType: string; amount: number }>;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  const damageCounts: Record<string, number> = {};
  for (const damage of incident.damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }

  for (const [type, count] of Object.entries(damageCounts)) {
    const policyCount = policy.items.filter(i => i.type === type).length;
    if (count > policyCount) throw new Error(`Too many damages for item type: ${type}`);
  }

  let totalPayout = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) throw new Error("Negative damage amount");

    const item = policy.items.find(i => i.type === damage.itemType);
    if (!item) throw new Error(`Item type ${damage.itemType} not in policy`);

    let reimbursement = damage.amount;
    if (item.enchantment != null && item.enchantment >= 8) {
      reimbursement = damage.amount * 0.5;
    } else if (item.material === "dragon") {
      // full reimbursement, no change needed
    }

    const payout = Math.floor(reimbursement - 100);
    totalPayout += payout;
  }

  const payout = Math.min(totalPayout, policy.remainingCap);
  policy.remainingCap = policy.remainingCap - payout;
  return { payout, remainingCap: policy.remainingCap };
}

function computeItemLevelPremium(item: Item): number {
  const base = BASE_PREMIUMS[item.type];
  if (base === undefined) throw new Error(`Unknown item type: ${item.type}`);
  let total = base;
  if (item.cursed) total += base * 0.5;
  if (item.enchantment != null && item.enchantment >= 5) total += base * 0.3;
  return total;
}

function computeBasePremium(items: Item[]): number {
  const componentCounts: Record<string, number> = {};
  let total = 0;

  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += computeItemLevelPremium(item);
    }
  }

  for (const [type, count] of Object.entries(componentCounts)) {
    if (count === 3) {
      total += BLOCK_PREMIUM;
    } else {
      total += count * (BASE_PREMIUMS[type] ?? 0);
    }
  }

  return total;
}

function computePolicyBase(items: Item[]): number {
  const componentCounts: Record<string, number> = {};
  let total = 0;

  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      const base = BASE_PREMIUMS[item.type];
      if (base === undefined) throw new Error(`Unknown item type: ${item.type}`);
      total += base;
    }
  }

  for (const [type, count] of Object.entries(componentCounts)) {
    if (count === 3) {
      total += BLOCK_PREMIUM;
    } else {
      total += count * (BASE_PREMIUMS[type] ?? 0);
    }
  }

  return total;
}

export function quote(customer: { yearsWithMHPCO: number }, items: Item[], isFollowUpContract: boolean): number {
  if (items.length === 0) return 5;

  const itemPremium = computeBasePremium(items);
  const policyBase = computePolicyBase(items);

  let policyModifiers = policyBase * 0.1; // first insurance
  if (customer.yearsWithMHPCO >= 2) policyModifiers -= policyBase * 0.2; // loyalty
  if (isFollowUpContract) policyModifiers -= policyBase * 0.15; // follow-up

  return Math.ceil(itemPremium + policyModifiers + 5);
}