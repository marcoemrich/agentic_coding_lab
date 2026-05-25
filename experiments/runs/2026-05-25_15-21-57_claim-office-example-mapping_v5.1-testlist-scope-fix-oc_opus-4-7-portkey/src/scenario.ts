type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCH_CLAIM_THRESHOLD = 8;
const HIGH_ENCH_REIMBURSEMENT_RATE = 0.5;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function basePremiumForComponentGroup(count: number): number {
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM;
  return count * COMPONENT_PREMIUM;
}

type PremiumLine = { base: number; item?: Item };

function buildPremiumLines(items: Item[]): PremiumLine[] {
  const lines: PremiumLine[] = [];
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      lines.push({ base: MAIN_ITEM_BASE_PREMIUMS[item.type] ?? 0, item });
    }
  }
  for (const count of componentCounts.values()) {
    lines.push({ base: basePremiumForComponentGroup(count) });
  }
  return lines;
}

function itemSurcharge(line: PremiumLine): number {
  if (!line.item) return 0;
  let surcharge = 0;
  if (line.item.cursed) surcharge += line.base * CURSED_SURCHARGE_RATE;
  if ((line.item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += line.base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function premiumForQuote(
  step: QuoteStep,
  customer: Scenario["customer"],
  isFollowUp: boolean,
): number {
  const lines = buildPremiumLines(step.items);
  const basePolicy = lines.reduce((sum, line) => sum + line.base, 0);
  const itemSurcharges = lines.reduce((sum, line) => sum + itemSurcharge(line), 0);
  const firstInsurance = basePolicy * FIRST_INSURANCE_RATE;
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? basePolicy * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUp = isFollowUp ? basePolicy * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(
    basePolicy + itemSurcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE,
  );
}

// --- Claim logic ---

function insuranceValueForItem(item: Item): number {
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  return MAIN_ITEM_INSURANCE_VALUES[item.type] ?? 0;
}

function insuranceSumForItems(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueForItem(item), 0);
}

type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

function reimbursementFor(item: Item, damage: number): number {
  // High-enchantment clause wins over dragon material when both apply.
  if ((item.enchantment ?? 0) >= HIGH_ENCH_CLAIM_THRESHOLD) {
    return damage * HIGH_ENCH_REIMBURSEMENT_RATE;
  }
  // Dragon material and standard cases both fully reimburse.
  return damage;
}

function payoutForDamage(item: Item, damage: number): number {
  const reimbursed = reimbursementFor(item, damage);
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

function countByType(items: { type: string }[] | { itemType: string }[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const entry of items as Array<{ type?: string; itemType?: string }>) {
    const key = (entry.type ?? entry.itemType) as string;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function validateClaim(step: ClaimStep, policy: Policy): void {
  const damages = step.incident.damages;
  const insuredCounts = countByType(policy.items);
  const damagedCounts = new Map<string, number>();
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    if (!insuredCounts.has(damage.itemType)) {
      throw new Error(`damaged item type "${damage.itemType}" is not part of the policy`);
    }
    damagedCounts.set(damage.itemType, (damagedCounts.get(damage.itemType) ?? 0) + 1);
  }
  for (const [type, count] of damagedCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`more damages of type "${type}" than insured items`);
    }
  }
}

function processClaim(step: ClaimStep, policy: Policy): { payout: number; remainingCap: number } {
  validateClaim(step, policy);
  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    const item = policy.items.find((it) => it.type === damage.itemType);
    if (!item) continue;
    totalPayout += payoutForDamage(item, damage.amount);
  }
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  const finalPayout = Math.floor(cappedPayout);
  policy.remainingCap -= finalPayout;
  return { payout: finalPayout, remainingCap: policy.remainingCap };
}

function validateQuoteItems(items: Item[]): void {
  for (const item of items) {
    if (!isComponent(item) && !(item.type in MAIN_ITEM_BASE_PREMIUMS)) {
      throw new Error(`unknown item type "${item.type}"`);
    }
  }
}

export function runScenario(input: unknown): { results: unknown[] } {
  const scenario = input as Scenario;
  const policies: Policy[] = [];
  let quoteCount = 0;

  const results = scenario.steps.map((step) => {
    if (step.op === "quote") {
      validateQuoteItems(step.items);
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      const premium = premiumForQuote(step, scenario.customer, isFollowUp);
      const insuranceSum = insuranceSumForItems(step.items);
      policies.push({
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * CAP_MULTIPLIER,
      });
      return { premium };
    }
    // claim
    const policy = policies[step.policy];
    return processClaim(step, policy);
  });
  return { results };
}
