export type Customer = {
  yearsWithMHPCO: number;
  contractCount: number;
};

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteResult = {
  premium: number;
};

export type Policy = {
  items: Item[];
  remainingCap: number;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

export type Step =
  | { op: "quote"; items: Item[] }
  | {
      op: "claim";
      policy: number;
      incident: Incident;
    };

export type StepResult = QuoteResult | ClaimResult;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type ScenarioResult = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_YEARS_THRESHOLD = 2;

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

const CAP_MULTIPLIER = 2;

const CURSE_RATE = 0.5;
const HIGH_ENCHANT_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES: ReadonlySet<string> = new Set(["rune", "moonstone"]);

const itemBase = (type: string): number => BASE_PREMIUM[type] ?? 0;

const countByType = <T>(
  items: T[],
  typeOf: (item: T) => string,
): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[typeOf(item)] = (counts[typeOf(item)] ?? 0) + 1;
  }
  return counts;
};

export const insuranceSum = (items: Item[]): number => {
  let sum = 0;
  for (const item of items) {
    sum += INSURANCE_VALUE[item.type] ?? 0;
  }
  return sum;
};

export const cap = (items: Item[]): number => insuranceSum(items) * CAP_MULTIPLIER;

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const calculatePolicyBase = (items: Item[]): number => {
  // Tally every type's count once, then price uniformly: components in blocks
  // of 3 take the flat block price; everything else is unit price * count.
  const itemCounts = countByType(items, (item) => item.type);
  let policyBase = 0;
  for (const type of Object.keys(itemCounts)) {
    const count = itemCounts[type];
    if (count === COMPONENT_BLOCK_SIZE && COMPONENT_TYPES.has(type)) {
      policyBase += COMPONENT_BLOCK_PRICE;
    } else {
      policyBase += count * itemBase(type);
    }
  }
  return policyBase;
};

const calculateItemModifiers = (items: Item[]): number => {
  let total = 0;
  for (const item of items) {
    const base = itemBase(item.type);
    if (item.cursed) {
      total += base * CURSE_RATE;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += base * HIGH_ENCHANT_RATE;
    }
  }
  return total;
};

const calculatePolicyModifiers = (
  customer: Customer,
  policyBase: number,
): number => {
  let total = policyBase * FIRST_INSURANCE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    total -= policyBase * LOYALTY_RATE;
  }
  if (customer.contractCount > 0) {
    total -= policyBase * FOLLOW_UP_RATE;
  }
  return total;
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  let customer: Customer = { ...scenario.customer };

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const result = quote(customer, step.items);
      results.push(result);
      policies.push({
        items: step.items,
        remainingCap: cap(step.items),
      });
      customer = { ...customer, contractCount: customer.contractCount + 1 };
    } else {
      const policy = policies[step.policy];
      const result = processClaim(policy, step.incident);
      results.push(result);
      policies[step.policy] = { ...policy, remainingCap: result.remainingCap };
    }
  }

  return { results };
};

export const quote = (customer: Customer, items: Item[]): QuoteResult => {
  validateItemTypes(items);
  const policyBase = calculatePolicyBase(items);
  const itemMods = calculateItemModifiers(items);
  const policyMods = calculatePolicyModifiers(customer, policyBase);
  const total = policyBase + itemMods + policyMods + PROCESSING_FEE;
  return { premium: Math.ceil(total) };
};

export const processClaim = (
  policy: Policy,
  incident: Incident,
): ClaimResult => {
  validateClaimDamages(policy, incident);
  let totalPayout = 0;
  for (const damage of incident.damages) {
    totalPayout += reimbursementForDamage(policy, damage);
  }
  const payout = Math.min(totalPayout, policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;
  return { payout, remainingCap };
};

const validateDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (!(damage.itemType in INSURANCE_VALUE)) {
      throw new Error(`Unknown item type: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

const validateClaimDamages = (policy: Policy, incident: Incident): void => {
  validateDamages(incident.damages);
  const policyCounts = countByType(policy.items, (item) => item.type);
  const damageCounts = countByType(
    incident.damages,
    (damage) => damage.itemType,
  );
  for (const type of Object.keys(damageCounts)) {
    if (damageCounts[type] > (policyCounts[type] ?? 0)) {
      throw new Error(
        `Too many damages for item type ${type}: ${damageCounts[type]} damages but only ${policyCounts[type] ?? 0} insured`,
      );
    }
  }
};

const reimbursementForDamage = (policy: Policy, damage: Damage): number => {
  const item = policy.items.find((i) => i.type === damage.itemType);
  // High-enchantment items get only 50% reimbursement; everything else
  // (including dragon-material items at lower enchantment) is reimbursed in full.
  const isHighEnchantment =
    item !== undefined &&
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  const reimbursement = isHighEnchantment
    ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE
    : damage.amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
};

export { runCli } from "./cli.js";
export type { CliResult } from "./cli.js";
