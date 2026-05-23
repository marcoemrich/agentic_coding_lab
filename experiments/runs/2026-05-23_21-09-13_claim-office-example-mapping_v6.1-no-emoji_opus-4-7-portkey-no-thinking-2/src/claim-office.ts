type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type Result = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const FIRST_INSURANCE_RATE = 10;
const CURSE_RATE = 50;
const HIGH_ENCHANTMENT_RATE = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_RATE = 15;

const BASE_PREMIUMS: Record<string, number> = {
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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const itemBaseLookup = (type: string): number => BASE_PREMIUMS[type] ?? 0;

const itemSurchargeAmount = (item: Item): number => {
  const base = itemBaseLookup(item.type);
  let surcharge = 0;
  if (item.cursed) surcharge += (base * CURSE_RATE) / 100;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += (base * HIGH_ENCHANTMENT_RATE) / 100;
  }
  return surcharge;
};

const policyBasePremium = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const mainItems = items.filter((i) => !isComponent(i));
  const mainsBase = mainItems.reduce((sum, i) => sum + itemBaseLookup(i.type), 0);

  const byType = new Map<string, number>();
  for (const c of components) byType.set(c.type, (byType.get(c.type) ?? 0) + 1);

  let componentsBase = 0;
  for (const [type, count] of byType) {
    if (count === COMPONENT_BLOCK_SIZE) {
      componentsBase += COMPONENT_BLOCK_PREMIUM;
    } else {
      componentsBase += count * itemBaseLookup(type);
    }
  }
  return mainsBase + componentsBase;
};

const quotePremium = (items: Item[], customer: Customer, isFollowup: boolean): number => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const policyBase = policyBasePremium(items);
  const itemSurcharges = items.reduce((s, i) => s + itemSurchargeAmount(i), 0);
  let modifierRate = FIRST_INSURANCE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) modifierRate -= LOYALTY_RATE;
  if (isFollowup) modifierRate -= FOLLOWUP_RATE;
  const policyModifiers = (policyBase * modifierRate) / 100;
  const total = policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE;
  return Math.ceil(total);
};

type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, i) => sum + (INSURANCE_VALUES[i.type] ?? 0), 0);

const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;

const damagePayout = (item: Item, damageAmount: number): number => {
  const isHighlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;
  const isDragon = item.material === "dragon";
  let covered = damageAmount;
  if (isDragon) covered = damageAmount;
  if (isHighlyEnchanted) covered = damageAmount / 2;
  return Math.max(0, covered - DEDUCTIBLE);
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  const availableByType = new Map<string, Item[]>();
  for (const item of policy.items) {
    const list = availableByType.get(item.type) ?? [];
    list.push(item);
    availableByType.set(item.type, list);
  }
  let totalPayout = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount`);
    const list = availableByType.get(damage.itemType);
    if (!list || list.length === 0) {
      throw new Error(`Damage item ${damage.itemType} not in policy`);
    }
    const item = list.shift() as Item;
    totalPayout += damagePayout(item, damage.amount);
  }
  const allowed = Math.min(totalPayout, policy.remainingCap);
  const finalPayout = Math.floor(allowed);
  policy.remainingCap -= finalPayout;
  return { payout: finalPayout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results: Result[] = scenario.steps.map((step, idx) => {
    if (step.op === "quote") {
      const isFollowup = quoteCount > 0;
      quoteCount += 1;
      const insuranceSum = insuranceSumOf(step.items);
      policies.set(idx, {
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * CAP_MULTIPLIER,
      });
      return { premium: quotePremium(step.items, scenario.customer, isFollowup) };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Policy ${step.policy} not found`);
    return processClaim(policy, step.incident);
  });
  return { results };
};
