export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown>>;
}

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Result = Record<string, number>;

const PROCESSING_FEE = 5;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const COMPONENT_TYPES = ["rune", "moonstone"];

const calculateBasePremium = (items: Item[]): number => {
  const componentPremium = COMPONENT_TYPES.reduce((total, type) => {
    const count = items.filter((item) => item.type === type).length;
    return total + (count === 3 ? 60 : count * 25);
  }, 0);
  return items
    .filter((item) => !COMPONENT_TYPES.includes(item.type))
    .reduce((total, item) => total + BASE_PREMIUMS[item.type], componentPremium);
};

const calculateQuotePremium = (items: Item[], years: number, quoteIndex: number): number => {
  const base = calculateBasePremium(items);
  const itemSurcharges = items.reduce((total, item) => {
    const itemBase = BASE_PREMIUMS[item.type] ?? 25;
    return total + (item.cursed ? itemBase * 0.5 : 0) + ((item.enchantment ?? 0) >= 5 ? itemBase * 0.3 : 0);
  }, 0);
  const loyalty = years >= 2 ? base * 0.2 : 0;
  const followUp = quoteIndex > 0 ? base * 0.15 : 0;
  return roundPremium(base + itemSurcharges - loyalty + base * 0.1 - followUp + PROCESSING_FEE);
};

export const processScenario = (scenario: Scenario): { results: Result[] } => {
  let quoteCount = 0;
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const items = step.items as Item[];
      const unknownItem = items.find((item) => !(item.type in INSURANCE_VALUES));
      if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
      policies.set(stepIndex, {
        items,
        remainingCap: items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type] * 2, 0),
      });
      const result = { premium: calculateQuotePremium(items, scenario.customer.yearsWithMHPCO, quoteCount) };
      quoteCount += 1;
      return result;
    }
    const policy = policies.get(step.policy as number)!;
    const damages = (step.incident as { damages: Array<{ itemType: string; amount: number }> }).damages;
    const negativeDamage = damages.find((damage) => damage.amount < 0);
    if (negativeDamage) throw new Error(`Negative damage amount: ${negativeDamage.amount}`);
    const availableItems = [...policy.items];
    const desiredPayout = damages.reduce((total, damage) => {
      const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
      if (itemIndex < 0) throw new Error(`Item type not covered by policy: ${damage.itemType}`);
      const [item] = availableItems.splice(itemIndex, 1);
      const reimbursementRate = (item.enchantment ?? 0) >= 8 ? 0.5 : 1;
      return total + Math.max(0, damage.amount * reimbursementRate - 100);
    }, 0);
    const payout = roundPayout(Math.min(desiredPayout, policy.remainingCap));
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
};

export const roundPremium = (amount: number): number => Math.ceil(amount - Number.EPSILON);
export const roundPayout = (amount: number): number => Math.floor(amount);
