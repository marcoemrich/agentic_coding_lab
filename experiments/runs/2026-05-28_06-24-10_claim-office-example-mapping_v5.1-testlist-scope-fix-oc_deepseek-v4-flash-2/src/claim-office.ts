export interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: ScenarioStep[];
}

export type ScenarioStep =
  | { op: "quote"; items: ItemInput[] }
  | { op: "claim"; policy: number; incident: IncidentInput };

export interface ItemInput {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface IncidentInput {
  cause: string;
  damages: { itemType: string; amount: number }[];
}

export interface ScenarioOutput {
  results: StepResult[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

interface PolicyRecord {
  items: ItemInput[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

const VALID_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

function validateItems(items: ItemInput[]): void {
  for (const item of items) {
    if (!VALID_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function validateDamages(damages: { itemType: string; amount: number }[], policy: PolicyRecord): void {
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
    if (!policy.items.some((i) => i.type === d.itemType)) {
      throw new Error(`Item type not in policy: ${d.itemType}`);
    }
  }
  const availableTypes = getItemCountByType(policy);
  const damageCounts: Record<string, number> = {};
  for (const d of damages) {
    damageCounts[d.itemType] = (damageCounts[d.itemType] || 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (availableTypes[type] || 0)) {
      throw new Error(`More damages for ${type} than insured`);
    }
  }
}

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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PREMIUM = 25;
const COMPONENT_INSURANCE = 250;

function getBasePremium(item: ItemInput): number {
  const itemBase = BASE_PREMIUMS[item.type];
  if (itemBase !== undefined) return itemBase;
  return COMPONENT_PREMIUM;
}

function getInsuranceValue(item: ItemInput): number {
  const itemValue = INSURANCE_VALUES[item.type];
  if (itemValue !== undefined) return itemValue;
  return COMPONENT_INSURANCE;
}

function calculateComponentPremium(components: ItemInput[]): number {
  const counts: Record<string, number> = {};
  for (const comp of components) {
    counts[comp.type] = (counts[comp.type] || 0) + 1;
  }
  let total = 0;
  for (const count of Object.values(counts)) {
    total += count === 3 ? 60 : count * 25;
  }
  return total;
}

function calculateQuote(items: ItemInput[], customer: { yearsWithMHPCO: number }, isFirstContract: boolean): { premium: number } {
  if (items.length === 0) return { premium: 5 };
  const components = items.filter((item) => COMPONENT_TYPES.has(item.type));
  const mainItems = items.filter((item) => !COMPONENT_TYPES.has(item.type));
  const mainBase = mainItems.reduce((sum, item) => sum + getBasePremium(item), 0);
  const compBase = calculateComponentPremium(components);
  const totalBase = mainBase + compBase;
  const itemModifiers = mainItems.reduce((sum, item) => sum + getItemModifier(item), 0);
  let policyModifiers = 0;
  if (customer.yearsWithMHPCO >= 2) {
    policyModifiers -= totalBase * 0.2;
  }
  policyModifiers += totalBase * 0.1;
  if (!isFirstContract) {
    policyModifiers -= totalBase * 0.15;
  }
  const total = totalBase + itemModifiers + policyModifiers;
  return { premium: Math.ceil(total) + 5 };
}

function createPolicy(items: ItemInput[]): PolicyRecord {
  let insuranceSum = 0;
  for (const item of items) {
    insuranceSum += getInsuranceValue(item);
  }
  return {
    items: [...items],
    insuranceSum,
    cap: insuranceSum * 2,
    remainingCap: insuranceSum * 2,
  };
}

function getItemCountByType(policy: PolicyRecord): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of policy.items) {
    counts[item.type] = (counts[item.type] || 0) + 1;
  }
  return counts;
}

function calculateClaimPayout(policy: PolicyRecord, damages: { itemType: string; amount: number }[]): number {
  const availableTypes = getItemCountByType(policy);
  const damageCounts: Record<string, number> = {};
  for (const d of damages) {
    damageCounts[d.itemType] = (damageCounts[d.itemType] || 0) + 1;
  }
  let totalPayout = 0;
  for (const damage of damages) {
    const item = policy.items.find((i) => i.type === damage.itemType);
    let reimbursement = damage.amount;
    if (item && item.enchantment !== undefined && item.enchantment >= 8) {
      reimbursement = damage.amount * 0.5;
    } else if (item && item.material === "dragon") {
      reimbursement = damage.amount;
    }
    const payout = Math.floor(Math.max(0, reimbursement - 100));
    totalPayout += payout;
  }
  return Math.min(totalPayout, policy.remainingCap);
}

function getItemModifier(item: ItemInput): number {
  const base = getBasePremium(item);
  let modifier = 0;
  if (item.cursed) {
    modifier += base * 0.5;
  }
  if (item.enchantment !== undefined && item.enchantment >= 5) {
    modifier += base * 0.3;
  }
  return modifier;
}

export function processScenario(input: ScenarioInput): ScenarioOutput {
  let contractCount = 0;
  const policies: PolicyRecord[] = [];
  const results = input.steps.map((step) => {
    if (step.op === "quote") {
      validateItems(step.items);
      contractCount++;
      const premium = calculateQuote(step.items, input.customer, contractCount === 1);
      policies.push(createPolicy(step.items));
      return premium;
    }
    const policy = policies[step.policy];
    validateDamages(step.incident.damages, policy);
    const payout = calculateClaimPayout(policy, step.incident.damages);
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
}