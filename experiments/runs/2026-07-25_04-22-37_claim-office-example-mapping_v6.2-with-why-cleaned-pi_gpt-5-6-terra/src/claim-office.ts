export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] } };
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: (QuoteStep | ClaimStep)[] }

type Policy = { items: Item[]; remainingCap: number };
type Result = { premium: number } | { payout: number; remainingCap: number };
const ITEM_VALUES: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const BASE_PREMIUM_BY_ITEM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const COMPONENTS = new Set(["rune", "moonstone"]);
const PROCESSING_FEE = 5;

function basePremiumForItem(item: Item): number {
  const base = BASE_PREMIUM_BY_ITEM[item.type];
  if (base === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return base;
}
function quotePremium(items: Item[], years: number, contractNumber: number): number {
  const componentCounts = new Map<string, number>();
  let basePremium = 0;
  let itemSurcharges = 0;
  for (const item of items) {
    const itemBase = basePremiumForItem(item);
    if (COMPONENTS.has(item.type)) componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    else basePremium += itemBase;
    if (item.cursed) itemSurcharges += itemBase * 0.5;
    if ((item.enchantment ?? 0) >= 5) itemSurcharges += itemBase * 0.3;
  }
  for (const count of componentCounts.values()) basePremium += count === 3 ? 60 : count * 25;
  const initial = items.reduce((sum, item) => sum + basePremiumForItem(item) * 0.1, 0);
  const policyModifiers = basePremium * (years >= 2 ? -0.2 : 0) + basePremium * (contractNumber > 0 ? -0.15 : 0);
  return Math.ceil(basePremium + itemSurcharges + initial + policyModifiers + PROCESSING_FEE);
}
function settleClaim(policy: Policy, damages: ClaimStep["incident"]["damages"]): { payout: number; remainingCap: number } {
  const available = new Map<string, number>();
  for (const item of policy.items) available.set(item.type, (available.get(item.type) ?? 0) + 1);
  let desired = 0;
  for (const damage of damages) {
    if (!Number.isInteger(damage.amount) || damage.amount < 0 || !(available.get(damage.itemType) ?? 0)) throw new Error(`Invalid damage for ${damage.itemType}`);
    available.set(damage.itemType, available.get(damage.itemType)! - 1);
    const insured = policy.items.find((item) => item.type === damage.itemType)!;
    const reimbursement = (insured.enchantment ?? 0) >= 8 ? damage.amount * 0.5 : damage.amount;
    desired += Math.max(0, reimbursement - 100);
  }
  const payout = Math.min(policy.remainingCap, Math.floor(desired));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quotes = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quotes++);
      const value = step.items.reduce((sum, item) => sum + (ITEM_VALUES[item.type] ?? (() => { throw new Error(`Unknown item type: ${item.type}`); })()), 0);
      policies.set(index, { items: step.items, remainingCap: value * 2 });
      results.push({ premium });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      results.push(settleClaim(policy, step.incident.damages));
    }
  });
  return { results };
}
