export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;

const MAIN_ITEMS: Record<string, { value: number; basePremium: number }> = {
  sword: { value: 1000, basePremium: 100 },
  amulet: { value: 600, basePremium: 60 },
  staff: { value: 800, basePremium: 80 },
  potion: { value: 400, basePremium: 40 },
};

const COMPONENTS = new Set(['rune', 'moonstone']);
const COMPONENT_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function componentsBasePremium(components: Item[]): number {
  const countsByType = new Map<string, number>();
  for (const component of components) {
    countsByType.set(component.type, (countsByType.get(component.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of countsByType.values()) {
    total += count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }
  return total;
}

function assertKnownType(type: string): void {
  if (!Object.hasOwn(MAIN_ITEMS, type) && !COMPONENTS.has(type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  items.forEach((item) => assertKnownType(item.type));
  const components = items.filter((item) => COMPONENTS.has(item.type));
  const mainItems = items.filter((item) => !COMPONENTS.has(item.type));
  const policyBase =
    mainItems.reduce((sum, item) => sum + MAIN_ITEMS[item.type].basePremium, 0) +
    componentsBasePremium(components);
  const itemSurcharges = mainItems.reduce((sum, item) => {
    const base = MAIN_ITEMS[item.type].basePremium;
    const curse = item.cursed ? base * CURSE_SURCHARGE : 0;
    const highEnchantment =
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD
        ? base * HIGH_ENCHANTMENT_SURCHARGE
        : 0;
    return sum + curse + highEnchantment;
  }, 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT : 0;
  const followUp = isFollowUp ? FOLLOW_UP_DISCOUNT : 0;
  const policyModifier = FIRST_INSURANCE_SURCHARGE - loyalty - followUp;
  const total = policyBase + itemSurcharges + policyBase * policyModifier + PROCESSING_FEE;
  return Math.ceil(total);
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceValue(item: Item): number {
  return COMPONENTS.has(item.type) ? COMPONENT_VALUE : MAIN_ITEMS[item.type].value;
}

function reimbursement(item: Item, amount: number): number {
  const rate =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const unclaimed = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
    const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
    }
    const [item] = unclaimed.splice(index, 1);
    return sum + reimbursement(item, damage.amount);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let contractsSoFar = 0;
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === 'claim') {
        const policy = policies.get(step.policy);
        if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
        return processClaim(policy, step.incident.damages);
      }
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, contractsSoFar > 0);
      contractsSoFar++;
      const insuranceSum = step.items.reduce((sum, item) => sum + insuranceValue(item), 0);
      policies.set(index, { items: step.items, remainingCap: insuranceSum * CAP_FACTOR });
      return { premium };
    }),
  };
}
