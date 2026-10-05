import { validateScenario } from './validation';

type ItemType = 'sword' | 'amulet' | 'staff' | 'potion' | 'rune' | 'moonstone';
interface Item { type: ItemType; material?: string; enchantment?: number; cursed?: boolean }
interface Quote { op: 'quote'; items: Item[] }
interface Claim { op: 'claim'; policy: number; incident: { cause: string; damages: { itemType: ItemType; amount: number }[] } }
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: (Quote | Claim)[] }
interface Policy { items: Item[]; remainingCap: number }

const priceList: Record<ItemType, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};
const rules = {
  blockSize: 3, blockPremium: 60, cursePercent: 50,
  highEnchantment: 5, enchantmentPercent: 30, loyaltyYears: 2,
  loyaltyPercent: 20, firstPercent: 10, followUpPercent: 15,
  fee: 5, deductible: 100, capMultiplier: 2,
  claimEnchantment: 8, enchantedReimbursement: 0.5, percentScale: 100,
};

function createPolicy(items: Item[]): Policy {
  let insuranceSum = 0;
  for (const item of items) {
    if (!Object.hasOwn(priceList, item.type)) throw new Error(`Unknown item type: ${item.type}`);
    insuranceSum += priceList[item.type].value;
  }
  return { items, remainingCap: insuranceSum * rules.capMultiplier };
}

function itemBase(item: Item, counts: Map<ItemType, number>): number {
  const component = item.type === 'rune' || item.type === 'moonstone';
  return component && counts.get(item.type) === rules.blockSize
    ? rules.blockPremium / rules.blockSize : priceList[item.type].premium;
}

function premium(items: Item[], years: number, followUp: boolean): number {
  const counts = new Map<ItemType, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  let base = 0;
  let riskHundredths = 0;
  for (const item of items) {
    const itemPremium = itemBase(item, counts);
    base += itemPremium;
    const curse = item.cursed ? rules.cursePercent : 0;
    const enchantment = (item.enchantment ?? 0) >= rules.highEnchantment ? rules.enchantmentPercent : 0;
    riskHundredths += itemPremium * (curse + enchantment);
  }
  const loyalty = years >= rules.loyaltyYears ? rules.loyaltyPercent : 0;
  const followUpDiscount = followUp ? rules.followUpPercent : 0;
  const policyPercent = rules.percentScale + rules.firstPercent - loyalty - followUpDiscount;
  // Work in hundredths so no intermediate premium is rounded.
  return Math.ceil((base * policyPercent + riskHundredths) / rules.percentScale + rules.fee);
}

function settleClaim(policy: Policy, claim: Claim): { payout: number; remainingCap: number } {
  const available = [...policy.items];
  const rawPayout = claim.incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error('Damage amount must not be negative');
    const itemIndex = available.findIndex(item => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Policy does not cover another ${damage.itemType}`);
    // Same-type damages use insured items in their original order, once per incident.
    const [item] = available.splice(itemIndex, 1);
    // High enchantment takes priority; dragon and ordinary materials both receive full reimbursement otherwise.
    const fraction = (item.enchantment ?? 0) >= rules.claimEnchantment ? rules.enchantedReimbursement : 1;
    return sum + Math.max(0, damage.amount * fraction - rules.deductible);
  }, 0);
  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(input: unknown) {
  const scenario = validateScenario(input);
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'claim') {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Invalid policy reference: ${step.policy}`);
      return settleClaim(policy, step);
    }
    policies.set(index, createPolicy(step.items));
    const result = { premium: premium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0) };
    quoteCount++;
    return result;
  });
  return { results };
}
