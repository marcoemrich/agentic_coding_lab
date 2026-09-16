export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: "quote"; items: Item[] } | ClaimStep>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_SAVING = 15;
const DAMAGE_DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;
const BASE_PREMIUM_BY_TYPE: Readonly<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUE_BY_TYPE: Readonly<Record<string, number>> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function itemBasePremium(item: Item): number {
  const premium = BASE_PREMIUM_BY_TYPE[item.type];
  if (premium === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return premium;
}

function componentBlockSaving(items: Item[], componentType: string): number {
  const alikeCount = items.filter((item) => item.type === componentType).length;
  return alikeCount === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_SAVING : 0;
}

function curseSurcharge(items: Item[]): number {
  return items.reduce(
    (total, item) =>
      total + (item.cursed ? itemBasePremium(item) * CURSE_SURCHARGE_RATE : 0),
    0,
  );
}

function enchantmentSurcharge(items: Item[]): number {
  return items.reduce(
    (total, item) =>
      total +
      ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
        ? itemBasePremium(item) * HIGH_ENCHANTMENT_RATE
        : 0),
    0,
  );
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
}

function followUpDiscount(basePremium: number, isFollowUp: boolean): number {
  return isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function quotePremium(
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUpContract = false,
): number {
  const listedBasePremium = items.reduce(
    (total, item) => total + itemBasePremium(item),
    0,
  );
  const basePremium =
    listedBasePremium -
    componentBlockSaving(items, "rune") -
    componentBlockSaving(items, "moonstone");
  return Math.ceil(
    basePremium +
      curseSurcharge(items) +
      enchantmentSurcharge(items) +
      basePremium * FIRST_INSURANCE_RATE -
      loyaltyDiscount(basePremium, yearsWithMHPCO) -
      followUpDiscount(basePremium, isFollowUpContract) +
      PROCESSING_FEE,
  );
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce(
    (total, item) => total + (INSURANCE_VALUE_BY_TYPE[item.type] ?? 0),
    0,
  );
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function damagePayout(damage: Damage, item: Item | undefined): number {
  const reimbursableDamage =
    (item?.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL
      ? damage.amount * HALF_REIMBURSEMENT_RATE
      : damage.amount;
  return Math.max(0, reimbursableDamage - DAMAGE_DEDUCTIBLE);
}

function matchDamagesToItems(
  policyItems: Item[],
  damages: Damage[],
): Array<{ damage: Damage; item: Item }> {
  const availableItems = [...policyItems];
  return damages.map((damage) => {
    const index = availableItems.findIndex(
      (item) => item.type === damage.itemType,
    );
    if (index < 0) throw new Error(`Item not covered: ${damage.itemType}`);
    const [item] = availableItems.splice(index, 1);
    return { damage, item };
  });
}

function validateDamageAmounts(damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
}

function processClaim(policy: Policy, damages: Damage[]): Record<string, number> {
  validateDamageAmounts(damages);
  const matchedDamages = matchDamagesToItems(policy.items, damages);
  const desiredPayout = matchedDamages.reduce(
    (total, { damage, item }) => total + damagePayout(damage, item),
    0,
  );
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Array<Record<string, number>> } {
  const results: Array<Record<string, number>> = [];
  const policies = new Map<number, Policy>();
  let hasPriorQuote = false;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      policies.set(index, createPolicy(step.items));
      results.push({
        premium: quotePremium(
          step.items,
          scenario.customer.yearsWithMHPCO,
          hasPriorQuote,
        ),
      });
      hasPriorQuote = true;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      results.push(processClaim(policy, step.incident.damages));
    }
  });
  return { results };
}
