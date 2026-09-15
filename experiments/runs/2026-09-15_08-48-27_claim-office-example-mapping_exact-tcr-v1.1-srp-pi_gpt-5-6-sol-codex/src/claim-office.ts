interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}
interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
interface Policy { items: Item[]; remainingCap: number }
type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: object[];
}
export interface ScenarioResult { results: object[] }

const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const INITIAL_ASSESSMENT_RATE = 0.1;
const PROCESSING_FEE = 5;
const CURSE_RATE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const CLAIM_ENCHANTMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const FOLLOW_UP_RATE = 0.15;
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

function assertKnownItems(items: Item[]): void {
  items.forEach(({ type }) => {
    if (!(type in BASE_PREMIUM)) throw new Error(`Unknown item type: ${type}`);
  });
}

function basePremium(items: Item[]): number {
  const counts = items.reduce<Record<string, number>>((byType, { type }) => {
    byType[type] = (byType[type] ?? 0) + 1;
    return byType;
  }, {});
  return Object.entries(counts).reduce(
    (total, [type, count]) => total + (
      COMPONENT_TYPES.includes(type) && count === COMPONENT_BLOCK_SIZE
        ? COMPONENT_BLOCK_PREMIUM : count * BASE_PREMIUM[type]
    ), 0,
  );
}

function quotePremium(step: QuoteStep, years: number, isFollowUp: boolean): number {
  const base = basePremium(step.items);
  const curse = step.items.reduce(
    (sum, item) => sum + (item.cursed ? BASE_PREMIUM[item.type] * CURSE_RATE : 0), 0,
  );
  const enchantment = step.items.reduce(
    (sum, item) => sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? BASE_PREMIUM[item.type] * HIGH_ENCHANTMENT_RATE : 0), 0,
  );
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(
    base + curse + enchantment + base * INITIAL_ASSESSMENT_RATE - loyalty - followUp + PROCESSING_FEE,
  );
}

function matchedItems(items: Item[], damages: Damage[]): Item[] {
  const available = [...items];
  return damages.map(({ itemType }) => {
    const matchIndex = available.findIndex(({ type }) => type === itemType);
    if (matchIndex < 0) throw new Error(`Damage to ${itemType} exceeds insured items in policy`);
    return available.splice(matchIndex, 1)[0];
  });
}

function desiredPayout(items: Item[], damages: Damage[]): number {
  if (damages.some(({ amount }) => amount < 0)) throw new Error("Damage amount cannot be negative");
  const damagedItems = matchedItems(items, damages);
  return Math.floor(damages.reduce((total, damage, index) => {
    const rate = (damagedItems[index].enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
      ? CLAIM_ENCHANTMENT_RATE : 1;
    return total + Math.max(0, damage.amount * rate - DEDUCTIBLE);
  }, 0));
}

function processClaim(step: ClaimStep, policy: Policy): object {
  const payout = Math.min(desiredPayout(policy.items, step.incident.damages), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const results: object[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((rawStep, index) => {
    const step = rawStep as Step;
    if (step.op === "quote") {
      assertKnownItems(step.items);
      results.push({ premium: quotePremium(step, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      const cap = step.items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0) * CAP_MULTIPLIER;
      policies.set(index, { items: step.items, remainingCap: cap });
      quoteCount += 1;
      return;
    }
    results.push(processClaim(step, policies.get(step.policy)!));
  });
  return { results };
}
