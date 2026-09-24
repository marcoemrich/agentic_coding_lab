export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Damage = { itemType: string; amount: number };
export type Step = { op: 'quote'; items: Item[] } | { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

type Price = { value: number; premium: number };
const priceList: Record<string, Price> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};
const componentTypes = ['rune', 'moonstone'];
const BLOCK_SIZE = 3;
const BLOCK_DISCOUNT = 15;
const CURSE_SURCHARGE = 0.5;
const ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;
const INITIAL_ASSESSMENT = 0.1;
const PROCESSING_FEE = 5;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const ENCHANTED_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

function price(item: Item): Price {
  const entry = priceList[item.type];
  if (!entry) throw new Error(`Unknown item type: ${item.type}`);
  return entry;
}

function basePremium(items: Item[]): number {
  const total = items.reduce((sum, item) => sum + price(item).premium, 0);
  const blockDiscount = componentTypes.reduce((sum, type) =>
    sum + (items.filter(item => item.type === type).length === BLOCK_SIZE ? BLOCK_DISCOUNT : 0), 0);
  return total - blockDiscount;
}

function policyWidePremiumAdjustment(base: number, years: number, previousContracts: number): number {
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT : 0;
  const followUp = previousContracts > 0 ? base * FOLLOW_UP_DISCOUNT : 0;
  return base * INITIAL_ASSESSMENT - loyalty - followUp;
}

function premium(items: Item[], years: number, previousContracts: number): number {
  const base = basePremium(items);
  const itemSurcharges = items.reduce((sum, item) => {
    const itemBase = price(item).premium;
    return sum + (item.cursed ? itemBase * CURSE_SURCHARGE : 0)
      + ((item.enchantment ?? 0) >= ENCHANTMENT_PREMIUM_THRESHOLD ? itemBase * ENCHANTMENT_SURCHARGE : 0);
  }, 0);
  return Math.ceil(base + itemSurcharges + policyWidePremiumAdjustment(base, years, previousContracts) + PROCESSING_FEE);
}

function reimbursement(item: Item, damage: Damage): number {
  const proportion = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD ? ENCHANTED_REIMBURSEMENT : 1;
  return Math.max(0, damage.amount * proportion - DEDUCTIBLE);
}

function insuranceCap(items: Item[]): number {
  return CAP_MULTIPLIER * items.reduce((sum, item) => sum + price(item).value, 0);
}

class Policy {
  private remainingCap: number;
  constructor(private readonly items: Item[]) {
    this.remainingCap = insuranceCap(items);
  }
  settle(damages: Damage[]): { payout: number; remainingCap: number } {
    const available = [...this.items];
    let desired = 0;
    for (const damage of damages) {
      if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
      const match = available.findIndex(item => item.type === damage.itemType);
      if (match < 0) throw new Error(`Damage to uninsured item: ${damage.itemType}`);
      const [item] = available.splice(match, 1);
      desired += reimbursement(item, damage);
    }
    const payout = Math.floor(Math.min(desired, this.remainingCap));
    this.remainingCap -= payout;
    return { payout, remainingCap: this.remainingCap };
  }
}

export function processScenario(scenario: Scenario): { results: ({ premium: number } | { payout: number; remainingCap: number })[] } {
  const policies = new Map<number, Policy>();
  let contracts = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const result = { premium: premium(step.items, scenario.customer.yearsWithMHPCO, contracts) };
      policies.set(index, new Policy(step.items));
      contracts++;
      return result;
    }
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      return policy.settle(step.incident.damages);
    }
    throw new Error('Unknown operation');
  });
  return { results };
}
