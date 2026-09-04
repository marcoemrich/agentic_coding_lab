const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

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

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

/**
 * The base premium of a whole item list. Components are priced per type,
 * because a building block is only offered for a group of exactly
 * BLOCK_SIZE alike components; any other count is charged individually.
 */
function policyBasePremium(items: Item[]): number {
  let total = 0;
  const componentCounts = new Map<string, number>();

  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new ScenarioError(`unknown item type: ${item.type}`);
    }
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += BASE_PREMIUMS[item.type];
    }
  }

  for (const [type, count] of componentCounts) {
    total +=
      count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUMS[type];
  }

  return total;
}

function itemSurcharge(item: Item): number {
  const base = BASE_PREMIUMS[item.type];
  let surcharge = 0;

  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }

  return surcharge;
}

function quote(
  step: QuoteStep,
  customer: Customer,
  previousContracts: number,
): QuoteResult {
  const policyBase = policyBasePremium(step.items);

  const itemSurcharges = step.items.reduce(
    (sum, item) => sum + itemSurcharge(item),
    0,
  );

  let policyAdjustments = policyBase * FIRST_INSURANCE_SURCHARGE;

  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    policyAdjustments -= policyBase * LOYALTY_DISCOUNT;
  }
  if (previousContracts > 0) {
    policyAdjustments -= policyBase * FOLLOW_UP_CONTRACT_DISCOUNT;
  }

  const premium =
    policyBase + itemSurcharges + policyAdjustments + PROCESSING_FEE;

  return { premium: Math.ceil(premium) };
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

/**
 * The reimbursable share of a damage amount, before the deductible.
 *
 * Dragon material is reimbursed in full, which is also the ordinary
 * treatment, so it needs no branch of its own. The high-enchantment clause
 * takes precedence over it: when an item is both dragon-made and highly
 * enchanted, the 50% rule wins.
 */
function reimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return amount;
}

function claim(step: ClaimStep, policy: Policy): ClaimResult {
  const available = [...policy.items];

  const desired = step.incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) {
      throw new ScenarioError(
        `damage amount cannot be negative: ${damage.amount}`,
      );
    }

    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new ScenarioError(
        `the policy does not cover a damaged ${damage.itemType}`,
      );
    }

    const [item] = available.splice(index, 1);
    return sum + Math.max(0, reimbursement(item, damage.amount) - DEDUCTIBLE);
  }, 0);

  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

/** A scenario the MHPCO declines to process. */
export class ScenarioError extends Error {}

export function runScenario(scenario: Scenario): ScenarioResult {
  let contracts = 0;
  const policies = new Map<number, Policy>();

  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) {
        throw new ScenarioError(
          `step ${step.policy} did not create a policy to claim against`,
        );
      }
      return claim(step, policy);
    }

    const result = quote(step, scenario.customer, contracts);
    contracts += 1;
    policies.set(index, {
      items: step.items,
      remainingCap:
        step.items.reduce(
          (sum, item) => sum + INSURANCE_VALUES[item.type],
          0,
        ) * CAP_MULTIPLIER,
    });
    return result;
  });

  return { results };
}
