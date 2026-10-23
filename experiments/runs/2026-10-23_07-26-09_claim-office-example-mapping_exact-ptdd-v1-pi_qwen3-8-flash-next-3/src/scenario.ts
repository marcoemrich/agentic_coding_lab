import {
  premiumForQuote,
  ScenarioError,
  type CustomerProfile,
  type InsuredItem,
} from "./premium.js";

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;
const LEGENDARY_ENCHANTMENT_THRESHOLD = 8;
const LEGENDARY_ENCHANTMENT_REIMBURSE_PERCENT = 50;
const PERCENT = 100;

// Insurance values from the MHPCO price list (G per item).
const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  amulet: 600,
  moonstone: 250,
  potion: 400,
  rune: 250,
  staff: 800,
  sword: 1000,
};

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: DamageEntry[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export interface Scenario {
  customer: CustomerProfile;
  steps: Array<
    | { op: "quote"; items: InsuredItem[] }
    | ClaimStep
  >;
}

export type ScenarioResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

interface PolicyBook {
  items: InsuredItem[];
  capRemaining: number;
}

export function runScenario(scenario: Scenario): ScenarioResult[] {
  const policies: (PolicyBook | undefined)[] = [];
  let seenQuotes = 0;
  return scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      return handleClaimStep(step, policies);
    }
    const isFollowUpContract = seenQuotes > 0;
    seenQuotes += 1;
    policies[stepIndex] = {
      items: step.items,
      capRemaining: insuranceCap(step.items),
    };
    return {
      premium: premiumForQuote(
        step.items,
        scenario.customer,
        isFollowUpContract,
      ),
    };
  });
}

function handleClaimStep(
  step: ClaimStep,
  policies: (PolicyBook | undefined)[],
): ScenarioResult {
  const policy = policies[step.policy] as PolicyBook;
  validateDamages(step.incident.damages, policy.items);
  const desiredPayout = payoutForDamages(step.incident.damages, policy.items);
  const payout = Math.min(desiredPayout, policy.capRemaining);
  policy.capRemaining -= payout;
  return { payout, remainingCap: policy.capRemaining };
}

function validateDamages(
  damages: DamageEntry[],
  insuredItems: InsuredItem[],
): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new ScenarioError(
        `damage amount must not be negative: ${damage.amount}`,
      );
    }
    if (!insuredItems.some((item) => item.type === damage.itemType)) {
      throw new ScenarioError(
        `item not covered by policy: ${damage.itemType}`,
      );
    }
  }
  validateDamageCounts(damages, insuredItems);
}

function validateDamageCounts(
  damages: DamageEntry[],
  insuredItems: InsuredItem[],
): void {
  for (const itemType of new Set(damages.map((d) => d.itemType))) {
    const damagedCount = damages.filter(
      (d) => d.itemType === itemType,
    ).length;
    const insuredCount = insuredItems.filter(
      (i) => i.type === itemType,
    ).length;
    if (damagedCount > insuredCount) {
      throw new ScenarioError(
        `more damages than insured for item type: ${itemType}`,
      );
    }
  }
}

function insuranceCap(items: InsuredItem[]): number {
  return (
    CAP_MULTIPLE_OF_INSURANCE_SUM *
    items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0)
  );
}

function insuranceValueOf(type: string): number {
  return INSURANCE_VALUE_BY_TYPE[type] ?? 0;
}

function payoutForDamages(
  damages: DamageEntry[],
  insuredItems: InsuredItem[],
): number {
  const exactPayout = damages.reduce(
    (sum, damage) =>
      sum + reimbursedAmount(damage, insuredItems) - DEDUCTIBLE_PER_DAMAGE,
    0,
  );
  return Math.floor(exactPayout);
}

function reimbursedAmount(
  damage: DamageEntry,
  insuredItems: InsuredItem[],
): number {
  const item = insuredItems.find((i) => i.type === damage.itemType);
  if (isLegendarilyEnchanted(item)) {
    return (
      (damage.amount * LEGENDARY_ENCHANTMENT_REIMBURSE_PERCENT) / PERCENT
    );
  }
  return damage.amount;
}

function isLegendarilyEnchanted(item: InsuredItem | undefined): boolean {
  return (item?.enchantment ?? 0) >= LEGENDARY_ENCHANTMENT_THRESHOLD;
}
