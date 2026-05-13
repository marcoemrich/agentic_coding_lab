type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
  componentType?: string;
};
type Damage = { itemType: string; amount: number };
type Incident = { cause?: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

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
};

const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_INSURANCE_VALUE = 250;
const BLOCK_SIZE = 3;

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_FACTOR = 0.5;

type Charge = { base: number; item?: Item };

const KNOWN_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "component"]);

const validateItem = (item: Item): void => {
  if (!KNOWN_ITEM_TYPES.has(item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
};

const mainItemBase = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

// Returns charges for components, grouping into blocks of 3 alike.
const componentCharges = (items: Item[]): Charge[] => {
  const components = items.filter((i) => i.type === "component");
  const byType: Record<string, Item[]> = {};
  for (const c of components) {
    const key = c.componentType ?? "unknown";
    (byType[key] ??= []).push(c);
  }
  const charges: Charge[] = [];
  for (const group of Object.values(byType)) {
    if (group.length === BLOCK_SIZE) {
      // A block is treated as a single charge; components within don't carry per-item modifiers
      charges.push({ base: COMPONENT_BLOCK_BASE });
    } else {
      for (const c of group) charges.push({ base: COMPONENT_BASE, item: c });
    }
  }
  return charges;
};

const allCharges = (items: Item[]): Charge[] => {
  const mainCharges: Charge[] = items
    .filter((i) => i.type !== "component")
    .map((i) => ({ base: mainItemBase(i), item: i }));
  return [...mainCharges, ...componentCharges(items)];
};

// Item-specific surcharges added to each item's base.
const itemSurcharges = (charge: Charge): number => {
  let extra = 0;
  if (charge.item?.cursed) extra += charge.base * CURSED_SURCHARGE;
  if ((charge.item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    extra += charge.base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return extra;
};

const ceilG = (amount: number): number => {
  // Round up to whole G, with epsilon to avoid float artifacts.
  const EPS = 1e-9;
  return Math.ceil(amount - EPS);
};

const quotePremium = (
  items: Item[],
  customer: { yearsWithMHPCO: number },
  isFollowUp: boolean,
): number => {
  const charges = allCharges(items);
  const policyBase = charges.reduce((sum, c) => sum + c.base, 0);
  const itemSurchargesTotal = charges.reduce((sum, c) => sum + itemSurcharges(c), 0);

  // Policy-wide modifiers applied to policyBase
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE;
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? policyBase * LOYALTY_DISCOUNT : 0;
  const followUp = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT : 0;

  const total =
    policyBase + itemSurchargesTotal + firstInsurance - loyalty - followUp + PROCESSING_FEE;
  return ceilG(total);
};

const itemInsuranceValue = (item: Item): number => {
  if (item.type === "component") return COMPONENT_INSURANCE_VALUE;
  return INSURANCE_VALUES[item.type] ?? 0;
};

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

const floorG = (amount: number): number => {
  const EPS = 1e-9;
  return Math.floor(amount + EPS);
};

// Compute the raw payout for a damage against a covered item, before deductible & cap.
// When both special clauses apply, the 50% high-enchantment rule wins (per spec).
const rawPayout = (damage: Damage, item: Item): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_CLAIM_FACTOR;
  }
  if (item.material === "dragon") return damage.amount;
  return damage.amount;
};

type PolicyState = { items: Item[]; remainingCap: number };

const processClaim = (
  policy: PolicyState,
  incident: Incident,
): { payout: number; remainingCap: number } => {
  // Determine per-damage payouts (raw - deductible), then sum and cap.
  // Match each damage to a covered item by type (consume copies as we go).
  const availableByType: Record<string, Item[]> = {};
  for (const item of policy.items) {
    const key = item.type === "component" ? `component:${item.componentType ?? ""}` : item.type;
    (availableByType[key] ??= []).push(item);
  }

  let totalRawPayout = 0;
  for (const damage of incident.damages) {
    const key = damage.itemType.startsWith("component:")
      ? damage.itemType
      : damage.itemType;
    // Find a matching item
    const candidates = availableByType[key];
    if (!candidates || candidates.length === 0) {
      throw new Error(`Claim references item not in policy: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`Claim has negative damage amount: ${damage.amount}`);
    }
    const item = candidates.shift() as Item;
    const raw = rawPayout(damage, item);
    const afterDeductible = Math.max(0, raw - DEDUCTIBLE);
    totalRawPayout += afterDeductible;
  }

  const cappedPayout = Math.min(totalRawPayout, policy.remainingCap);
  const finalPayout = floorG(cappedPayout);
  const newRemaining = policy.remainingCap - finalPayout;
  policy.remainingCap = newRemaining;
  return { payout: finalPayout, remainingCap: newRemaining };
};

export type StepResult = { premium: number } | { payout: number; remainingCap: number };
export type ScenarioResult = { results: StepResult[] };

export const runScenario = (scenario: Scenario): ScenarioResult => {
  let quoteCount = 0;
  const policies: Record<number, PolicyState> = {};
  const results: StepResult[] = scenario.steps.map((step, idx) => {
    if (step.op === "quote") {
      step.items.forEach(validateItem);
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      const sum = policyInsuranceSum(step.items);
      policies[idx] = { items: [...step.items], remainingCap: 2 * sum };
      return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
    }
    // claim
    const policy = policies[step.policy];
    if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
    return processClaim(policy, step.incident);
  });
  return { results };
};
