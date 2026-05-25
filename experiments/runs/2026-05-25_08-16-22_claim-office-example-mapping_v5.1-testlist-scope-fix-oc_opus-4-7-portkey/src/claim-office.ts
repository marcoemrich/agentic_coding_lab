interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface DamageEntry {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: DamageEntry[] };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type StepResult = { premium: number } | { payout: number; remainingCap: number };

// ----- Item catalog -----

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

// ----- Premium modifiers -----

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANT_SURCHARGE = 0.3;
const HIGH_ENCHANT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_CONTRACT_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

// ----- Claim constants -----

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANT_CLAIM_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";

// ===== Helpers =====

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function validateItem(item: Item): void {
  if (!(item.type in BASE_PREMIUMS)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
}

interface ItemContribution {
  base: number;
  item: Item;
}

/**
 * Per-item base contributions, applying the component block discount.
 * For block components, the block price is distributed evenly across them.
 */
function itemContributions(items: Item[]): ItemContribution[] {
  const componentsByType: Record<string, Item[]> = {};
  for (const item of items) {
    if (isComponent(item)) {
      (componentsByType[item.type] ??= []).push(item);
    }
  }

  const contributions: ItemContribution[] = [];
  for (const item of items) {
    if (isComponent(item)) continue;
    contributions.push({ base: BASE_PREMIUMS[item.type], item });
  }

  for (const [type, group] of Object.entries(componentsByType)) {
    const perItemBase =
      group.length === BLOCK_SIZE ? BLOCK_PRICE / BLOCK_SIZE : BASE_PREMIUMS[type];
    for (const item of group) {
      contributions.push({ base: perItemBase, item });
    }
  }
  return contributions;
}

function itemSpecificMultiplier(item: Item): number {
  let multiplier = 1;
  if (item.cursed) multiplier += CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) {
    multiplier += HIGH_ENCHANT_SURCHARGE;
  }
  return multiplier;
}

interface QuoteContext {
  yearsWithMHPCO: number;
  isFollowUpContract: boolean;
}

function quotePremium(items: Item[], context: QuoteContext): number {
  for (const item of items) validateItem(item);
  const contributions = itemContributions(items);
  let policyBase = 0;
  let itemSpecificSurcharges = 0;
  let firstInsuranceSurcharges = 0;
  for (const { base, item } of contributions) {
    policyBase += base;
    itemSpecificSurcharges += base * (itemSpecificMultiplier(item) - 1);
    firstInsuranceSurcharges += base * FIRST_INSURANCE_SURCHARGE;
  }

  let policyWideAdjustment = 0;
  if (context.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    policyWideAdjustment -= policyBase * LOYALTY_DISCOUNT;
  }
  if (context.isFollowUpContract) {
    policyWideAdjustment -= policyBase * FOLLOWUP_CONTRACT_DISCOUNT;
  }

  const beforeFee =
    policyBase + itemSpecificSurcharges + firstInsuranceSurcharges + policyWideAdjustment;
  return Math.ceil(beforeFee) + PROCESSING_FEE;
}

// ----- Claim processing -----

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

function insuranceSumFor(items: Item[]): number {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = insuranceSumFor(items);
  const cap = insuranceSum * CAP_MULTIPLIER;
  return { items, insuranceSum, cap, remainingCap: cap };
}

function reimbursementRate(item: Item): number {
  // High-enchantment clause beats dragon material; otherwise dragon material gives full.
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_CLAIM_THRESHOLD) {
    return HIGH_ENCHANT_CLAIM_RATE;
  }
  return 1; // standard or dragon material full reimbursement
}

function processClaim(
  policy: Policy,
  damages: DamageEntry[]
): { payout: number; remainingCap: number } {
  // Match each damage entry to an insured item of the matching type.
  const availableByType: Record<string, Item[]> = {};
  for (const item of policy.items) {
    (availableByType[item.type] ??= []).push(item);
  }

  let payout = 0;
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
    const pool = availableByType[damage.itemType];
    if (!pool || pool.length === 0) {
      throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
    }
    const item = pool.shift()!;
    const reimbursement = damage.amount * reimbursementRate(item);
    const afterDeductible = Math.max(0, reimbursement - DEDUCTIBLE);
    payout += afterDeductible;
  }
  const finalPayout = Math.min(payout, policy.remainingCap);
  policy.remainingCap -= finalPayout;
  return { payout: Math.floor(finalPayout), remainingCap: policy.remainingCap };
}

// ===== Public entrypoint =====

export function runScenario(input: unknown): { results: StepResult[] } {
  const scenario = input as Scenario;
  const years = scenario.customer.yearsWithMHPCO;
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const context: QuoteContext = {
        yearsWithMHPCO: years,
        isFollowUpContract: quoteCount > 0,
      };
      quoteCount++;
      const premium = quotePremium(step.items, context);
      policies.set(index, createPolicy(step.items));
      return { premium };
    }
    // claim step
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy index: ${step.policy}`);
    return processClaim(policy, step.incident.damages);
  });

  return { results };
}
