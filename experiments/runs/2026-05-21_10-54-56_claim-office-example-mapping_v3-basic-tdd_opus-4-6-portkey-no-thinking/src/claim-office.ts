const MAIN_ITEMS: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface DamageEntry {
  itemType: string;
  amount: number;
}

interface QuoteStep {
  op: 'quote';
  items: Item[];
}

interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: {
    cause: string;
    damages: DamageEntry[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownItem(type: string): boolean {
  return type in MAIN_ITEMS || isComponent(type);
}

function getInsuranceValue(item: Item): number {
  if (isComponent(item.type)) return COMPONENT_INSURANCE_VALUE;
  return MAIN_ITEMS[item.type].insuranceValue;
}

function computeComponentBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }

  let total = 0;
  for (const [, count] of componentCounts) {
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
}

function computeItemBasePremium(item: Item): number {
  if (isComponent(item.type)) return 0; // handled separately
  return MAIN_ITEMS[item.type].basePremium;
}

function computeItemSurcharges(item: Item): number {
  if (isComponent(item.type)) return 0;
  const base = MAIN_ITEMS[item.type].basePremium;
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * 0.5;
  }
  if ((item.enchantment ?? 0) >= 5) {
    surcharge += base * 0.3;
  }
  return surcharge;
}

function processQuote(
  scenario: Scenario,
  step: QuoteStep,
  quoteIndex: number,
): { premium: number; policy: Policy } {
  for (const item of step.items) {
    if (!isKnownItem(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  // Calculate sum of item base premiums (for main items)
  let policyBasePremium = 0;
  for (const item of step.items) {
    policyBasePremium += computeItemBasePremium(item);
  }
  // Add component premiums
  policyBasePremium += computeComponentBasePremium(step.items);

  // Calculate item-specific surcharges
  let itemSurcharges = 0;
  for (const item of step.items) {
    itemSurcharges += computeItemSurcharges(item);
  }

  // Sum of item base premiums (without surcharges) for policy-wide modifier calculation
  const policyBaseForModifiers = policyBasePremium;

  // Policy-wide modifiers applied to the policy base premium
  let policyModifiers = 0;

  // Loyalty discount: >= 2 years
  if (scenario.customer.yearsWithMHPCO >= 2) {
    policyModifiers -= policyBaseForModifiers * 0.2;
  }

  // First insurance surcharge: 10% - always applies (each item is treated as first insurance)
  policyModifiers += policyBaseForModifiers * 0.1;

  // Follow-up contract discount: 15% on each contract after the first
  if (quoteIndex > 0) {
    policyModifiers -= policyBaseForModifiers * 0.15;
  }

  const rawPremium = policyBasePremium + itemSurcharges + policyModifiers;
  const roundedPremium = Math.ceil(rawPremium);
  const finalPremium = roundedPremium + PROCESSING_FEE;

  // Insurance sum based on unmodified insurance values
  const insuranceSum = step.items.reduce((sum, item) => sum + getInsuranceValue(item), 0);
  const cap = insuranceSum * 2;

  return {
    premium: finalPremium,
    policy: {
      items: step.items,
      insuranceSum,
      cap,
      remainingCap: cap,
    },
  };
}

function processClaim(
  policy: Policy,
  step: ClaimStep,
): { payout: number; remainingCap: number } {
  // Validate damages
  const itemTypeCounts = new Map<string, number>();
  for (const item of policy.items) {
    itemTypeCounts.set(item.type, (itemTypeCounts.get(item.type) ?? 0) + 1);
  }

  const damageTypeCounts = new Map<string, number>();
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    if (!isKnownItem(damage.itemType)) {
      throw new Error(`Unknown item type in damage: ${damage.itemType}`);
    }
    damageTypeCounts.set(damage.itemType, (damageTypeCounts.get(damage.itemType) ?? 0) + 1);
  }

  // Check all damaged item types are in the policy and counts don't exceed
  for (const [type, count] of damageTypeCounts) {
    const insuredCount = itemTypeCounts.get(type) ?? 0;
    if (count > insuredCount) {
      throw new Error(
        `More damage entries for ${type} (${count}) than insured (${insuredCount})`,
      );
    }
  }

  // Match damages to policy items for enchantment/material lookup
  // Build a pool of items per type
  const itemPool = new Map<string, Item[]>();
  for (const item of policy.items) {
    const pool = itemPool.get(item.type) ?? [];
    pool.push(item);
    itemPool.set(item.type, pool);
  }

  let totalPayout = 0;
  const usedIndices = new Map<string, number>();

  for (const damage of step.incident.damages) {
    const pool = itemPool.get(damage.itemType)!;
    const idx = usedIndices.get(damage.itemType) ?? 0;
    const matchedItem = pool[idx];
    usedIndices.set(damage.itemType, idx + 1);

    let reimbursement: number;
    const enchantment = matchedItem?.enchantment ?? 0;
    const material = matchedItem?.material;
    const isDragon = material === 'dragon';
    const isHighEnchant = enchantment >= 8;

    if (isHighEnchant) {
      // 50% reimbursement (this wins even if dragon material)
      reimbursement = damage.amount * 0.5;
    } else if (isDragon) {
      // Full reimbursement
      reimbursement = damage.amount;
    } else {
      // Standard full reimbursement
      reimbursement = damage.amount;
    }

    // Apply deductible per damage entry
    reimbursement = Math.max(0, reimbursement - DEDUCTIBLE);
    totalPayout += reimbursement;
  }

  // Round payout down (in MHPCO's favor)
  totalPayout = Math.floor(totalPayout);

  // Apply cap
  if (totalPayout > policy.remainingCap) {
    totalPayout = policy.remainingCap;
  }

  policy.remainingCap -= totalPayout;

  return {
    payout: totalPayout,
    remainingCap: policy.remainingCap,
  };
}

export function processScenario(scenario: Scenario): { results: any[] } {
  const results: any[] = [];
  const policies = new Map<number, Policy>();
  let quoteIndex = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];

    if (step.op === 'quote') {
      const { premium, policy } = processQuote(scenario, step as QuoteStep, quoteIndex);
      policies.set(i, policy);
      results.push({ premium });
      quoteIndex++;
    } else if (step.op === 'claim') {
      const claimStep = step as ClaimStep;
      const policy = policies.get(claimStep.policy);
      if (!policy) {
        throw new Error(`No policy found at step index ${claimStep.policy}`);
      }
      const { payout, remainingCap } = processClaim(policy, claimStep);
      results.push({ payout, remainingCap });
    }
  }

  return { results };
}
