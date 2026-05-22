const MAIN_ITEMS: Record<string, { value: number; basePremium: number }> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isKnownType(type: string): boolean {
  return type in MAIN_ITEMS || isComponent(type);
}

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage {
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
    damages: Damage[];
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

function computeComponentPremium(components: Item[]): number {
  const groups = new Map<string, number>();
  for (const c of components) {
    groups.set(c.type, (groups.get(c.type) || 0) + 1);
  }

  let total = 0;
  for (const [, count] of groups) {
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
}

function computeInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      sum += COMPONENT_VALUE;
    } else {
      sum += MAIN_ITEMS[item.type].value;
    }
  }
  return sum;
}

function computePremium(items: Item[], customer: { yearsWithMHPCO: number }, quoteIndex: number): number {
  if (items.length === 0) return PROCESSING_FEE;

  // Separate main items and components
  const mainItems: Item[] = [];
  const components: Item[] = [];
  for (const item of items) {
    if (isComponent(item.type)) {
      components.push(item);
    } else {
      mainItems.push(item);
    }
  }

  // Compute base premiums for main items
  let policyBasePremium = 0;
  let itemSurcharges = 0;

  for (const item of mainItems) {
    const base = MAIN_ITEMS[item.type].basePremium;
    policyBasePremium += base;

    // Item-specific surcharges (applied to the item's base premium)
    if (item.cursed) {
      itemSurcharges += base * 0.5;
    }
    if ((item.enchantment ?? 0) >= 5) {
      itemSurcharges += base * 0.3;
    }
  }

  // Add component premiums to policy base
  const componentPremium = computeComponentPremium(components);
  policyBasePremium += componentPremium;

  // Policy-wide modifiers apply to policyBasePremium (sum of item base premiums, before item surcharges)
  let policyModifiers = 0;

  // First insurance surcharge: 10% of policy base (always applies)
  policyModifiers += policyBasePremium * 0.1;

  // Loyalty discount: 20% off policy base (customer >= 2 years)
  if (customer.yearsWithMHPCO >= 2) {
    policyModifiers -= policyBasePremium * 0.2;
  }

  // Follow-up contract discount: 15% off policy base (not the first quote)
  if (quoteIndex > 0) {
    policyModifiers -= policyBasePremium * 0.15;
  }

  // Total = policyBasePremium + itemSurcharges + policyModifiers
  const subtotal = policyBasePremium + itemSurcharges + policyModifiers;

  // Round up (in MHPCO's favor for premiums) then add fee
  return Math.ceil(subtotal) + PROCESSING_FEE;
}

function computePayout(
  damage: Damage,
  policyItem: Item,
): number {
  const enchantment = policyItem.enchantment ?? 0;
  const material = policyItem.material ?? '';

  let reimbursement = damage.amount;

  // High enchantment (>= 8): 50% reimbursement
  if (enchantment >= 8) {
    reimbursement = damage.amount * 0.5;
  }
  // Dragon material: full reimbursement (but high enchantment takes priority)
  // Note: if both apply, 50% wins

  // Round down for payout (in MHPCO's favor)
  reimbursement = Math.floor(reimbursement);

  // Apply deductible per damage item
  reimbursement = Math.max(0, reimbursement - DEDUCTIBLE);

  return reimbursement;
}

export function processScenario(scenario: Scenario): { results: any[] } {
  const { customer, steps } = scenario;
  const results: any[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    if (step.op === 'quote') {
      // Validate items
      for (const item of step.items) {
        if (!isKnownType(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }

      const premium = computePremium(step.items, customer, quoteCount);
      const insuranceSum = computeInsuranceSum(step.items);
      const cap = insuranceSum * 2;

      policies.set(i, {
        items: step.items,
        insuranceSum,
        cap,
        remainingCap: cap,
      });

      quoteCount++;
      results.push({ premium });

    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new Error(`No policy at step index ${step.policy}`);
      }

      // Validate damages
      for (const damage of step.incident.damages) {
        if (!isKnownType(damage.itemType)) {
          throw new Error(`Unknown item type in damage: ${damage.itemType}`);
        }
        if (damage.amount < 0) {
          throw new Error(`Negative damage amount: ${damage.amount}`);
        }
      }

      // Count how many of each type are damaged vs insured
      const damageCounts = new Map<string, number>();
      for (const damage of step.incident.damages) {
        damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) || 0) + 1);
      }

      const policyCounts = new Map<string, number>();
      for (const item of policy.items) {
        policyCounts.set(item.type, (policyCounts.get(item.type) || 0) + 1);
      }

      for (const [type, count] of damageCounts) {
        if (!policyCounts.has(type) || count > (policyCounts.get(type) || 0)) {
          throw new Error(`More damages for ${type} than covered by policy`);
        }
      }

      // Match each damage to a policy item (by type, consuming items in order)
      const availableItems = [...policy.items];
      let totalPayout = 0;

      for (const damage of step.incident.damages) {
        const idx = availableItems.findIndex(item => item.type === damage.itemType);
        const policyItem = availableItems[idx];
        availableItems.splice(idx, 1);

        totalPayout += computePayout(damage, policyItem);
      }

      // Apply cap
      const actualPayout = Math.min(totalPayout, policy.remainingCap);
      policy.remainingCap -= actualPayout;

      results.push({ payout: actualPayout, remainingCap: policy.remainingCap });
    }
  }

  return { results };
}
