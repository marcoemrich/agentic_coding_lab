// MHPCO Claim Office -- core implementation

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: DamageEntry[];
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteStepResult {
  premium: number;
}

export interface ClaimStepResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteStepResult | ClaimStepResult;

// Per-type base premium for the standard (non-component) item types.
// Component types (rune, moonstone) follow component pricing instead and
// are NOT listed here -- their per-item unit price lives in COMPONENT_BASE_PREMIUM.
const STANDARD_BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

// Flat processing fee charged on every quote, on top of any per-item premium.
const PROCESSING_FEE = 5;

// First insurance adds 10% on top of the base premium for every item.
const FIRST_INSURANCE_RATE = 0.1;

// Per-type base premium for a component type: a full block of COMPONENT_BLOCK_SIZE
// costs the block premium; otherwise each component costs COMPONENT_BASE_PREMIUM.
const componentBasePremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_BASE_PREMIUM;

// Per-type base premium for a standard (non-component) item: look up the unit
// price by type and multiply by count. Throws on unknown types.
const standardBasePremium = (type: string, count: number): number => {
  const unit = STANDARD_BASE_PREMIUM_BY_TYPE[type];
  if (unit === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return unit * count;
};

// Per-type base premium: components use block pricing; all other types use the
// per-unit lookup in STANDARD_BASE_PREMIUM_BY_TYPE (unknown types throw).
//   - componentBasePremium handles the block-of-3 discount rule
//   - standardBasePremium handles per-unit pricing for known standard types
export const computeBasePremium = (items: Item[]): number => {
  // Group items by type so component blocks of COMPONENT_BLOCK_SIZE get the block price.
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let totalPremium = 0;
  for (const [type, count] of counts) {
    totalPremium += COMPONENT_TYPES.has(type)
      ? componentBasePremium(count)
      : standardBasePremium(type, count);
  }
  return totalPremium;
};

export const computePremium = (
  items: Item[],
  _customer: Customer,
  _quoteIndex: number,
): number => {
  const base = computeBasePremium(items);
  return Math.ceil(base + base * FIRST_INSURANCE_RATE + PROCESSING_FEE);
};
