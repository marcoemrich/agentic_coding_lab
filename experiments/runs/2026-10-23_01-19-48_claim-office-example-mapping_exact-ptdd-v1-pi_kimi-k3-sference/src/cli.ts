import { readFileSync } from "node:fs";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

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

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: { cause: string; damages: Damage[] };
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function buildingBlockPremiumOf(type: string, count: number): number {
  if (count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * BASE_PREMIUMS[type];
}

function itemRiskSurchargeOf(item: Item): number {
  let surcharge = 0;
  if (item.cursed) {
    surcharge += BASE_PREMIUMS[item.type] * CURSE_SURCHARGE_RATE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += BASE_PREMIUMS[item.type] * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function loyaltyDiscountOf(policyBase: number, yearsWithMHPCO: number): number {
  if (yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    return policyBase * LOYALTY_DISCOUNT_RATE;
  }
  return 0;
}

function followUpDiscountOf(policyBase: number, isFollowUpContract: boolean): number {
  if (isFollowUpContract) {
    return policyBase * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  }
  return 0;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUpContract: boolean): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let policyBase = 0;
  for (const [type, count] of counts) {
    policyBase += buildingBlockPremiumOf(type, count);
  }
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const riskSurcharges = items.reduce((sum, item) => sum + itemRiskSurchargeOf(item), 0);
  const loyaltyDiscount = loyaltyDiscountOf(policyBase, yearsWithMHPCO);
  const followUpDiscount = followUpDiscountOf(policyBase, isFollowUpContract);
  const total = policyBase + riskSurcharges + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  return Math.ceil(total);
}

function insuranceSumOf(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

// Clause precedence per MHPCO rules: the high-enchantment 50% clause wins
// over the dragon-material full-reimbursement clause when both apply.
function reimbursementRateOf(item: Item): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  // Dragon-material items (and all others without a special clause) are
  // reimbursed in full.
  return FULL_REIMBURSEMENT_RATE;
}

function reimbursementOf(item: Item, damage: Damage): number {
  const reimbursed = damage.amount * reimbursementRateOf(item);
  return Math.max(reimbursed - DEDUCTIBLE_PER_DAMAGE, 0);
}

function insuredItemOf(policy: Policy, type: string): Item {
  const item = policy.items.find((candidate) => candidate.type === type);
  if (!item) {
    throw new Error(`damaged item not part of policy: ${type}`);
  }
  return item;
}

function validateDamages(policy: Policy, damages: Damage[]): void {
  const damageCounts = new Map<string, number>();
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
  }
  for (const [type, count] of damageCounts) {
    const insured = policy.items.filter((item) => item.type === type).length;
    if (insured === 0) {
      throw new Error(`damaged item not part of policy: ${type}`);
    }
    if (count > insured) {
      throw new Error(`more damages than insured items of type: ${type}`);
    }
  }
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  validateDamages(policy, damages);
  let desired = 0;
  for (const damage of damages) {
    desired += reimbursementOf(insuredItemOf(policy, damage.itemType), damage);
  }
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function runScenario(scenario: Scenario): Record<string, number>[] {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      const premium = quotePremium(items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
      quoteCount += 1;
      policies.set(index, {
        items,
        remainingCap: insuranceSumOf(items) * CAP_MULTIPLE_OF_INSURANCE_SUM,
      });
      return { premium };
    }
    const policy = policies.get(step.policy ?? -1);
    if (!policy) {
      throw new Error(`unknown policy: ${step.policy}`);
    }
    return processClaim(policy, step.incident?.damages ?? []);
  });
}

const input = readFileSync(0, "utf-8");
const scenario = JSON.parse(input) as Scenario;
try {
  const results = runScenario(scenario);
  process.stdout.write(JSON.stringify({ results }));
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(1);
}
