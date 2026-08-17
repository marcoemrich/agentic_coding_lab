export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export type ClaimResult = { payout: number; remainingCap: number };
export type OperationResult = { premium: number } | ClaimResult;

export interface ScenarioResult {
  results: OperationResult[];
}

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function itemBasePremium(item: Item, policyItems: Item[]): number {
  const alikeCount = policyItems.filter((candidate) => candidate.type === item.type).length;
  if (COMPONENT_TYPES.has(item.type) && alikeCount === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE;
  }
  const listedPremium = BASE_PREMIUM[item.type];
  if (listedPremium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return listedPremium;
}

function itemRiskSurcharge(item: Item, policyItems: Item[]): number {
  const curseRate = item.cursed ? CURSE_SURCHARGE_RATE : 0;
  const enchantmentRate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return itemBasePremium(item, policyItems) * (curseRate + enchantmentRate);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const basePremium = items.reduce(
    (total, item) => total + itemBasePremium(item, items),
    0,
  );
  const riskSurcharge = items.reduce(
    (total, item) => total + itemRiskSurcharge(item, items),
    0,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
  const premium = basePremium
    + riskSurcharge
    + basePremium * INITIAL_ASSESSMENT_RATE
    - loyaltyDiscount
    - followUpDiscount
    + PROCESSING_FEE;
  return Math.ceil(premium);
}

function policyCap(items: Item[]): number {
  return items.reduce((total, item) => total + (INSURANCE_VALUE[item.type] ?? 0), 0) * CAP_MULTIPLIER;
}

function damageReimbursement(damage: Damage, item: Item): number {
  if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
  const reimbursementRate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
  return Math.max(damage.amount * reimbursementRate - DEDUCTIBLE, 0);
}

function insuredItemForDamage(policyItems: Item[], damages: Damage[], damageIndex: number): Item {
  const damage = damages[damageIndex];
  const priorSameTypeCount = damages
    .slice(0, damageIndex)
    .filter((priorDamage) => priorDamage.itemType === damage.itemType).length;
  const item = policyItems.filter((candidate) => candidate.type === damage.itemType)[priorSameTypeCount];
  if (!item) throw new Error("Damaged item is not insured");
  return item;
}

function quotePolicyForClaim(steps: Array<QuoteStep | ClaimStep>, policyIndex: number): QuoteStep {
  const policy = steps[policyIndex];
  if (policy?.op !== "quote") throw new Error("Claim policy must reference a quote");
  return policy;
}

function processClaim(step: ClaimStep, policy: QuoteStep, availableCap: number): ClaimResult {
  const desiredPayout = step.incident.damages.reduce((total, damage, damageIndex) => {
    const item = insuredItemForDamage(policy.items, step.incident.damages, damageIndex);
    return total + damageReimbursement(damage, item);
  }, 0);
  const payout = Math.min(Math.floor(desiredPayout), availableCap);
  return { payout, remainingCap: availableCap - payout };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const remainingCaps = new Map<number, number>();
  const results = scenario.steps.map((step, index): OperationResult => {
    if (step.op === "quote") {
      remainingCaps.set(index, policyCap(step.items));
      const isFollowUp = scenario.steps.slice(0, index).some((priorStep) => priorStep.op === "quote");
      return { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUp) };
    }
    const policy = quotePolicyForClaim(scenario.steps, step.policy);
    const result = processClaim(step, policy, remainingCaps.get(step.policy) ?? 0);
    remainingCaps.set(step.policy, result.remainingCap);
    return result;
  });
  return { results };
}
