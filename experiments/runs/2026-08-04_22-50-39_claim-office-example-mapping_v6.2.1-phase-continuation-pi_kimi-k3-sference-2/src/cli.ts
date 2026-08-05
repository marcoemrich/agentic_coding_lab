// claim-office CLI: reads a JSON scenario from stdin, writes JSON results to stdout.

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

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

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

type Step = QuoteStep | ClaimStep;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

function countBy<T>(items: T[], keyOf: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function unitPremium(type: string): number {
  return BASE_PREMIUMS[type];
}

function componentPremium(type: string, count: number): number {
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * unitPremium(type);
}

function enchantmentLevel(item: Item | undefined): number {
  return item?.enchantment ?? 0;
}

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

function surchargeFor(
  items: Item[],
  matches: (item: Item) => boolean,
  rate: number,
): number {
  return items
    .filter(matches)
    .reduce((sum, item) => sum + unitPremium(item.type) * rate, 0);
}

function highEnchantmentSurcharge(items: Item[]): number {
  return surchargeFor(
    items,
    (item) => enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );
}

function cursedSurcharge(items: Item[]): number {
  return surchargeFor(items, (item) => item.cursed === true, CURSED_SURCHARGE_RATE);
}

function basePremium(items: Item[]): number {
  const componentCounts = countBy(
    items.filter((item) => COMPONENT_TYPES.has(item.type)),
    (item) => item.type,
  );
  let standardBase = 0;
  for (const item of items) {
    if (!COMPONENT_TYPES.has(item.type)) {
      standardBase += unitPremium(item.type);
    }
  }
  let componentBase = 0;
  for (const [type, count] of componentCounts) {
    componentBase += componentPremium(type, count);
  }
  return standardBase + componentBase;
}

function rateDiscount(base: number, applies: boolean, rate: number): number {
  return applies ? base * rate : 0;
}

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

function loyaltyDiscount(base: number, yearsWithMHPCO: number): number {
  return rateDiscount(
    base,
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    LOYALTY_DISCOUNT_RATE,
  );
}

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function followUpDiscount(base: number, isFollowUp: boolean): number {
  return rateDiscount(base, isFollowUp, FOLLOW_UP_DISCOUNT_RATE);
}

function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
}

function quotePremium(
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number {
  const base = basePremium(items);
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_RATE;
  return Math.ceil(
    base +
      firstInsuranceSurcharge +
      cursedSurcharge(items) +
      highEnchantmentSurcharge(items) -
      loyaltyDiscount(base, yearsWithMHPCO) -
      followUpDiscount(base, isFollowUp) +
      PROCESSING_FEE,
  );
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

// High-enchantment clause (enchantment >= 8): 50% reimbursement. It wins over
// the dragon-material full-reimbursement clause when both apply; otherwise
// reimbursement is full (which is also the dragon-material clause's effect).
function reimbursementRateFor(item: Item): number {
  return enchantmentLevel(item) >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
}

function damagePayout(policy: Policy, damage: Damage): number {
  const item = policy.items.find((candidate) => candidate.type === damage.itemType);
  if (!item) {
    throw new Error(`damaged item not covered by policy: ${damage.itemType}`);
  }
  return damage.amount * reimbursementRateFor(item) - DEDUCTIBLE;
}

function damagesPayout(policy: Policy, damages: Damage[]): number {
  return damages.reduce((sum, damage) => sum + damagePayout(policy, damage), 0);
}

function assertNonNegativeAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
  }
}

function assertDamageCountsCovered(policy: Policy, damages: Damage[]): void {
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    const covered = policy.items.filter((item) => item.type === type).length;
    if (count > covered) {
      throw new Error(
        `claim reports ${count} damaged ${type}(s) but policy covers only ${covered}`,
      );
    }
  }
}

function processClaim(policy: Policy, step: ClaimStep): { payout: number; remainingCap: number } {
  const damages = step.incident.damages;
  assertNonNegativeAmounts(damages);
  assertDamageCountsCovered(policy, damages);
  const payout = Math.floor(Math.min(damagesPayout(policy, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

async function main(): Promise<void> {
  const input = await readStdin();
  const scenario = JSON.parse(input) as {
    customer: { yearsWithMHPCO: number };
    steps: Step[];
  };
  const policies = new Map<number, Policy>();
  try {
    const results = scenario.steps.map((step, index) => {
      if (step.op === "quote") {
        assertKnownItemTypes(step.items);
        const premium = quotePremium(
          step.items,
          scenario.customer.yearsWithMHPCO,
          policies.size > 0,
        );
        policies.set(index, {
          items: step.items,
          remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
        });
        return { premium };
      }
      return processClaim(policies.get(step.policy)!, step);
    });
    process.stdout.write(JSON.stringify({ results }));
  } catch (error) {
    process.stderr.write(`error: ${(error as Error).message}\n`);
    process.exitCode = 1;
  }
}

main();
