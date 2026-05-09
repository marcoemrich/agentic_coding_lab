import type {
  Scenario,
  Policy,
  StepResult,
  Item,
  DamageEntry,
  Customer,
} from './types.js';

// ── Item catalogues ────────────────────────────────────────────────────────────

const MAIN_ITEMS: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const VALID_COMPONENT_TYPES = new Set(['rune', 'moonstone']);

const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEAR_THRESHOLD = 2;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const CAP_MULTIPLIER = 2;

// ── Error ─────────────────────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isMainItem(type: string): boolean {
  return Object.prototype.hasOwnProperty.call(MAIN_ITEMS, type);
}

function isComponent(type: string): boolean {
  return VALID_COMPONENT_TYPES.has(type);
}

function isValidItemType(type: string): boolean {
  return isMainItem(type) || isComponent(type);
}

function componentGroupBasePremium(count: number): number {
  if (count % COMPONENT_BLOCK_SIZE === 0) {
    return (count / COMPONENT_BLOCK_SIZE) * COMPONENT_BLOCK_PREMIUM;
  }
  return count * COMPONENT_BASE_PREMIUM;
}

// ── Quote ─────────────────────────────────────────────────────────────────────

export function computeQuotePremium(
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  // Validate
  for (const item of items) {
    if (!isValidItemType(item.type)) {
      throw new AppError(`Unknown item type: ${item.type}`);
    }
  }

  // Policy base premium = sum of item base premiums (with component block discounts)
  const componentCounts = new Map<string, number>();
  let policyBasePremium = 0;

  for (const item of items) {
    if (isMainItem(item.type)) {
      policyBasePremium += MAIN_ITEMS[item.type].basePremium;
    } else {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }

  for (const [, count] of componentCounts) {
    policyBasePremium += componentGroupBasePremium(count);
  }

  // Item-specific surcharges (only for main items; components have no curse/enchantment)
  let itemSurcharges = 0;
  for (const item of items) {
    if (!isMainItem(item.type)) continue;
    const base = MAIN_ITEMS[item.type].basePremium;
    if (item.cursed) {
      itemSurcharges += CURSE_SURCHARGE_RATE * base;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      itemSurcharges += HIGH_ENCHANTMENT_SURCHARGE_RATE * base;
    }
  }

  // Policy-wide modifiers (applied to policy base premium)
  let policyModifiers = 0;
  // First insurance surcharge always applies to every quote
  policyModifiers += FIRST_INSURANCE_RATE * policyBasePremium;
  // Follow-up discount for second contract onwards
  if (isFollowUpContract) {
    policyModifiers -= FOLLOWUP_DISCOUNT_RATE * policyBasePremium;
  }
  // Loyalty discount for long-standing customers
  if (customer.yearsWithMHPCO >= LOYALTY_YEAR_THRESHOLD) {
    policyModifiers -= LOYALTY_DISCOUNT_RATE * policyBasePremium;
  }

  const totalBeforeFee = policyBasePremium + itemSurcharges + policyModifiers;
  return Math.ceil(totalBeforeFee + PROCESSING_FEE);
}

function computeInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    if (isMainItem(item.type)) {
      sum += MAIN_ITEMS[item.type].insuranceValue;
    } else {
      sum += COMPONENT_INSURANCE_VALUE;
    }
  }
  return sum;
}

// ── Claim ─────────────────────────────────────────────────────────────────────

export function computeClaimPayout(
  policy: Policy,
  damages: DamageEntry[],
): { payout: number; newRemainingCap: number } {
  // Validate damage amounts
  for (const dmg of damages) {
    if (dmg.amount < 0) {
      throw new AppError(`Damage amount must not be negative: ${dmg.amount}`);
    }
    if (!isValidItemType(dmg.itemType)) {
      throw new AppError(`Unknown item type in damage: ${dmg.itemType}`);
    }
  }

  // Count policy items and damage items per type
  const policyCounts = new Map<string, number>();
  for (const item of policy.items) {
    policyCounts.set(item.type, (policyCounts.get(item.type) ?? 0) + 1);
  }

  const damageCounts = new Map<string, number>();
  for (const dmg of damages) {
    damageCounts.set(dmg.itemType, (damageCounts.get(dmg.itemType) ?? 0) + 1);
  }

  for (const [type, count] of damageCounts) {
    const available = policyCounts.get(type) ?? 0;
    if (available === 0) {
      throw new AppError(`Item type not covered by policy: ${type}`);
    }
    if (count > available) {
      throw new AppError(
        `Damage entries (${count}) exceed insured items (${available}) for type: ${type}`,
      );
    }
  }

  // Compute individual payouts
  const usedIndex = new Map<string, number>();
  let totalRawPayout = 0;

  for (const dmg of damages) {
    const idx = usedIndex.get(dmg.itemType) ?? 0;
    const matchingItems = policy.items.filter(i => i.type === dmg.itemType);
    const item = matchingItems[idx];
    usedIndex.set(dmg.itemType, idx + 1);

    let reimbursement: number;
    if ((item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
      // 50% rule wins even over dragon material
      reimbursement = dmg.amount * 0.5;
    } else if (item?.material === 'dragon') {
      reimbursement = dmg.amount;
    } else {
      reimbursement = dmg.amount;
    }

    totalRawPayout += Math.max(reimbursement - DEDUCTIBLE, 0);
  }

  // Apply cap and round down (MHPCO's favor)
  const cappedPayout = Math.min(totalRawPayout, policy.remainingCap);
  const finalPayout = Math.floor(cappedPayout);
  const newRemainingCap = policy.remainingCap - finalPayout;

  return { payout: finalPayout, newRemainingCap };
}

// ── Scenario processor ────────────────────────────────────────────────────────

export function processScenario(scenario: Scenario): StepResult[] {
  const { customer, steps } = scenario;
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  let quoteCount = 0;

  for (const step of steps) {
    if (step.op === 'quote') {
      const isFollowUp = quoteCount > 0;
      const premium = computeQuotePremium(step.items, customer, isFollowUp);
      quoteCount++;

      const insuranceSum = computeInsuranceSum(step.items);
      policies.push({
        items: step.items,
        insuranceSum,
        remainingCap: CAP_MULTIPLIER * insuranceSum,
      });

      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      if (!policy) {
        throw new AppError(`Policy not found at step index: ${step.policy}`);
      }

      const { payout, newRemainingCap } = computeClaimPayout(policy, step.incident.damages);
      policy.remainingCap = newRemainingCap;

      results.push({ payout, remainingCap: newRemainingCap });
    }
  }

  return results;
}
