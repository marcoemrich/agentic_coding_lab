type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const FIRST_INSURANCE_MULTIPLIER = 1.1;
const PROCESSING_FEE = 5;

const ceilToWholeG = (amount: number): number =>
  Math.ceil(Math.round(amount * 100) / 100);

const COMPONENT_BUNDLE_PRICE = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const CURSED_SURCHARGE = 1.5;
const ENCHANTMENT_SURCHARGE = 1.3;
const ENCHANTMENT_THRESHOLD = 5;

const enchantmentAtLeast = (item: Item, threshold: number): boolean =>
  (item.enchantment ?? 0) >= threshold;

const itemMultiplier = (item: Item): number =>
  (item.cursed ? CURSED_SURCHARGE : 1) *
  (enchantmentAtLeast(item, ENCHANTMENT_THRESHOLD) ? ENCHANTMENT_SURCHARGE : 1);

const sumItemsAtUnitPrice = (items: Item[], unitPrice: number): number =>
  items.reduce((sum, item) => sum + unitPrice * itemMultiplier(item), 0);

const baseForGroup = (type: string, group: Item[]): number => {
  const unitPrice = BASE_PREMIUM[type] ?? 0;
  if (!COMPONENT_TYPES.has(type)) {
    return sumItemsAtUnitPrice(group, unitPrice);
  }
  const bundleCount = Math.floor(group.length / 3);
  const singles = group.slice(bundleCount * 3);
  return bundleCount * COMPONENT_BUNDLE_PRICE + sumItemsAtUnitPrice(singles, unitPrice);
};

const groupByType = (items: Item[]): Map<string, Item[]> => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const list = groups.get(item.type) ?? [];
    list.push(item);
    groups.set(item.type, list);
  }
  return groups;
};

const LOYALTY_DISCOUNT = 0.8;
const LOYALTY_YEARS_THRESHOLD = 2;

const customerMultiplier = (customer: Scenario["customer"]): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT : 1;

const baseForItems = (items: Item[]): number =>
  [...groupByType(items)].reduce(
    (sum, [type, group]) => sum + baseForGroup(type, group),
    0,
  );

const SUBSEQUENT_CONTRACT_DISCOUNT = 0.85;

const contractMultiplier = (quoteIndex: number): number =>
  quoteIndex === 0 ? FIRST_INSURANCE_MULTIPLIER : SUBSEQUENT_CONTRACT_DISCOUNT;

const quote = (items: Item[], customer: Scenario["customer"], quoteIndex: number): number => {
  const adjusted = baseForItems(items) * customerMultiplier(customer) * contractMultiplier(quoteIndex);
  return ceilToWholeG(adjusted) + PROCESSING_FEE;
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 8;

const damageReimbursement = (damage: Damage, policyItems: Item[]): number => {
  const item = policyItems.find((i) => i.type === damage.itemType);
  if (item?.material === "dragon") return damage.amount;
  const isHighlyEnchanted = item !== undefined && enchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD);
  return isHighlyEnchanted ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT : damage.amount;
};

const claim = (incident: Incident, policyItems: Item[]): number => {
  const reimbursed = incident.damages.reduce(
    (sum, d) => sum + damageReimbursement(d, policyItems),
    0,
  );
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  let quoteIndex = 0;
  const policiesByStep = new Map<number, Item[]>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      policiesByStep.set(stepIndex, step.items);
      return { premium: quote(step.items, scenario.customer, quoteIndex++) };
    }
    return { payout: claim(step.incident, policiesByStep.get(step.policy) ?? []) };
  });
  return { results };
};
