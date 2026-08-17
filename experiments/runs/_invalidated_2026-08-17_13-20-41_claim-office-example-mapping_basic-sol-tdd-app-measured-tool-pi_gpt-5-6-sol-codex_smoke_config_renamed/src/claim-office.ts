export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; items?: Item[]; policy?: number; incident?: Incident }>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Incident {
  cause: string;
  damages: Array<{ itemType: string; amount: number }>;
}

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_SAVING = 15;
const COMPONENT_TYPES = ["rune", "moonstone"];
const MAIN_PREMIUMS: Record<string, number> = {
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

interface Policy {
  items: Item[];
  remainingCap: number;
}

function componentBlockSavings(items: Item[]): number {
  let savings = 0;
  for (const componentType of COMPONENT_TYPES) {
    if (items.filter((item) => item.type === componentType).length === BLOCK_SIZE) {
      savings += BLOCK_SAVING;
    }
  }
  return savings;
}

function cursedItemSurcharge(items: Item[]): number {
  return items.reduce(
    (sum, item) => sum + (item.cursed ? (MAIN_PREMIUMS[item.type] ?? 0) * CURSE_RATE : 0),
    0,
  );
}

function enchantedItemSurcharge(items: Item[]): number {
  return items.reduce(
    (sum, item) => sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? (MAIN_PREMIUMS[item.type] ?? 0) * HIGH_ENCHANTMENT_RATE
      : 0),
    0,
  );
}

function assertKnownItems(items: Item[]): void {
  const unknownItem = items.find((item) => MAIN_PREMIUMS[item.type] === undefined);
  if (unknownItem) {
    throw new Error(`Unknown item type: ${unknownItem.type}`);
  }
}

function quote(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  assertKnownItems(items);
  const listedPremium = items.reduce((sum, item) => sum + (MAIN_PREMIUMS[item.type] ?? 0), 0);
  const basePremium = listedPremium - componentBlockSavings(items);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;
  const itemSurcharges = cursedItemSurcharge(items) + enchantedItemSurcharge(items);
  const premium = basePremium + itemSurcharges + basePremium * FIRST_INSURANCE_RATE
    - loyaltyDiscount - followUpDiscount;
  return Math.ceil(premium + PROCESSING_FEE);
}

function insuranceCap(items: Item[]): number {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0) * CAP_MULTIPLIER;
}

function reimbursableDamage(item: Item | undefined, amount: number): number {
  return (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : amount;
}

function processClaim(policy: Policy, incident: Incident): Record<string, number> {
  const claimableItems = [...policy.items];
  const desiredPayout = incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${String(damage.amount)}`);
    }
    const itemIndex = claimableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex === -1) {
      throw new Error(`Item type is not insured: ${damage.itemType}`);
    }
    const [item] = claimableItems.splice(itemIndex, 1);
    return sum + Math.max(0, reimbursableDamage(item, damage.amount) - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Array<Record<string, number>> } {
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      const policy = policies[step.policy ?? -1];
      if (!policy || !step.incident) throw new Error("Claim references an unknown policy");
      return processClaim(policy, step.incident);
    }
    const items = step.items ?? [];
    const premium = quote(items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    quoteCount += 1;
    policies[stepIndex] = { items, remainingCap: insuranceCap(items) };
    return { premium };
  });
  return { results };
}
