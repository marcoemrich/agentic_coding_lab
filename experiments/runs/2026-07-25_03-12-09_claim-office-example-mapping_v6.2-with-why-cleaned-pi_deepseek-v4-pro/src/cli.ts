type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type PolicyResult = QuoteResult | ClaimResult;

interface QuoteItem {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface StoredPolicyItem {
  type: string;
  material?: string;
  enchantment?: number;
  insuranceValue: number;
}

interface StoredPolicy {
  items: StoredPolicyItem[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

interface Step {
  op: string;
  items?: QuoteItem[];
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface DamageEntry {
  itemType: string;
  amount: number;
}

interface ClaimIncident {
  cause: string;
  damages: DamageEntry[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: ClaimIncident;
}

// ============================================================
// Configuration constants
// ============================================================

const VALID_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

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
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_DISCOUNT = 0.15;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const EXTREME_ENCHANTMENT_THRESHOLD = 8;
const CAP_MULTIPLIER = 2;
const ROUNDING_EPSILON = 0.0001;

// ============================================================
// Validation
// ============================================================

const validateStepsForUnknownItemTypes = (steps: Step[]): void => {
  for (const step of steps) {
    if (step.op === "quote" && step.items) {
      for (const item of step.items) {
        if (!VALID_ITEM_TYPES.has(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
    }
  }
};

const validateClaimDamages = (policy: StoredPolicy, damages: DamageEntry[]): void => {
  for (const damage of damages) {
    if (!VALID_ITEM_TYPES.has(damage.itemType)) {
      throw new Error(`Unknown item type in damages: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    const policyCount = countPolicyItemsOfType(policy, damage.itemType);
    if (policyCount === 0) {
      throw new Error(`Item type ${damage.itemType} not in policy`);
    }
    const damageCount = countDamageEntriesOfType(damages, damage.itemType);
    if (damageCount > policyCount) {
      throw new Error(`More damage entries (${damageCount}) for ${damage.itemType} than insured (${policyCount})`);
    }
  }
};

// ============================================================
// Lookup helpers
// ============================================================

const insuranceValueOf = (type: string): number => INSURANCE_VALUES[type] ?? 0;

const basePremiumOf = (type: string): number => BASE_PREMIUMS[type] ?? 0;

const countPolicyItemsOfType = (policy: StoredPolicy, itemType: string): number =>
  policy.items.filter(t => t.type === itemType).length;

const countDamageEntriesOfType = (damages: DamageEntry[], itemType: string): number =>
  damages.filter(d => d.itemType === itemType).length;

const calculateComponentTotal = (countsByType: Record<string, number>): number => {
  let total = 0;
  for (const count of Object.values(countsByType)) {
    total += count === BLOCK_SIZE ? BLOCK_PRICE : count * BASE_PREMIUMS.rune;
  }
  return total;
};

// ============================================================
// Quote calculation
// ============================================================

interface QuoteParams {
  items: QuoteItem[];
  yearsWithMHPCO: number;
  quoteIndex: number;
}

const calculateQuote = (params: QuoteParams): { premium: number; items: StoredPolicyItem[] } => {
  const { items, yearsWithMHPCO, quoteIndex } = params;
  let itemTotal = 0;
  let baseTotal = 0;
  const policyItems: StoredPolicyItem[] = [];
  const componentCounts: Record<string, number> = {};

  for (const item of items) {
    policyItems.push(makeQuoteItem(item));

    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      const base = basePremiumOf(item.type);
      baseTotal += base;
      itemTotal += base * (1 + itemModifier(item));
    }
  }

  itemTotal += calculateComponentTotal(componentCounts);

  let policyBase = baseTotal;
  for (const count of Object.values(componentCounts)) {
    policyBase += count * BASE_PREMIUMS.rune;
  }

  const modifierAmount = calculatePolicyModifier(policyBase, yearsWithMHPCO, quoteIndex);
  const total = Math.ceil(itemTotal + modifierAmount + PROCESSING_FEE - ROUNDING_EPSILON);

  return { premium: total, items: policyItems };
};

const makeQuoteItem = (item: QuoteItem): StoredPolicyItem => ({
  type: item.type,
  material: item.material,
  enchantment: item.enchantment,
  insuranceValue: insuranceValueOf(item.type),
});

const itemModifier = (item: QuoteItem): number => {
  let modifier = 0;
  if (item.cursed) modifier += CURSED_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) modifier += HIGH_ENCHANTMENT_SURCHARGE;
  return modifier;
};

const calculatePolicyModifier = (policyBase: number, yearsWithMHPCO: number, quoteIndex: number): number => {
  let modifier = 0;
  if (yearsWithMHPCO >= LOYALTY_THRESHOLD) modifier -= LOYALTY_DISCOUNT;
  modifier += FIRST_INSURANCE_SURCHARGE;
  if (quoteIndex > 0) modifier -= FOLLOWUP_DISCOUNT;
  return policyBase * modifier;
};

// ============================================================
// Claim calculation
// ============================================================

const calculatePayout = (policy: StoredPolicy, damages: DamageEntry[]): { payout: number; remainingCap: number } => {
  let payout = 0;

  for (const damage of damages) {
    const policyItem = policy.items.find(i => i.type === damage.itemType);
    if (!policyItem) continue;

    const isExtremelyEnchanted = (policyItem.enchantment ?? 0) >= EXTREME_ENCHANTMENT_THRESHOLD;
    let reimbursable = isExtremelyEnchanted ? damage.amount * 0.5 : damage.amount;

    reimbursable = Math.max(0, reimbursable - DEDUCTIBLE);

    if (payout + reimbursable > policy.remainingCap) {
      reimbursable = policy.remainingCap - payout;
    }

    payout += Math.floor(reimbursable);
  }

  const remainingCap = policy.remainingCap - payout;
  policy.remainingCap = remainingCap;

  return { payout, remainingCap };
};

const calculateInsuranceSum = (items: StoredPolicyItem[]): number =>
  items.reduce((sum, item) => sum + item.insuranceValue, 0);

// ============================================================
// Main entry point
// ============================================================

export const processScenario = (input: unknown): { results: PolicyResult[] } => {
  const scenario = input as Scenario;
  validateStepsForUnknownItemTypes(scenario.steps);

  const results: PolicyResult[] = [];
  const policies: StoredPolicy[] = [];
  let quoteIndex = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const { premium, items } = calculateQuote({
        items: step.items ?? [],
        yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
        quoteIndex,
      });
      results.push({ premium });

      const insuranceSum = calculateInsuranceSum(items);
      const cap = insuranceSum * CAP_MULTIPLIER;
      policies.push({ items, insuranceSum, cap, remainingCap: cap });
      quoteIndex++;
    } else if (step.op === "claim") {
      const claimStep = step as unknown as ClaimStep;
      const policyIdx = claimStep.policy;

      if (policyIdx >= policies.length) {
        throw new Error(`Policy index ${policyIdx} not found`);
      }
      const policy = policies[policyIdx];

      validateClaimDamages(policy, claimStep.incident.damages);

      const { payout, remainingCap } = calculatePayout(policy, claimStep.incident.damages);
      results.push({ payout, remainingCap });
    }
  }

  return { results };
};